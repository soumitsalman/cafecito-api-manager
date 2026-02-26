---
sidebar_label: Beans
category: "Pricing"
---

# Beans Pricing

We like simple.

## Launch Preview (now through June 30, 2026)

Everything is **free**. Sign up, grab a key, call the APIs. That's it.

| | |
| --- | --- |
| **Price** | $0 |
| **Rate limit** | 100 requests / minute |
| **Quota** | 50 000 requests / month |

You can create unlimited API keys — they all count toward the same meter.

> After the launch preview ends, we'll announce paid plans. We'll keep it straightforward — no point systems, no surprise surcharges, no PhD required to read the pricing page.

## What's included (all of it)

- Keyword search and semantic / vector search
- Metadata endpoints (categories, entities, regions, sources)
- Social engagement and trend-aware ranking
- Publisher metadata and related-article discovery
- MCP server access for AI agent integration
- API key management via the developer portal

All of that. For free. During the preview.

## How metering works

- Metering is **per API call**. One request = one tick on the meter.
- Response size, number of returned items — **doesn't matter**. Same cost.
- MCP calls count the same as regular API calls.
- Semantic / vector search costs the same as keyword search.
- Requests that return zero results still count. (Sorry, empty queries aren't free.)
- **Free calls that don't tick the meter:** `/health` checks and [API key](/settings/api-keys) creation. Ping us all day, we don't care.
- **Failed requests don't count either.** If you get a 4xx or 5xx status code, that's on us (or your typo) — it won't tick the meter.

## What happens when you hit the limit

- **Rate limit exceeded?** Back off for a second, err make it a minute.
- **Quota exhausted?** You're done until the next billing month. Upgrade options will exist after the preview.

There's **no soft limit** — when you hit it, you hit it.

## Post-preview plans

We're still figuring out exact pricing tiers for after June 30. Expect something like:

- A **free tier** with lower limits for tire-kickers
- A **paid tier** with higher limit for production workloads
- Nothing absurd. We're bootstrapped, not delusional.

Stay tuned. We'll update this page when we nail it down.

_Last updated: February 26, 2026_