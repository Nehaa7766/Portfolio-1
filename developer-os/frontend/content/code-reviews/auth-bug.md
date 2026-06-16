---
title: Authentication Bug
category: code-reviews
tags: [authentication, auth, bug, jwt, session, security, token, code review]
summary: Code review case — an authentication bug where expired tokens were still accepted.
---

# Code Review: Authentication Bug

## Problem

Users remained "logged in" after their session should have expired; expired JWTs
were still being accepted by the API.

## Investigation

- Traced requests with expired tokens that returned 200 instead of 401.
- Found the token verification skipped expiry validation in one middleware path.

## Root Cause

The JWT verification used a decode helper that **decoded but did not verify**
the signature or `exp` claim on a fallback code path.

## Fix

- Replaced decode-only logic with full `verify()` including expiry checks.
- Added a single, shared auth middleware to remove duplicate, divergent paths.

## Tradeoffs

- Slightly stricter handling required refreshing tokens more proactively.

## Lessons Learned

- Never trust `decode` for authorization — always `verify`.
- Centralize auth in one middleware to avoid inconsistent paths.
