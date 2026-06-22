const GITHUB_API = 'https://api.github.com';

function getConfig() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'master';
  const token = process.env.GITHUB_TOKEN;
  if (!owner || !repo || !token) {
    throw new Error('Missing GITHUB_OWNER, GITHUB_REPO, or GITHUB_TOKEN environment variables');
  }
  return { owner, repo, branch, token };
}

async function githubRequest(path, options = {}) {
  const { token } = getConfig();
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }
  return res.json();
}

// Reads a file from the repo. Returns { content: null, sha: null } if it doesn't exist yet.
export async function getFile(filePath) {
  const { owner, repo, branch } = getConfig();
  try {
    const data = await githubRequest(
      `/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`
    );
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return { content, sha: data.sha };
  } catch (err) {
    if (String(err.message).includes('404')) return { content: null, sha: null };
    throw err;
  }
}

// Creates or updates a file in the repo, committing directly to the configured branch.
export async function putFile({ filePath, contentBase64, message, sha }) {
  const { owner, repo, branch } = getConfig();
  return githubRequest(`/repos/${owner}/${repo}/contents/${filePath}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch,
      ...(sha ? { sha } : {}),
    }),
  });
}
