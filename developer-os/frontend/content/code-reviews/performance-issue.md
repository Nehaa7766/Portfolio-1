---
title: Database Performance Issue
category: code-reviews
tags: [performance, database, n+1, query, slow, optimization, index, code review]
summary: Code review case — a slow endpoint caused by N+1 queries and a missing index.
---

# Code Review: Database Performance Issue

## Problem

A list endpoint became very slow as data grew, with response times spiking to
several seconds.

## Investigation

- Profiled the endpoint and logged SQL queries.
- Found an **N+1 query** pattern: one query per row to fetch related records.
- A frequently filtered column had **no index**.

## Root Cause

- ORM lazy-loading triggered a query per item in a loop.
- Missing index forced full table scans on filtered queries.

## Fix

- Replaced the loop with a single `JOIN` / eager-load (batched fetch).
- Added a composite index on the filtered/sorted columns.

## Outcome

Response time dropped from seconds to tens of milliseconds.

## Lessons Learned

- Watch for N+1 patterns when using ORMs.
- Add indexes based on real query patterns, then measure.
