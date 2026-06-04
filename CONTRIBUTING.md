# Contributing to Open Social Network CLI

Open Social Network CLI should make sovereign publishing safe for people who do not want to think about keys, JSON, or deploy internals.

## Principles

- Keep user-facing language clear and calm.
- Never publish `private/`.
- Never rotate a key without explicit user intent.
- Validate before deploy.
- Prefer official provider CLIs for authentication.
- Keep the generated page static-host friendly.

## Local Development

```bash
npm install
npm test
npm run build
```

## Pull Requests

Pull requests should include:

- user impact
- command behavior changes
- tests or validation output
- screenshots for generated page changes
- notes on compatibility with Open Social Network v0.1

## Project Context

Open Social Network is not trying to erase the work of Mastodon, ActivityPub, Nostr, Bluesky/AT Protocol, Diaspora, Matrix, or the broader fediverse. Those projects have already moved open social infrastructure forward in serious ways.

The CLI exists so normal users can create and publish a sovereign page without becoming infrastructure operators. Contributions should protect the user from accidental private key exposure, keep language simple, and make clear that GitHub Pages and Cloudflare Pages are examples rather than requirements. The public folder should remain portable to any static host.
