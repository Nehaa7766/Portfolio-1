---
title: Deployment Issue
category: code-reviews
tags: [deployment, ci, cd, build, environment, env, production, devops, code review]
summary: Code review case — a deployment failure caused by a missing environment variable in production.
---

# Code Review: Deployment Issue

## Problem

The app worked locally but failed in production immediately after deploy with
runtime errors on startup.

## Investigation

- Compared local and production environments.
- Found a required environment variable was set locally but **missing in the
  production environment**.

## Root Cause

- Configuration relied on an env var that was never added to the production
  secrets, and there was no startup validation to catch it.

## Fix

- Added the missing environment variable to the deployment configuration.
- Introduced **startup validation** that fails fast with a clear message when
  required env vars are absent.
- Documented all required variables in `.env.example`.

## Lessons Learned

- Validate configuration at startup, not on first use.
- Keep an up-to-date `.env.example` and never commit real secrets.
