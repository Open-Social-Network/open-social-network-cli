import { fileExists, readJson } from './fs-utils.js';
import { discoveryPath, feedPath, privateKeyPath, profilePath } from './paths.js';
import { verifyPost } from './protocol/signing.js';
import type { OpenSocialNetworkFeed, OpenSocialNetworkIdentity } from './types.js';

export interface ValidationResult {
  valid: boolean;
  verifiedPosts: number;
  failures: string[];
}

export async function validateProject(projectDir: string): Promise<ValidationResult> {
  const failures: string[] = [];
  let verifiedPosts = 0;

  if (!(await fileExists(privateKeyPath(projectDir)))) {
    failures.push(
      'private/identity.private.jwk.json is missing; you cannot publish new posts for this identity',
    );
  }

  if (!(await fileExists(profilePath(projectDir)))) {
    failures.push('public/profile.json is missing');
  }
  if (!(await fileExists(discoveryPath(projectDir)))) {
    failures.push('public/.well-known/open-social-network.json is missing');
  }
  if (!(await fileExists(feedPath(projectDir)))) {
    failures.push('public/feed.json is missing');
  }

  if (failures.some((failure) => failure.endsWith('is missing'))) {
    return { valid: false, verifiedPosts, failures };
  }

  const profile = await readJson<OpenSocialNetworkIdentity>(profilePath(projectDir));
  const discovery = await readJson<OpenSocialNetworkIdentity>(discoveryPath(projectDir));
  const feed = await readJson<OpenSocialNetworkFeed>(feedPath(projectDir));

  if (profile.protocol !== 'open-social-network' || profile.version !== '0.1') {
    failures.push('profile.json must declare Open Social Network protocol version 0.1');
  }

  if (JSON.stringify(profile) !== JSON.stringify(discovery)) {
    failures.push('.well-known/open-social-network.json must match profile.json');
  }

  if (feed.protocol !== 'open-social-network' || feed.version !== '0.1') {
    failures.push('feed.json must declare Open Social Network protocol version 0.1');
  }

  if (feed.author !== profile.handle) {
    failures.push('feed author must match profile handle');
  }

  for (const post of feed.posts || []) {
    if (await verifyPost(post, profile)) {
      verifiedPosts += 1;
    } else {
      failures.push(`post ${post.id || '(missing id)'} failed signature verification`);
    }
  }

  return {
    valid: failures.length === 0,
    verifiedPosts,
    failures,
  };
}
