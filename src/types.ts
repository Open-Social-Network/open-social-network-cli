export type DeployTarget = 'github' | 'cloudflare';

export interface OpenSocialNetworkConfig {
  protocol: 'open-social-network';
  version: '0.1';
  handle: string;
  name: string;
  bio: string;
  website: string;
  baseUrl: string;
  deployTarget: DeployTarget;
  projectName: string;
}

export interface OpenSocialNetworkIdentity {
  protocol: 'open-social-network';
  version: '0.1';
  handle: string;
  name: string;
  bio: string;
  website: string;
  publicKey: {
    alg: 'ES256';
    jwk: JsonWebKey;
  };
  endpoints: {
    profile: string;
    feed: string;
  };
}

export interface UnsignedOpenSocialNetworkPost {
  id: string;
  author: string;
  createdAt: string;
  content: string;
}

export interface OpenSocialNetworkPost extends UnsignedOpenSocialNetworkPost {
  signature: {
    alg: 'ES256';
    value: string;
  };
}

export interface OpenSocialNetworkFeed {
  protocol: 'open-social-network';
  version: '0.1';
  author: string;
  posts: OpenSocialNetworkPost[];
}
