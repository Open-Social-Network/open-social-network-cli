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
│   ├── page.js
│   ├── profile.json
│   └── styles.css
└── private/
    └── identity.private.jwk.json
```

The `public/` directory is safe to deploy. The `private/` directory is not.

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

Back it up.

If you lose this file, you lose the ability to publish new posts for that identity.

If someone else gets this file, they can publish as that identity.

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

Open Social Network is not based on the idea that decentralized social media is new. Projects such as Mastodon, ActivityPub, Nostr, Bluesky, Diaspora, Matrix, and the broader fediverse have already made important contributions to open social systems, decentralized identity, federation, and protocol-based communication.

This project exists because we believe there is still room to explore a different direction.

The goal is not to dismiss previous work. The goal is to learn from it, keep the core smaller, and make social identity feel more like open internet infrastructure than an account inside a platform.

### Where Existing Systems Still Struggle

Many decentralized systems still depend heavily on servers, relays, instances, or providers. Even when the network is federated, identity can remain tied to infrastructure that users do not fully control. Open Social Network aims for profiles that feel closer to a website, a domain, or an email identity than an account rented from a server.

Many systems also ask mainstream users to understand federation, relays, instances, self-hosting, keys, or protocol internals. Most people simply want a profile, posts, followers, discovery, portability, and a familiar way to interact. Open Social Network treats decentralization as an infrastructure property, not as a burden users should have to understand before they can participate.

Creator ownership is another unresolved problem. Visibility, reputation, ranking, recommendations, and social graphs can still become dependent on a specific platform, app, host, or algorithm. Open Social Network is designed around portable identity, portable followers, portable reputation, and replaceable aggregators.

Finally, decentralized social systems can become architecturally complex. Federation rules, relay ecosystems, moderation boundaries, incompatible implementations, and difficult onboarding can make the user experience feel fragmented. Open Social Network intentionally starts with a small protocol surface: identity, profiles, feeds, follows, signed posts, and portable signed actions.

### Core Direction

Open Social Network is built around a few principles:

- Profiles belong to their creators, not to a platform.
- Aggregators display the network; they do not own the network.
- Followers and audiences should move with creators across apps, hosts, and interfaces.
- The protocol itself should not contain a central authority that can remove an identity globally, while hosts, apps, and aggregators remain free to moderate what they store, index, or display.
- Algorithms should compete. No single company should control visibility for the whole network.
- Simplicity matters. If open social identity requires technical expertise, it cannot become normal social infrastructure.

### How We Hope To Move The Space Forward

Open Social Network starts with the smallest useful foundation and grows through optional, interoperable layers. Users should be able to create a page, write posts, react, comment, follow, move hosts, change aggregators, or self-host without losing identity or audience.

Not every user needs to self-host. A healthy Open Social Network ecosystem should support hosted providers, local folders, personal domains, managed hosting, mirrors, and self-managed infrastructure. The experience should feel familiar to users while preserving protocol-level portability underneath.

The long-term goal is not to create a dominant social media company. The goal is to define open social infrastructure that anyone can implement, inspect, host, aggregate, or replace.

Open Social Network does not claim to have solved decentralized social media. Moderation, spam, discovery, scaling, onboarding, incentives, and safety remain difficult problems. This project is an attempt to explore a simpler, more user-centric, and more sovereign direction for social identity on the internet.
