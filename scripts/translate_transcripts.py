"""
translate_transcripts.py — Translate English SRT transcripts to Chinese via OPUS-MT.
Uses Helsinki-NLP/opus-mt-en-zh model (transformers pipeline).
Output: assets/transcripts/{guid}-zh.txt (same SRT timestamps, Chinese text).
Skips episodes that already have a Chinese transcript file.
Usage:
    python scripts/translate_transcripts.py                  # Process all
    python scripts/translate_transcripts.py --episode GUID   # Process single
"""
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JSON_PATH = ROOT / "assets" / "data" / "podcast.json"
OUT_DIR = ROOT / "assets" / "transcripts"


def load_episodes() -> list[dict]:
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data.get("episodes", [])


def parse_srt(text: str) -> list[dict]:
    """Parse SRT content into a list of {seq, start, end, text} dicts."""
    segments = []
    lines = text.strip().splitlines()
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue
        # Sequence number
        try:
            seq = int(line)
        except ValueError:
            i += 1
            continue
        i += 1
        if i >= len(lines):
            break
        # Timestamp line
        ts_line = lines[i].strip()
        parts = ts_line.split(" --> ")
        if len(parts) != 2:
            i += 1
            continue
        start, end = parts[0], parts[1]
        i += 1
        # Text lines
        texts = []
        while i < len(lines) and lines[i].strip():
            texts.append(lines[i].strip())
            i += 1
        segments.append({
            "seq": seq,
            "start": start,
            "end": end,
            "text": " ".join(texts),
        })
        # Skip blank line separator
        while i < len(lines) and not lines[i].strip():
            i += 1
    return segments


def segments_to_srt(segments: list[dict]) -> str:
    """Convert segments back to SRT format."""
    lines = []
    for seg in segments:
        lines.append(str(seg["seq"]))
        lines.append(f"{seg['start']} --> {seg['end']}")
        lines.append(seg["text"])
        lines.append("")
    return "\n".join(lines)


def translate_segments(segments: list[dict]) -> list[dict]:
    """Translate all segment texts using OPUS-MT EN→ZH."""
    from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

    model_name = "Helsinki-NLP/opus-mt-en-zh"
    print(f"  Loading {model_name}...")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

    # Collect texts needing translation
    texts = [seg["text"] for seg in segments]

    # Translate in batches to avoid memory issues
    MAX_BATCH = 2000  # characters per batch
    results = []
    i = 0
    while i < len(texts):
        chunk_texts = []
        chunk_len = 0
        while i < len(texts) and chunk_len + len(texts[i]) < MAX_BATCH:
            chunk_texts.append(texts[i])
            chunk_len += len(texts[i])
            i += 1
        if not chunk_texts:
            # Single long segment
            chunk_texts = [texts[i]]
            i += 1

        inputs = tokenizer(chunk_texts, return_tensors="pt", padding=True, truncation=True, max_length=512)
        outputs = model.generate(**inputs, max_length=512)
        translated = [tokenizer.decode(o, skip_special_tokens=True) for o in outputs]
        results.extend(translated)

        pct = i * 100 // len(texts)
        print(f"    {pct}% ({i}/{len(texts)})")

    # Build output segments
    out = []
    for seg, zh_text in zip(segments, results):
        out.append({
            "seq": seg["seq"],
            "start": seg["start"],
            "end": seg["end"],
            "text": zh_text,
        })
    return out


def translate_episode(guid: str, title: str) -> None:
    """Translate one episode's English transcript to Chinese."""
    en_path = OUT_DIR / f"{guid}-en.txt"
    zh_path = OUT_DIR / f"{guid}-zh.txt"

    if not en_path.exists():
        print(f"  Skip: no English transcript at {en_path}")
        return

    if zh_path.exists():
        print(f"  Skip: Chinese transcript already exists at {zh_path}")
        return

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    with open(en_path, "r", encoding="utf-8") as f:
        en_text = f.read()

    segments = parse_srt(en_text)
    print(f"  {len(segments)} segments to translate")
    translated = translate_segments(segments)

    zh_text = segments_to_srt(translated)
    with open(zh_path, "w", encoding="utf-8") as f:
        f.write(zh_text)

    print(f"  Done → {zh_path}")


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Translate podcast transcripts EN→ZH")
    parser.add_argument(
        "--episode", type=str, default=None, help="Translate a single episode by GUID"
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
        print(f"\n[{guid}] {title}")
        try:
            translate_episode(guid, title)
        except Exception as exc:
            print(f"  ERROR: {exc}")
            continue

    print("\nAll done.")


if __name__ == "__main__":
    main()