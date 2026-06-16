---
title: Why PostgreSQL
category: decisions
tags: [postgresql, postgres, database, decision, sql, relational, why postgres]
summary: Engineering decision — choosing PostgreSQL as the relational database.
---

# Decision: Why PostgreSQL

## Context

Needed a reliable relational database for transactional, structured data with
strong consistency guarantees.

## Decision

Chose **PostgreSQL** as the primary relational database.

## Reasons

- **Strong consistency & ACID** transactions for critical data (billing, orders).
- **Rich SQL** support: window functions, CTEs, JSON/JSONB columns.
- **Extensibility:** mature ecosystem, full-text search, and indexing options.
- **Open source** with excellent tooling and hosting support.

## Tradeoffs

- More operational care than a managed NoSQL store for simple use cases.
- Requires schema migrations as the model evolves.

## Outcome

PostgreSQL provided predictable performance and data integrity while keeping
queries expressive and maintainable.
