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

## Relationship To Existing Decentralized Social Platforms

Open Social Network is not pretending that decentralized social media begins here.

Mastodon, ActivityPub, Nostr, Bluesky/AT Protocol, Diaspora, Matrix, and the broader fediverse have already done serious work on open social systems, federation, portable identity, relays, community governance, and protocol-based communication. Open Social Network exists because we believe the internet still needs a simpler, user-owned social primitive.

Email has protocols. DNS has protocols. The web has protocols. AI systems are beginning to use open interoperability layers. Social identity should have the same kind of open, inspectable foundation instead of living only inside applications that can change the rules, the algorithm, or the audience relationship at any time.

Open Social Network explores one clear idea: a social profile should be a sovereign web identity first, and an app account second. This CLI is the guided path for creating, posting, validating, previewing, and publishing that identity without turning the user into an infrastructure operator.

### The Direction

- Profiles are sovereign. A profile belongs to the person, organization, project, or community that publishes it.
- Aggregators are replaceable. They read, verify, rank, moderate, and display the network; they do not own it.
- Creators should keep their audience. The long-term goal is portable followers, portable reputation, and portable social history across apps and hosts.
- Algorithms should compete. No single feed should decide visibility for the whole network.
- The protocol should stay small. The base layer should be easy to inspect, implement, and explain.
- Users should not need to become infrastructure experts. Decentralization belongs in the design, not in the user's daily burden.
- The protocol has no global account switch. Moderation belongs to hosts, apps, aggregators, communities, and users rather than one central protocol owner.

### Why This Is Different

Many decentralized systems still ask users to choose an instance, trust a relay, understand federation, manage provider-specific identity, or accept that visibility and reputation live inside a particular service. Those systems are valuable, but they can still feel like accounts attached to infrastructure.

Open Social Network starts from static, signed, portable web objects: a profile, a feed, posts, public actions, and encrypted message envelopes. A page can live on GitHub Pages, Cloudflare Pages, Netlify, Vercel, S3-compatible storage, a personal server, a community host, or any future compatible storage layer. The official tools are reference implementations, not the network itself.

### What v0.1 Is Trying To Prove

The early protocol is intentionally small. It focuses on identity, profiles, signed posts, signed public actions, and encrypted messages before adding more complex layers such as global search, recommendation systems, media hosting, managed hosting, advanced moderation, or creator monetization.

The bet is that a minimal, verifiable base can make social media feel more like open internet infrastructure: clients can compete, hosts can differ, communities can moderate, algorithms can improve, and users keep the identity underneath.

### Final Thought

Open Social Network has not solved every hard problem in decentralized social media. Spam, safety, abuse, discovery, onboarding, moderation, scaling, and creator incentives require serious work.

This project exists to make that work possible on top of a simple foundation: user-owned social identity, signed public records, portable relationships, encrypted private communication, and interfaces that ordinary people can use.
