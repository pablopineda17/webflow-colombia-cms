exports.handler = async function () {
  const cfToken = process.env.CF_API_TOKEN
  const accountId = '188a2e662e891758f66a0f24c2c2d10a'
  const projectName = 'webflow-colombia'

  if (!cfToken) {
    return { statusCode: 500, body: JSON.stringify({ error: 'CF_API_TOKEN not set' }) }
  }

  // Get latest git-based deployment and retry it, or push an empty commit via GitHub API
  const ghToken = process.env.GITHUB_TOKEN
  const repo = 'pablopineda17/webflow-colombia'

  if (ghToken) {
    // Get the latest commit SHA on main
    const refRes = await fetch(`https://api.github.com/repos/${repo}/git/refs/heads/main`, {
      headers: { Authorization: `Bearer ${ghToken}`, 'User-Agent': 'webflow-colombia-cms' },
    })
    const refData = await refRes.json()
    const latestSha = refData?.object?.sha

    if (!latestSha) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Could not get latest commit SHA' }) }
    }

    // Create an empty commit
    const commitRes = await fetch(`https://api.github.com/repos/${repo}/git/commits`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ghToken}`,
        'User-Agent': 'webflow-colombia-cms',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'chore: trigger rebuild [cms publish]',
        tree: (await (await fetch(`https://api.github.com/repos/${repo}/git/commits/${latestSha}`, {
          headers: { Authorization: `Bearer ${ghToken}`, 'User-Agent': 'webflow-colombia-cms' },
        })).json()).tree.sha,
        parents: [latestSha],
      }),
    })
    const commitData = await commitRes.json()
    const newSha = commitData?.sha

    if (!newSha) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Could not create commit' }) }
    }

    // Update the ref to point to the new commit
    await fetch(`https://api.github.com/repos/${repo}/git/refs/heads/main`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${ghToken}`,
        'User-Agent': 'webflow-colombia-cms',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sha: newSha }),
    })

    return { statusCode: 200, body: JSON.stringify({ success: true, method: 'github-commit' }) }
  }

  return { statusCode: 500, body: JSON.stringify({ error: 'GITHUB_TOKEN not set' }) }
}
