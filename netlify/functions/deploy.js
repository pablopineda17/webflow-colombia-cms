exports.handler = async function () {
  const token = process.env.CF_API_TOKEN
  const accountId = '188a2e662e891758f66a0f24c2c2d10a'
  const projectName = 'webflow-colombia'

  if (!token) {
    return { statusCode: 500, body: JSON.stringify({ error: 'CF_API_TOKEN not set' }) }
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }
  )

  return {
    statusCode: response.ok ? 200 : 500,
    body: JSON.stringify({ success: response.ok }),
  }
}
