---
title: Why Next.js
category: decisions
tags: [next.js, nextjs, react, framework, decision, app router, ssr, why nextjs]
summary: Engineering decision — choosing Next.js (App Router) as the application framework.
---

# Decision: Why Next.js

## Context

Needed a React framework that supports server-side rendering, API routes, and a
scalable file structure for a full stack application.

## Decision

Chose **Next.js (App Router)**.

## Reasons

- **Server Components & Route Handlers** keep secrets (like API keys) server-side.
- **Hybrid rendering:** SSR, SSG, and client components as needed.
- **Built-in API layer** removes the need for a separate server for many cases.
- **Great DX:** file-based routing, fast refresh, first-class TypeScript.

## Tradeoffs

- App Router has a learning curve (server vs client boundaries).
- Some libraries need care around the server/client split.

## Outcome

Next.js enabled a cohesive full stack architecture with secure server-side
logic and a fast, modern frontend.
