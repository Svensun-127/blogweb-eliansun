"""
sync_podcast.py — Fetch podcast RSS and generate static JSON + local XML.
Zero external dependencies (stdlib only).
Usage: python scripts/sync_podcast.py
"""
import json
import os
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime

RSS_URL = "https://feed.xyzfm.space/4xlgbpku9wwn"
OUT_JSON = os.path.join("assets", "data", "podcast.json")
OUT_XML = os.path.join("rss", "podcast.xml")

NAMESPACES = {
    "itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
    "atom": "http://www.w3.org/2005/Atom",
    "content": "http://purl.org/rss/1.0/modules/content/",
}


def clean_html(raw: str) -> str:
    """Strip HTML tags, decode entities, collapse whitespace."""
    if not raw:
        return ""
    text = re.sub(r"<[^>]+>", " ", raw)
    text = text.replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "&")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def parse_duration(dur: str) -> str:
    """Normalise HH:MM:SS / MM:SS back to HH:MM:SS."""
    if not dur:
        return ""
    dur = dur.strip()
    parts = dur.split(":")
    if len(parts) == 2:
        return f"00:{parts[0]}:{parts[1]}"
    if len(parts) == 3:
        return dur
    return ""


def format_date(pub_date: str) -> str:
    """Convert RFC-2822 pubDate to YYYY-MM-DD."""
    # Example: "Wed, 17 Jun 2026 13:32:46 GMT"
    for fmt in ("%a, %d %b %Y %H:%M:%S %Z", "%a, %d %b %Y %H:%M:%S %z"):
        try:
            return datetime.strptime(pub_date, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    # fallback: return as-is
    return pub_date


def fetch_rss(url: str) -> str:
    """Fetch RSS feed content over HTTPS."""
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "ElianPodcastSync/1.0"},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8")


def parse_feed(xml_text: str) -> dict:
    """Parse RSS XML into a structured dict."""
    root = ET.fromstring(xml_text)
    channel = root.find("channel")
    if channel is None:
        raise ValueError("No <channel> element found")

    def ch(tag: str) -> str:
        el = channel.find(tag)
        return el.text.strip() if el is not None and el.text else ""

    def ch_ns(ns_key: str, tag: str, attr: str = "") -> str:
        el = channel.find(f"{{{NAMESPACES[ns_key]}}}{tag}")
        if el is None:
            return ""
        if attr:
            return el.get(attr, "").strip()
        return el.text.strip() if el.text else ""

    def attr_ns(el, ns_key: str, tag: str, attr: str) -> str:
        sub = el.find(f"{{{NAMESPACES[ns_key]}}}{tag}")
        return sub.get(attr, "").strip() if sub is not None else ""

    channel_data = {
        "title": ch("title"),
        "description": clean_html(ch("description")),
        "image": ch_ns("itunes", "image", "href"),
        "author": ch_ns("itunes", "author"),
        "link": ch("link"),
    }

    def get_image_from_item(el) -> str:
        """Extract itunes:image href attribute from an item or channel element."""
        sub = el.find(f"{{{NAMESPACES['itunes']}}}image")
        return sub.get("href", "").strip() if sub is not None else ""

    episodes = []
    for item in channel.findall("item"):
        enclosure = item.find("enclosure")
        audio_url = enclosure.get("url", "") if enclosure is not None else ""
        duration_raw = attr_ns(item, "itunes", "duration", "") or ""
        pub_date = ch_item(item, "pubDate")
        image = get_image_from_item(item)

        # description 中清理掉「在小宇宙查看该单集文稿」
        desc_raw = ch_item(item, "description")
        desc_clean = clean_html(desc_raw)
        desc_clean = re.sub(r"\s*在小宇宙查看该单集文稿\s*", "", desc_clean).strip()

        episodes.append(
            {
                "guid": ch_item(item, "guid"),
                "title": ch_item(item, "title"),
                "pubDate": format_date(pub_date),
                "duration": parse_duration(duration_raw),
                "audioUrl": audio_url,
                "image": image,
                "link": ch_item(item, "link"),
                "description": desc_clean,
            }
        )

    return {"channel": channel_data, "episodes": episodes}


def ch_item(el, tag: str) -> str:
    sub = el.find(tag)
    return sub.text.strip() if sub is not None and sub.text else ""


def main():
    print(f"Fetching RSS from {RSS_URL} ...")
    xml_text = fetch_rss(RSS_URL)
    print(f"  -> {len(xml_text)} bytes received")

    data = parse_feed(xml_text)
    print(f"  -> {len(data['episodes'])} episodes parsed")

    # Write JSON
    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"JSON written to {OUT_JSON}")

    # Write backup XML
    os.makedirs(os.path.dirname(OUT_XML), exist_ok=True)
    with open(OUT_XML, "w", encoding="utf-8") as f:
        f.write(xml_text)
    print(f"XML  written to {OUT_XML}")

    print("Done.")


if __name__ == "__main__":
    main()