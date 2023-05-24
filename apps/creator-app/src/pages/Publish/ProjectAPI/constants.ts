export const nodeJS = `const axios = require('axios');

// View our quick start guide to get your API key:
// https://www.voiceflow.com/api/dialog-manager#section/Quick-Start
const apiKey = '{{vf.api_key}}';

async function startInteract() {
  const response = await axios({
    method: 'GET',
    baseURL: 'https://api.voiceflow.com',
    url: \`/v2/versions/versionID/export?prototype=true\`,
    headers: {
      Authorization: apiKey,
    }
  });

  // Log the response
  console.log(response.data);
}

startInteract().catch((error) => console.error(error));
`;

export const curl = String.raw`# View our quick start guide to get your API key:
API_KEY='{{vf.api_key}}'

curl --request GET \ --url 'https://api.voiceflow.com/v2/versions/versionID/export?prototype=true' \
     --header "Authorization: $API_KEY" \
     --header 'accept: application/json'
`;

export const python = `import requests
# View our quick start guide to get your API key:
api_key = "{{vf.api_key}}"

response = requests.get(
    f"https://api.voiceflow.com/v2/versions/versionID/export?prototype=true",
    headers={"Authorization": api_key},
)

# Log the response
print(response.json())
`;
