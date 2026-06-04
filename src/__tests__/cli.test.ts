import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, describe, expect, it } from 'vitest';
import { runCli } from '../cli-runner.js';

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(tempRoots.map((root) => rm(root, { recursive: true, force: true })));
  tempRoots.length = 0;
});

describe('runCli', () => {
  it('initializes, posts, and validates using command arguments', async () => {
    const root = await makeTempRoot();
    const projectDir = join(root, 'my-page');
    const output: string[] = [];

    expect(
      await runCli(
        [
          'init',
          projectDir,
          '--name',
          'Ada Lovelace',
          '--handle',
          'ada@example.com',
          '--first-post',
          'Hello from the CLI.',
          '--target',
          'github',
        ],
        { stdout: (line) => output.push(line), stderr: (line) => output.push(line) },
      ),
    ).toBe(0);
    expect(await runCli(['post', 'A second post.', '--project', projectDir], {})).toBe(0);
    expect(await runCli(['validate', '--project', projectDir], {})).toBe(0);

    const feed = JSON.parse(await readFile(join(projectDir, 'public/feed.json'), 'utf8'));
    expect(feed.posts).toHaveLength(2);
    expect(output.join('\n')).toContain('Back up private/identity.private.jwk.json');
  });

  it('supports human-friendly aliases for create, check, and publish', async () => {
    const root = await makeTempRoot();
    const projectDir = join(root, 'my-page');
    const exportDir = join(root, 'site-export');
    const output: string[] = [];

    expect(
      await runCli(
        [
          'create',
          projectDir,
          '--name',
          'Ada Lovelace',
          '--handle',
          'ada@example.com',
          '--first-post',
          'Hello from the CLI.',
          '--target',
          'folder',
        ],
        { stdout: (line) => output.push(line), stderr: (line) => output.push(line) },
      ),
    ).toBe(0);
    expect(await runCli(['post', 'A second post.', '--project', projectDir], {})).toBe(0);
    expect(await runCli(['check', '--project', projectDir], {})).toBe(0);
    expect(
      await runCli(['publish', '--project', projectDir, '--target', 'folder', '--output', exportDir], {
        stdout: (line) => output.push(line),
        stderr: (line) => output.push(line),
      }),
    ).toBe(0);

    expect(JSON.parse(await readFile(join(exportDir, 'feed.json'), 'utf8')).posts).toHaveLength(2);
    await expect(readFile(join(exportDir, 'private/identity.private.jwk.json'), 'utf8')).rejects.toThrow();
    expect(output.join('\n')).toContain('host the public folder anywhere');
  });

  it('adds signed portable reactions and comments with simple commands', async () => {
    const root = await makeTempRoot();
    const projectDir = join(root, 'my-page');
    const output: string[] = [];

    await runCli(
      [
        'create',
        projectDir,
        '--name',
        'Ada Lovelace',
        '--handle',
        'ada@example.com',
        '--first-post',
        'Hello from the CLI.',
      ],
      {},
    );

    expect(
      await runCli(
        ['react', 'like', '--post', 'post_001', '--author', 'ben@example.com', '--project', projectDir],
        { stdout: (line) => output.push(line), stderr: (line) => output.push(line) },
      ),
    ).toBe(0);
    expect(
      await runCli(
        [
          'comment',
          'Portable comments should work from the CLI.',
          '--post',
          'post_001',
          '--author',
          'ben@example.com',
          '--project',
          projectDir,
        ],
        { stdout: (line) => output.push(line), stderr: (line) => output.push(line) },
      ),
    ).toBe(0);
    expect(await runCli(['check', '--project', projectDir], {})).toBe(0);

    const actionLog = JSON.parse(
      await readFile(join(projectDir, 'public/opensocial/actions/index.json'), 'utf8'),
    );

    expect(actionLog.actor).toBe('ada@example.com');
    expect(actionLog.actions).toHaveLength(2);
    expect(actionLog.actions[0]).toMatchObject({
      kind: 'reaction',
      actor: 'ada@example.com',
      reaction: 'like',
      target: {
        type: 'post',
        id: 'post_001',
        author: 'ben@example.com',
      },
      signature: {
        alg: 'ES256',
      },
    });
    expect(actionLog.actions[1]).toMatchObject({
      kind: 'comment',
      actor: 'ada@example.com',
      content: 'Portable comments should work from the CLI.',
      target: {
        type: 'post',
        id: 'post_001',
        author: 'ben@example.com',
      },
      signature: {
        alg: 'ES256',
      },
    });
    expect(output.join('\n')).toContain('Reaction signed and saved.');
    expect(output.join('\n')).toContain('Comment signed and saved.');
  });

  it('fails validation after a signed action is tampered with', async () => {
    const root = await makeTempRoot();
    const projectDir = join(root, 'my-page');

    await runCli(
      [
        'create',
        projectDir,
        '--name',
        'Ada Lovelace',
        '--handle',
        'ada@example.com',
        '--first-post',
        'Hello from the CLI.',
      ],
      {},
    );
    await runCli(
      [
        'comment',
        'Original public comment.',
        '--post',
        'post_001',
        '--author',
        'ben@example.com',
        '--project',
        projectDir,
      ],
      {},
    );

    const actionLogPath = join(projectDir, 'public/opensocial/actions/index.json');
    const actionLog = JSON.parse(await readFile(actionLogPath, 'utf8'));
    actionLog.actions[0].content = 'Tampered public comment.';
    const { writeFile } = await import('node:fs/promises');
    await writeFile(actionLogPath, `${JSON.stringify(actionLog, null, 2)}\n`, 'utf8');

    expect(await runCli(['check', '--project', projectDir], {})).toBe(1);
  });

  it('explains that any static host can publish a page', async () => {
    const output: string[] = [];

    expect(await runCli(['help'], { stdout: (line) => output.push(line) })).toBe(0);

    expect(output.join('\n')).toContain('host the public folder anywhere');
  });

  it('returns a nonzero exit code for validation failures', async () => {
    const root = await makeTempRoot();
    const projectDir = join(root, 'my-page');

    await runCli(
      [
        'init',
        projectDir,
        '--name',
        'Ada Lovelace',
        '--handle',
        'ada@example.com',
        '--first-post',
        'Hello from the CLI.',
      ],
      {},
    );
    const feedPath = join(projectDir, 'public/feed.json');
    const feed = JSON.parse(await readFile(feedPath, 'utf8'));
    feed.posts[0].content = 'Changed later.';
    const { writeFile } = await import('node:fs/promises');
    await writeFile(feedPath, `${JSON.stringify(feed, null, 2)}\n`, 'utf8');

    expect(await runCli(['validate', '--project', projectDir], {})).toBe(1);
  });
});

async function makeTempRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'open-social-network-cli-'));
  tempRoots.push(root);
  return root;
}
