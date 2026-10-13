# MathuraNow Braj Panchang & Rashifal API

Free daily **Braj / Mathura-Vrindavan Panchang** and **Rashifal** as static JSON, in **Hindi and English**.
No API key, no sign-up, no server to run: plain `GET` requests to static files.

- Documentation (always the latest): <https://mathuranow.in/panchang-api/>
- Hindi documentation: <https://mathuranow.in/hi/panchang-api/>
- OpenAPI 3.1 description: [`openapi.json`](openapi.json) (also served at <https://mathuranow.in/api/v1/openapi.json>)
- Embeddable widget: <https://mathuranow.in/api/v1/widget.js>

## What this is, and what it is not

- The **Panchang** is for Mathura / Braj. It is entered each day by a named author on the MathuraNow team.
  It is **not an all-India calculator** and it is not computed from your coordinates.
- The **Rashifal** is **AI-assisted and human-reviewed**: drafted with AI help and published only after a person has read and approved it.
  Every Rashifal file carries a `note` field that you should show with the text. It is for faith and entertainment.
- The data is edited by people, so an entry can be missing for a day: see [pending handling](#when-status-is-pending).

## Endpoints

All endpoints are `GET`, return JSON, and send `Access-Control-Allow-Origin: *` (use them straight from a browser).

| Endpoint | Meaning |
| --- | --- |
| `https://mathuranow.in/api/v1/panchang/today.en.json` | Today's Panchang (English) |
| `https://mathuranow.in/api/v1/panchang/today.hi.json` | Today's Panchang (Hindi) |
| `https://mathuranow.in/api/v1/rashifal/today.en.json` | Today's Rashifal (English) |
| `https://mathuranow.in/api/v1/rashifal/today.hi.json` | Today's Rashifal (Hindi) |
| `https://mathuranow.in/api/v1/panchang/YYYY-MM-DD.en.json` | Panchang for a date (also `.hi.json`) |
| `https://mathuranow.in/api/v1/rashifal/YYYY-MM-DD.hi.json` | Rashifal for a date (also `.en.json`) |

A dated file exists only for dates that have a published entry (otherwise HTTP 404). "Today" is the IST (UTC+05:30) day.

## Quick start (5 minutes)

```bash
curl -s https://mathuranow.in/api/v1/panchang/today.en.json
```

```javascript
fetch('https://mathuranow.in/api/v1/panchang/today.en.json')
  .then(function (r) { return r.json(); })
  .then(function (d) {
    if (d.status !== 'published') { return; }          // placeholder until the author submits
    console.log(d.data.fields.tithi, d.data.fields.sunrise);
    // show d.attribution_html (the credit line) next to the data
  });
```

Or embed the ready-made widget:

```html
<div data-mathuranow-widget="panchang" data-lang="en"></div>
<script src="https://mathuranow.in/api/v1/widget.js" async></script>
```

More: [`examples/`](examples/).

## Field reference

### Envelope (every file)

| Field | Type | Meaning |
| --- | --- | --- |
| `version` | string | Always `"v1"`. |
| `widget` | string | `"panchang"` or `"rashifal"`. |
| `date` | string | The IST day the entry is for, `YYYY-MM-DD`. |
| `lang` | string | `"en"` or `"hi"`. |
| `status` | string | `"published"` or `"pending"` (see below). |
| `updated` | string \| null | When the entry was last saved (UTC, ISO 8601). `null` while pending. |
| `expires` | string \| null | Today files only: the next IST midnight (UTC). `null` in dated files. |
| `data` | object \| null | The entry. `null` while pending. |
| `credit` | object \| null | The named author: `name`, `photo_url`, `author_url`. Never an e-mail address. |
| `source`, `source_url` | string | `"MathuraNow"`, `https://mathuranow.in/`. |
| `license` | string | `"CC BY-NC 4.0"`. |
| `attribution_html` | string | A ready credit line (HTML). Show it with the data. |
| `terms` | string | Short terms of use. |
| `note` | string | Rashifal only: the disclosure to show with the text. |

### Panchang `data`

`data.fields` (all strings, free text as entered, in the language of the file; a field can be missing):
`vaar`, `tithi`, `nakshatra`, `yoga`, `karana`, `chandra_rashi`, `muhurat`, `rahu_kaal`, `yamaganda`, `gulika_kaal`, `sunrise`, `sunset`.

`data.extra` is a list of `{ "key", "label", "value" }` items the author adds (for example `bhadra`, `panchak`, `ganda_moola`, `disha_shool`, `moonrise`, `moonset`). The keys can vary by day.

`data.ai` is `true` when the entry was drafted with AI help.

Values such as `tithi` include end times in free text (for example `"Shukla Paksha Chaturthi upto 01:13 AM, Oct 15 Panchami"`). Show them as text; do not rely on parsing them.

### Rashifal `data`

| Field | Meaning |
| --- | --- |
| `assisted` | `true` when drafted with AI help (then human-reviewed). |
| `signs` | 12 items in the traditional order: `key` (`aries` ... `pisces`), `name` (in the file's language), `text`, `ai`. |
| `methodology_url` | Page that explains how the Rashifal is prepared. |

## When `status` is `"pending"`

Until the author submits the entry for the new day, the "today" file is a placeholder:
`"status": "pending"`, `"data": null`, `"updated": null`. It never shows yesterday's data.
Show nothing or a "coming soon" message, and try again later (the files are cached for up to 5 minutes).

## Update time and caching

- The author enters the next day's entry in the evening (target 11:00 PM IST). At **12:00 AM IST** the "today" files switch to the entry of the new day.
- `today.*.json`: `Cache-Control: public, max-age=300` (5 minutes). Dated files and `widget.js`: 1 hour.
- Please do not poll more than once every 5 minutes, and do not add random query strings. Use the `expires` field to know when "today" ends.

## License and attribution

- **Data:** [Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).
  Free for non-commercial use **with attribution**. Show the credit line wherever the data appears, for example:

  ```html
  Source: <a href="https://mathuranow.in/" rel="noopener">MathuraNow</a> &middot; Author name
  ```

  Every file contains this line, ready to use, in `attribution_html`. The link back to <https://mathuranow.in/> must stay visible.
- **Example code in this repository:** MIT (see [`LICENSE`](LICENSE)).
- This repository does not contain the data itself; the data is served by <https://mathuranow.in/>.

## Commercial use / licensing

Commercial use, resale, or republishing the data as your own needs written permission:
**editor@mathuranow.in**

## Changelog

See [`CHANGELOG.md`](CHANGELOG.md).
