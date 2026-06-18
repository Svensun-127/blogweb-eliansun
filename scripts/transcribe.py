"""
transcribe.py — Download podcast audio and transcribe with faster-whisper.
Output SRT format to assets/transcripts/{guid}-en.txt
Skips episodes that already have a transcript file.
Usage:
    python scripts/transcribe.py                  # Process all episodes
    python scripts/transcribe.py --episode GUID   # Process single episode
"""
import json
import os
import sys
import tempfile
import urllib.request
from pathlib import Path

# Project root is parent of scripts/
ROOT = Path(__file__).resolve().parent.parent
JSON_PATH = ROOT / "assets" / "data" / "podcast.json"
OUT_DIR = ROOT / "assets" / "transcripts"

MODEL_SIZE = "distil-large-v3"


def load_episodes() -> list[dict]:
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data.get("episodes", [])


def download_audio(url: str, dest_path: str) -> None:
    """Download audio file to a temporary location."""
    print(f"  Downloading {url[:80]}...")
    req = urllib.request.Request(url, headers={"User-Agent": "ElianTranscript/1.0"})
    with urllib.request.urlopen(req, timeout=300) as resp:
        total = int(resp.headers.get("Content-Length", 0))
        downloaded = 0
        with open(dest_path, "wb") as f:
            while True:
                chunk = resp.read(8192)
                if not chunk:
                    break
                f.write(chunk)
                downloaded += len(chunk)
                if total:
                    pct = downloaded * 100 // total
                    # Print every 10%
                    if downloaded % (max(total // 10, 1)) < len(chunk):
                        print(f"    {pct}% ({downloaded}/{total})")


def format_srt_timestamp(seconds: float) -> str:
    """Convert seconds to SRT timestamp HH:MM:SS,mmm."""
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds - int(seconds)) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def transcribe_episode(guid: str, title: str, audio_url: str) -> None:
    """Transcribe a single episode and write SRT output."""
    from faster_whisper import WhisperModel

    out_path = OUT_DIR / f"{guid}-en.txt"
    if out_path.exists():
        print(f"  Skip: transcript already exists at {out_path}")
        return

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    with tempfile.NamedTemporaryFile(suffix=".m4a", delete=False) as tmp:
        tmp_path = tmp.name

    try:
        download_audio(audio_url, tmp_path)

        print(f"  Loading model '{MODEL_SIZE}'...")
        model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")
        print(f"  Transcribing '{title}'...")
        segments, info = model.transcribe(tmp_path, beam_size=5, language="en")

        srt_lines = []
        seq = 1
        for seg in segments:
            start_ts = format_srt_timestamp(seg.start)
            end_ts = format_srt_timestamp(seg.end)
            text = seg.text.strip()
            if not text:
                continue
            srt_lines.append(f"{seq}")
            srt_lines.append(f"{start_ts} --> {end_ts}")
            srt_lines.append(text)
            srt_lines.append("")
            seq += 1

        srt_content = "\n".join(srt_lines)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(srt_content)

        print(f"  Done: {seq - 1} segments → {out_path}")

    finally:
        # Clean up temp file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Transcribe podcast episodes")
    parser.add_argument(
        "--episode", type=str, default=None, help="Transcribe a single episode by GUID"
    )
    args = parser.parse_args()

    episodes = load_episodes()
    print(f"Loaded {len(episodes)} episodes from {JSON_PATH}")

    if args.episode:
        episodes = [ep for ep in episodes if ep["guid"] == args.episode]
        if not episodes:
            print(f"Episode {args.episode} not found")
            return

    for ep in episodes:
        guid = ep["guid"]
        title = ep["title"]
        audio_url = ep.get("audioUrl", "")
        if not audio_url:
            print(f"  Skip '{title}': no audioUrl")
            continue
        print(f"\n[{guid}] {title}")
        try:
            transcribe_episode(guid, title, audio_url)
        except Exception as exc:
            print(f"  ERROR: {exc}")
            continue

    print("\nAll done.")


if __name__ == "__main__":
    main()