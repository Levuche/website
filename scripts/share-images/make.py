"""
Makes the share images (Open Graph and X cards) for levuche.com's fixed pages:
public/og/<name>.png, 1200x630, in the style of the brand share image
(brand kit social/levuche-og-1200x630.png, which stays the home page's image).

Blog posts and docs pages use the thumbnail set on them in Buildbase (always
1200x630) and fall back to the blog's or the docs' image here, so only the
fixed pages are listed. Run it again after changing a page's title or
description below, or adding a legal page in src/lib/legal.ts:

    python3 scripts/share-images/make.py

It needs Pillow (pip install pillow). The images are committed, so the build
doesn't need Python.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "og"
FONTS = ROOT / "src" / "fonts"
LOGO = Path(__file__).with_name("levuche-logo-on-dark.png")

WIDTH, HEIGHT = 1200, 630
LEFT = 90
NAVY = (36, 37, 122)  # #24257A
WHITE = (255, 255, 255)
YELLOW = (255, 182, 39)  # #FFB627
LAVENDER = (201, 203, 242)

# name, eyebrow, title, description: the page's heading and description, so
# keep them in step with the page.
PAGES = [
    ("pricing", "Pricing", "Pick a plan when you’re ready to sell", "Levuche plans for creators who sell packs, prompts and guides from their link in bio."),
    ("blog", "Blog", "News, guides and stories from Levuche.", ""),
    ("docs", "Docs", "How to set up and run your Levuche site.", ""),
    ("contact", "Contact", "Questions about Levuche, your site or your data?", "Write to us."),
    ("terms", "Legal", "Terms of service", "The terms for using Levuche, operated by Jagodana LLC."),
    ("privacy", "Legal", "Privacy policy", "How Levuche, operated by Jagodana LLC, collects and uses personal data."),
    ("cookies", "Legal", "Cookie policy", "The cookies levuche.com and Levuche sites use."),
    ("pack-terms", "Legal", "Pack terms for buyers", "The terms for people who buy packs on Levuche sites."),
    ("refunds", "Legal", "Refund policy", "When buyers can get their money back for packs bought on Levuche sites."),
    ("fees", "Legal", "Fees", "What Levuche charges creators, and what Stripe charges."),
    ("creator-rules", "Legal", "Creator rules", "What creators may and may not sell or publish on Levuche."),
    ("copyright", "Legal", "Copyright and takedowns", "How to report content that infringes your copyright."),
    ("security", "Trust", "Security", "How Levuche protects accounts and data, and how to report a security issue."),
    ("subprocessors", "Trust", "Subprocessors", "The third-party services that process data for Levuche."),
]


def font(weight: int, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONTS / f"Sora-{weight}.ttf"), size)


def wrap(draw: ImageDraw.ImageDraw, text: str, face, width: int) -> list[str]:
    lines: list[str] = []
    line = ""
    for word in text.split():
        trial = f"{line} {word}".strip()
        if draw.textlength(trial, font=face) <= width or not line:
            line = trial
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def fit_title(draw, text: str):
    """The largest title size, down to 52px, that fits in two lines."""
    for size in range(76, 50, -4):
        face = font(700, size)
        lines = wrap(draw, text, face, WIDTH - 2 * LEFT)
        if len(lines) <= 2:
            return face, lines, size
    return face, lines[:2], size


def make(name: str, eyebrow: str, title: str, description: str) -> None:
    image = Image.new("RGB", (WIDTH, HEIGHT), NAVY)
    draw = ImageDraw.Draw(image)

    logo = Image.open(LOGO).convert("RGBA")
    logo_width = 300
    logo = logo.resize(
        (logo_width, round(logo.height * logo_width / logo.width)), Image.LANCZOS
    )
    image.paste(logo, (LEFT + 4, 70), logo)

    y = 196
    draw.text((LEFT, y), eyebrow.upper(), font=font(600, 26), fill=YELLOW)
    y += 48

    face, lines, size = fit_title(draw, title)
    for line in lines:
        draw.text((LEFT, y), line, font=face, fill=WHITE)
        y += round(size * 1.18)

    y += 14
    body = font(400, 30)
    for line in wrap(draw, description, body, WIDTH - 2 * LEFT)[:2]:
        draw.text((LEFT, y), line, font=body, fill=LAVENDER)
        y += 42

    draw.text((LEFT, 556), "levuche.com", font=font(600, 28), fill=LAVENDER)

    OUT.mkdir(parents=True, exist_ok=True)
    image.save(OUT / f"{name}.png", optimize=True)


if __name__ == "__main__":
    for page in PAGES:
        make(*page)
    print(f"Wrote {len(PAGES)} images to {OUT.relative_to(ROOT)}")
