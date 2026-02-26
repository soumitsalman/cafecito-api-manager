# API Keys

No keys, no data. Here's how to get yours.

## Get a key

1. Click **Login / Sign Up** in the upper-right corner (or your name if you're already signed in). It's free during the launch preview.
2. Once logged in, go to your **[API Keys](/settings/api-keys)** section.
3. Hit **Create** — give it a name if you feel like it.
4. Copy the key and stash it somewhere safe (environment variable, secret manager, tattoo on your arm — your call).

You can create **as many keys as you want**. They all share the same rate limit and quota meter, so don't think you're gaming the system with 47 keys.

## Use it in requests

Every request needs your key in the `Authorization` header as a Bearer token:

```
Authorization: Bearer YOUR-API-KEY
```

Example:

```bash
curl "https://cafecito-apis-main-948451c.d2.zuplo.dev/beans/health" \
  -H "Authorization: Bearer YOUR-API-KEY"
```

The general call pattern for any Cafecito product:

```
GET https://cafecito-apis-main-948451c.d2.zuplo.dev/<product>/<resource>?<query-params>
Authorization: Bearer YOUR-API-KEY
```

## Works for MCP too

The same API key works for MCP endpoints — no separate token, no extra setup. Just pass the same `Authorization: Bearer` header when connecting to an MCP server (e.g. `POST /beans/mcp`) and you're good.

## Launch Preview limits

During the preview (free through **June 30, 2026**):

| | |
| --- | --- |
| **Rate limit** | 100 requests / minute |
| **Quota** | 50,000 requests / month |

All your keys share the same meter. Creating more keys doesn't give you more quota.

## Key hygiene

- Use separate keys per app or environment (dev vs. prod).
- Rotate keys periodically — it doesn't cost you anything.
- Revoke immediately if a key leaks. Don't think about it, just do it.
- **Never** commit keys to source control. `.env` files exist for a reason.

## Troubleshooting

| Status | What it means |
| ------ | ------------- |
| `401 Unauthorized` | Missing or invalid key |
| `403 Forbidden` | Key lacks permissions (or your subscription expired) |
| `429 Too Many Requests` | You hit the rate limit or quota — chill for a bit |

## Product guides

- [Beans API](/howtos/beans-howto)
- [Beans API Reference](/api/beans)

_Last updated: February 26, 2026_