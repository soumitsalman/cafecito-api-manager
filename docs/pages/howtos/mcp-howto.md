---
sidebar_label: MCP
sidebar_icon: brain-circuit
description: Cafecito MCP (Model Context Protocol) Integration Guide
---

# MCP Integration

Every Cafecito API product ships an **MCP (Model Context Protocol) server** — same auth, same key, zero extra setup. Point your AI agent or MCP client at the endpoint and go.

## Authentication

Your existing API key works for MCP calls — they share the same rate limit and quota meter as regular API calls.

```
Authorization: Bearer YOUR-API-KEY
```

## General MCP endpoint pattern

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

## Beans MCP server

```
POST https://cafecito-apis-main-948451c.d2.zuplo.dev/beans/mcp
```

All Beans endpoints are exposed as MCP tools for AI agent integration.

### List available tools

```bash
curl -X POST "https://cafecito-apis-main-948451c.d2.zuplo.dev/beans/mcp" \
    -H "Authorization: Bearer YOUR-API-KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "jsonrpc": "2.0",
      "method": "tools/list",
      "id": 1
    }'
```

## Use cases

- AI assistants and RAG workflows that need fresh news context
- AI agents that monitor trends, entities, or topics in real time
- LLM pipelines that require enrichment-ready JSON, not raw HTML

## Related docs

- [Cafecito Introduction](/introduction)
- [Beans API Guide](/howtos/beans-howto)
- [Beans API Reference](/api/beans)

_Last updated: March 2, 2026_
