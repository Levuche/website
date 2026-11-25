# Buildbase seed content

The text the site showed before it moved to Buildbase, in the shape each
Buildbase entry takes. Enter it in the console (or through the Buildbase
Console connector) once per environment, development first. The site reads
none of these files; they are a record and a starting point.

Words in [square brackets] are still placeholders from the design boards
(prices, fees, limits): replace them before publishing to production.

- `collections/*.json`: one file per collection, its fields and records.
- `rich-content/*.md`: one file per rich content entry; the file name is the slug.
- `faqs/*.json`: one file per FAQ collection.
- `forms/contact.json`: the fields of the Contact form.

The legal pages (`legal-<slug>`) have no seed text on purpose: their text
must be written and reviewed first.
