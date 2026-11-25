# Buildbase seed content

The text the site showed before it moved to Buildbase, in the shape each
Buildbase entry takes. Enter it in the console (or through the Buildbase
Console connector) once per environment, development first.

The site shows this text only while no Buildbase API token is set (a local
run or a preview before Buildbase is set up), so the home and pricing pages
match the design boards. Once `BUILDBASE_API_TOKEN` is set, Buildbase is the
only source and these files are not read.

Words in [square brackets] are still placeholders from the design boards
(fees, limits): replace them before publishing to production.

- `collections/*.json`: one file per collection, its fields and records.
- `rich-content.json`: rich content entries by slug (Markdown in `content`).
- `faqs/*.json`: one file per FAQ collection.
- `billing.json`: sample Buildbase Billing add-ons, shown only while no
  Buildbase org is set. Real prices are created in Billing in the console,
  never as content.
- `forms/contact.json`: the fields of the Contact form.

The legal pages (`legal-<slug>`) have no seed text on purpose: their text
must be written and reviewed first.
