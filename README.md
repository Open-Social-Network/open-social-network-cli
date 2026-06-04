<p align="center">
  <img src="./assets/open-social-network-logo.png" width="96" alt="Open Social Network logo" />
</p>

# Open Social Network CLI

Open Social Network CLI is the terminal path for creating, updating, checking, previewing, and publishing a sovereign Open Social Network page.

It turns the protocol into a real user flow:

1. create your page
2. write posts
3. check that everything verifies
4. preview locally
5. publish anywhere static files can be hosted

## In One Minute

Run:

```bash
npx open-social-network
```

The CLI asks simple questions and creates a standalone Open Social Network page project.

The generated project contains:

```text
my-page/
├── open-social-network.config.json
├── public/
│   ├── .well-known/open-social-network.json
│   ├── assets/
│   ├── feed.json
│   ├── index.html
│   ├── opensocial/
│   │   ├── actions/index.json
│   │   └── messages/inbox/index.json
│   ├── page.js
│   ├── profile.json
│   └── styles.css
└── private/
    ├── identity.private.jwk.json
    └── messages.private.jwk.json
```

The `public/` directory is safe to deploy. It includes the page, feed, profile, public action log, and encrypted message inbox. The `private/` directory is not.

## Why This Exists

The internet has protocols for websites, domain names, email, feeds, files, and even AI tool connections.

Social identity still mostly lives inside platforms.

Open Social Network changes that by making a social profile a page on the internet. Open Social Network CLI makes that idea usable without asking people to understand JSON, cryptographic signatures, or static hosting internals.

## Quick Start

Create your page:

```bash
npx open-social-network create my-page
```

Add a post:

```bash
cd my-page
npx open-social-network post "Hello from my sovereign Open Social Network page."
```

Check that the page is valid:

```bash
npx open-social-network check
```

Preview locally:

```bash
npx open-social-network preview
```

Prepare files for any static host:

```bash
npx open-social-network publish --target folder --output ./public-site
```

Or use a built-in shortcut:

```bash
npx open-social-network publish --target github
```

or:

```bash
npx open-social-network publish --target cloudflare
```

GitHub Pages and Cloudflare Pages are examples. Open Social Network pages can be hosted anywhere that serves static files.

## Deployment Targets

### GitHub Pages

GitHub Pages deployment uses the official GitHub CLI.

Install and log in:

```bash
gh auth login
```

Then publish:

```bash
npx open-social-network publish --target github
```

The CLI publishes only the generated `public/` files to a `gh-pages` branch. It never publishes `private/`.

### Cloudflare Pages

Cloudflare Pages deployment uses Wrangler.

Install and log in:

```bash
npm install -g wrangler
wrangler login
```

Then publish:

```bash
npx open-social-network publish --target cloudflare
```

The CLI runs a direct upload of the generated `public/` directory.

## Private Key Safety

The private key is written to:

```text
private/identity.private.jwk.json
```

The private message key is written to:

```text
private/messages.private.jwk.json
```

Back it up.

If you lose these files, you lose the ability to publish new posts for that identity or read encrypted messages sent to that page.

If someone else gets these files, they can publish as that identity or read that page's encrypted messages.

The generated `.gitignore` includes `private/` automatically.

## Commands

```bash
open-social-network init [folder]
open-social-network create [folder]
open-social-network post "Your post" --project ./my-page
open-social-network validate --project ./my-page
open-social-network check --project ./my-page
open-social-network preview --project ./my-page --port 4173
open-social-network deploy --project ./my-page --target github
open-social-network deploy --project ./my-page --target cloudflare
open-social-network publish --project ./my-page --target folder --output ./public-site
open-social-network publish --project ./my-page --target github
open-social-network publish --project ./my-page --target cloudflare
```

Running `open-social-network` with no command starts the guided setup. The original command names remain supported; the simpler names are recommended for new users.

## Related Repositories

- [`open-social-network-core`](https://github.com/Open-Social-Network/open-social-network-core) - protocol primitives, schemas, and specification
- [`open-social-network-web`](https://github.com/Open-Social-Network/open-social-network-web) - the official web aggregator
- [`open-social-network-page`](https://github.com/Open-Social-Network/open-social-network-page) - sovereign page template

## Status

Open Social Network CLI is early alpha. The current priority is simple, safe publishing for real sovereign profiles.

## How Open Social Network Differs From Existing Decentralized Social Platforms

Open Social Network does not start from the claim that decentralized social media is new.

Mastodon, ActivityPub, Nostr, Bluesky, Diaspora, Matrix, and the broader fediverse have already proven that open social systems matter. They have advanced federation, decentralized identity, relays, public protocols, community governance, and user choice.

Open Social Network exists because we think some problems still deserve a simpler protocol-first experiment: ownership that starts at the user's page, an experience that feels familiar to nontechnical people, and social records that remain portable across clients, hosts, and aggregators.

The goal is to learn from prior work, not to erase it.

### The Different Bet

Open Social Network treats a profile as a sovereign web object. It should feel closer to a website, a domain, or an email identity than to an account rented from one instance, relay, provider, or app.

The protocol keeps the first layer small: profiles, feeds, signed posts, signed public actions, and encrypted message envelopes. Everything else - ranking, moderation, search, media hosting, notifications, recommendation systems, and managed hosting - can be built as replaceable layers around that foundation.

### Problems We Are Designing Around

Identity should not be trapped in infrastructure users do not control. A person should be able to move hosts, change apps, use mirrors, or self-host without restarting their social existence.

Decentralization should not become homework for everyday users. People should not need to understand federation, relays, instances, key formats, or static hosting before they can create a page and post.

Creators should keep their audience and reputation. Followers, visibility, comments, reactions, and trust signals should be portable protocol data, not private database rows that disappear when a user changes clients.

Aggregators should be replaceable. They should read, verify, rank, moderate, and display the network, but they should not own the identities or the graph. Different aggregators and algorithms should be able to compete.

The protocol should stay small enough to inspect. Open Social Network should feel more like a set of web conventions for social identity than a distributed operating system.

### What This Means In Practice

- A page can be hosted anywhere static files work.
- The public folder is safe to publish; private keys are never published.
- Posts and public actions are signed so any client can verify them.
- Direct messages are stored as encrypted envelopes so hosts can carry them without reading them.
- Official tools are reference implementations, not the network itself.
- Moderation remains possible at the host, app, aggregator, community, and user layer without creating one global protocol owner.

### Final Note

Open Social Network does not claim to have solved decentralized social media. Moderation, spam, abuse handling, discovery, scaling, onboarding, incentives, and safety are hard problems.

This project is an attempt to explore a smaller and more user-centered path: social identity as open internet infrastructure, where platforms become interfaces and users keep the underlying identity, audience, and content.
