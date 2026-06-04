export function summarizePostActions(post, actionInbox) {
  const reactionsByActor = new Map();
  const comments = [];

  const actions = [...(actionInbox?.actions ?? [])].sort(
    (left, right) => new Date(left.createdAt) - new Date(right.createdAt),
  );

  for (const action of actions) {
    if (!targetsPost(action, post)) {
      continue;
    }

    if (action.kind === 'reaction') {
      if (action.reaction === 'none') {
        reactionsByActor.delete(action.actor);
      } else if (action.reaction === 'like' || action.reaction === 'dislike') {
        reactionsByActor.set(action.actor, action.reaction);
      }

      continue;
    }

    if (action.kind === 'comment' && typeof action.content === 'string') {
      comments.push({
        id: action.id,
        actor: action.actor,
        content: action.content,
        createdAt: action.createdAt,
      });
    }
  }

  const reactions = [...reactionsByActor.values()];

  return {
    likes: reactions.filter((reaction) => reaction === 'like').length,
    dislikes: reactions.filter((reaction) => reaction === 'dislike').length,
    comments,
  };
}

export function renderPostSocialSummary(summary) {
  const commentList =
    summary.comments.length > 0
      ? `
        <div class="post-comments">
          ${summary.comments
            .map(
              (comment) => `
                <article class="post-comment">
                  <strong>${escapeHtml(comment.actor)}</strong>
                  <p>${escapeHtml(comment.content)}</p>
                </article>
              `,
            )
            .join('')}
        </div>
      `
      : '';

  return `
    <section class="post-social-summary" aria-label="Public reactions">
      <span>${formatCount(summary.likes, 'like')}</span>
      <span>${formatCount(summary.dislikes, 'dislike')}</span>
      <span>${formatCount(summary.comments.length, 'comment')}</span>
    </section>
    ${commentList}
  `;
}

function targetsPost(action, post) {
  return (
    action?.target?.type === 'post' &&
    action.target.id === post.id &&
    action.target.author === post.author
  );
}

function formatCount(count, singular) {
  return `${count} ${count === 1 ? singular : `${singular}s`}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
