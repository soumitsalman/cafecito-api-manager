---
description: Cafecito Media APIs — automate the nonsense so you can do your actual job.
sidebar_label: Cafecito
sidebar_icon: coffee
---

![Cafecito banner](/cafecito-banner.png)

# Cafecito Developer Portal

Welcome to the **Cafecito** developer portal — the home base for our media product suite. We build APIs & MCPs that cut through the noise so you don't have to.

> **🚀 Launch Preview — FREE until June 30, 2026.** Sign up costs nothing. APIs cost nothing. Go Loco!

## What's on the menu

| Product | Status | What it does |
| ------- | ------ | ------------ |
| [**Beans**](/howtos/beans-howto) | ✅ Live | News & blogs — 7 000+ publishers, semantic search, trend signals |
| **Espresso** | 🔜 Coming soon | Espresso curated intelligence |
| **Cortado** | 🔜 Coming soon | Social media monkey (on crack) |

## Get started in 37 seconds

1. **Sign up** — it's free and you are already here.
2. **[Create an API key](/settings/api-keys)** — make as many as you want, they all share the same meter.
3. **Call something:**

```bash
curl -X GET "https://cafecito-apis-main-948451c.d2.zuplo.dev/beans/articles/latest?q=market+performance&limit=5" \
    -H "Authorization: Bearer YOUR-API-KEY"
```

For real, that's it. No SDK to install. No OAuth dance. Just an HTTP call. The general pattern is:

```bash
curl -X GET "https://cafecito-apis-main-948451c.d2.zuplo.dev/<product>/<resource>?<query-params>" \
    -H "Authorization: Bearer YOUR-API-KEY"
```

## MCP support

Every API-based product also ships an **MCP server** — same auth, same key, zero extra setup. Point your AI agent or MCP client at the endpoint and go:

```bash
curl -X POST "https://cafecito-apis-main-948451c.d2.zuplo.dev/<product>/mcp" \
    -H "Authorization: Bearer YOUR-API-KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "jsonrpc": "2.0",
      "method": "tools/list",
      "id": 1
    }'
```

Your existing API key works for MCP calls too — they share the same rate limit and quota meter.

## Launch Preview limits

During the preview (now through **June 30, 2026**) every account gets:

| | |
| --- | --- |
| **Rate limit** | 100 requests / minute |
| **Quota** | 50 000 requests / month |
| **Price** | $0 |

You can create unlimited API keys — they all count toward the same rate limit and quota.

## Dive deeper

- [API Keys & Auth](/howtos/api-keys)
- [Beans API Guide](/howtos/beans-howto)
- [Beans API Reference](/api/beans)
- [Pricing](/pricing/beans-pricing)

## Company stuff

- [About Us (our mess)](/company/about-us)
- [Privacy Policy](/company/privacy-policy)
- [Terms of Use](/company/terms-of-use)

_Last updated: February 26, 2026_
