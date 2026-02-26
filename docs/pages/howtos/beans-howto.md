---
sidebar_label: Beans
category: "Getting Started"
---

![Beans banner](/beans-banner.png)

# Beans API & MCP

**Version:** 0.1 &nbsp;|&nbsp; **Status:** Live

It's a news and blog API sourcing data from **7 000+ publishers** — business, finance, tech, corporate blogs, and broader global topics. Think of it as a fire hose of content that somebody already cleaned up for you.

## What Beans actually does

Under the hood our pipeline (**Barista** — yes, we like coffee names) continuously ingests and tags content with:

- **Categories** and topic tags
- **Sentiment** analysis
- **Extracted Entities** — people, companies, regions, products
- **Social media engagement signals** for trend relevance
- **Related-article linking** across publishers

That's right, it is an RSS feed reader (on steroid). It gives you clean, queryable JSON so you can search, rank, monitor, and build whatever you what.

## Key features

- **Vector semantic search** in one endpoint — just add `q`
- **Adjustable similarity threshold** with `acc` (0.0–1.0, default 0.75)
- **Filters galore** — categories, entities, regions, sources, time windows
- **Trending signals** powered by social engagement data
- **Entity & sentiment enrichment** ready for analytics and AI pipelines

## Authentication

All requests use a Bearer token. Grab your API key from the [developer portal](/settings/api-keys).

```
Authorization: Bearer YOUR-API-KEY
```

## Base URL

```
https://cafecito-apis-main-948451c.d2.zuplo.dev
```

All Beans endpoints live under the `/beans` path prefix.

## Core endpoints

### Health check

```
GET https://cafecito-apis-main-948451c.d2.zuplo.dev/beans/health
```

### Discovery / metadata

| Endpoint | What you get |
| -------- | ------------ |
| `GET /beans/categories` | Unique article categories (AI, Cybersecurity, Politics …) |
| `GET /beans/entities` | Named entities (people, orgs, products) |
| `GET /beans/regions` | Geographic regions mentioned in articles |
| `GET /beans/publishers/sources` | Publisher IDs / domain names we ingest from |
| `GET /beans/publishers` | Full publisher metadata for given IDs |

All metadata endpoints support pagination with `offset` (default `0`) and `limit` (default `16`, max `100`).

### Search articles

| Endpoint | Sorting |
| -------- | ------- |
| `GET /beans/articles/latest` | By relevance (when `q` provided), otherwise newest first |
| `GET /beans/articles/trending` | By relevance (when `q` provided), otherwise by trend score |

**Query parameters:**

| Param | Type | Description |
| ----- | ---- | ----------- |
| `q` | string (3–512) | Natural language search query (triggers vector search) |
| `acc` | number (0–1) | Cosine similarity threshold — higher = stricter (default `0.75`) |
| `kind` | `news` \| `blog` | Filter by content type |
| `categories` | string[] | Filter by categories (case-sensitive) |
| `entities` | string[] | Filter by named entities (case-sensitive) |
| `regions` | string[] | Filter by regions (case-sensitive) |
| `sources` | string[] | Filter by publisher IDs (case-sensitive) |
| `published_since` | ISO 8601 datetime | Only articles published on or after this time |
| `with_content` | boolean | Include full article text (default `false`) |
| `offset` | integer | Pagination offset |
| `limit` | integer (1–100) | Results per page (default `16`) |

**Response:** `200 OK` → array of `Bean` objects (or `null`).

Each `Bean` includes: `url`, `kind`, `source`, `title`, `summary`, `content`, `image_url`, `author`, `created`, `entities`, `regions`, `categories`, `sentiments`.

### MCP server

```
POST https://cafecito-apis-main-948451c.d2.zuplo.dev/beans/mcp
```

Beans endpoints exposed as MCP tools for AI agent integration.

---

## Code samples

Below are real-world examples. Replace `YOUR-API-KEY` with the key you generated in the [developer portal](/).

### 1. Latest news on market performance & economy (published today)

**JavaScript**

```js
const API_KEY = process.env.CAFECITO_API_KEY;
const BASE = "https://cafecito-apis-main-948451c.d2.zuplo.dev";

const today = new Date().toISOString().split("T")[0] + "T00:00:00Z";

const params = new URLSearchParams({
  q: "market performance and economy",
  kind: "news",
  published_since: today,
  limit: "10",
});

const res = await fetch(`${BASE}/beans/articles/latest?${params}`, {
  headers: { Authorization: `Bearer ${API_KEY}` },
});

if (!res.ok) throw new Error(`HTTP ${res.status}`);
const articles = await res.json();
articles?.forEach((a) => console.log(a.title, "→", a.url));
```

**Python**

```python
import os, requests
from datetime import date

API_KEY = os.environ["CAFECITO_API_KEY"]
BASE = "https://cafecito-apis-main-948451c.d2.zuplo.dev"

today = date.today().isoformat() + "T00:00:00Z"

resp = requests.get(
    f"{BASE}/beans/articles/latest",
    headers={"Authorization": f"Bearer {API_KEY}"},
    params={
        "q": "market performance and economy",
        "kind": "news",
        "published_since": today,
        "limit": 10,
    },
    timeout=30,
)
resp.raise_for_status()

for article in resp.json() or []:
    print(article.get("title"), "→", article.get("url"))
```

---

### 2. Latest news about China (filter by region)

**JavaScript**

```js
const params = new URLSearchParams();
params.append("regions", "China");
params.append("kind", "news");
params.append("limit", "10");

const res = await fetch(`${BASE}/beans/articles/latest?${params}`, {
  headers: { Authorization: `Bearer ${API_KEY}` },
});
const articles = await res.json();
articles?.forEach((a) => console.log(a.title, "|", a.regions));
```

**Python**

```python
resp = requests.get(
    f"{BASE}/beans/articles/latest",
    headers={"Authorization": f"Bearer {API_KEY}"},
    params={"regions": ["China"], "kind": "news", "limit": 10},
    timeout=30,
)
resp.raise_for_status()

for article in resp.json() or []:
    print(article.get("title"), "|", article.get("regions"))
```

---

### 3. Latest news about FAA (filter by entity)

**JavaScript**

```js
const params = new URLSearchParams();
params.append("entities", "FAA");
params.append("kind", "news");
params.append("limit", "10");

const res = await fetch(`${BASE}/beans/articles/latest?${params}`, {
  headers: { Authorization: `Bearer ${API_KEY}` },
});
const articles = await res.json();
articles?.forEach((a) => console.log(a.title, "|", a.entities));
```

**Python**

```python
resp = requests.get(
    f"{BASE}/beans/articles/latest",
    headers={"Authorization": f"Bearer {API_KEY}"},
    params={"entities": ["FAA"], "kind": "news", "limit": 10},
    timeout=30,
)
resp.raise_for_status()

for article in resp.json() or []:
    print(article.get("title"), "|", article.get("entities"))
```

---

### 4. Filter by publisher — news from [Barchart](https://www.barchart.com) only

**JavaScript**

```js
const params = new URLSearchParams();
params.append("sources", "barchart");
params.append("kind", "news");
params.append("limit", "10");

const res = await fetch(`${BASE}/beans/articles/latest?${params}`, {
  headers: { Authorization: `Bearer ${API_KEY}` },
});
const articles = await res.json();
articles?.forEach((a) => console.log(a.source, "—", a.title));
```

**Python**

```python
resp = requests.get(
    f"{BASE}/beans/articles/latest",
    headers={"Authorization": f"Bearer {API_KEY}"},
    params={"sources": ["barchart"], "kind": "news", "limit": 10},
    timeout=30,
)
resp.raise_for_status()

for article in resp.json() or []:
    print(article.get("source"), "—", article.get("title"))
```

---

### 5. List all publishers (IDs / domain names)

**JavaScript**

```js
let offset = 0;
const limit = 100;
const allSources = [];

while (true) {
  const res = await fetch(
    `${BASE}/beans/publishers/sources?offset=${offset}&limit=${limit}`,
    { headers: { Authorization: `Bearer ${API_KEY}` } },
  );
  const batch = await res.json();
  if (!batch || batch.length === 0) break;
  allSources.push(...batch);
  offset += limit;
}

console.log(`Total publishers: ${allSources.length}`);
console.log(allSources);
```

**Python**

```python
all_sources = []
offset = 0
limit = 100

while True:
    resp = requests.get(
        f"{BASE}/beans/publishers/sources",
        headers={"Authorization": f"Bearer {API_KEY}"},
        params={"offset": offset, "limit": limit},
        timeout=30,
    )
    resp.raise_for_status()
    batch = resp.json() or []
    if not batch:
        break
    all_sources.extend(batch)
    offset += limit

print(f"Total publishers: {len(all_sources)}")
print(all_sources)
```

---

## Best practices

- **Start with `acc=0.75`**, then tweak up for precision or down for recall.
- **Use `published_since`** to keep feeds fresh — nobody wants yesterday's news. (Well, sometimes they do, but you get the point.)
- **Use `with_content=true`** when you need full text for RAG / summarization.
- **Paginate** with `offset` + `limit` for stable ingestion pipelines.

## Use cases that aren't boring

- AI assistants and RAG workflows that need fresh context
- Finance dashboards that actually stay current
- Media trend detection — who's talking about what and when
- Analyst workflows that want enrichment-ready JSON, not raw HTML

## Related docs

- [Cafecito Introduction](/introduction)
- [Beans Pricing](/pricing/beans-pricing)
- [Beans API Reference](/api/beans)

_Last updated: February 26, 2026_
