export const nodeJS = `const axios = require('axios');

// View our quick start guide to get your API key and version ID:
// https://www.voiceflow.com/api/dialog-manager#section/Quick-Start
const apiKey = '{{vf.api_key}}';
const versionID = '{{vf.version_id}}';

const userID = 'user_123'; // Unique ID used to track conversation state
const userInput = 'Hello world!'; // User's message to your Voiceflow project

const body = {
  request: {
    type: 'text',
    payload: userInput,
  },
};

async function startInteract() {
  // Start a conversation
  const response = await axios({
    method: 'POST',
    baseURL: 'https://general-runtime.voiceflow.com',
    url: \`/state/\${versionID}/user/\${userID}/interact\`,
    headers: {
      Authorization: apiKey,
    },
    data: body,
  });

  // Log the response
  console.log(response.data);
}

startInteract().catch((error) => console.error(error));
`;

// eslint-disable-next-line no-secrets/no-secrets
export const curl = String.raw`# View our quick start guide to get your API key and version ID:
# https://www.voiceflow.com/api/dialog-manager#section/Quick-Start
API_KEY='{{vf.api_key}}'
VERSION_ID='{{vf.version_id}}'

USER_ID='user_123'
USER_INPUT='Hello world!'

curl --request POST "https://general-runtime.voiceflow.com/state/$VERSION_ID/user/$USER_ID/interact" \
     --header "Authorization: $API_KEY" \
     --header 'Content-Type: application/json' \
     --data-raw "{
        \"request\": { \"type\": \"text\", \"payload\": \"$USER_INPUT\" }
     }"
`;

export const python = `import requests

# View our quick start guide to get your API key and version ID:
# https://www.voiceflow.com/api/dialog-manager#section/Quick-Start
api_key = "{{vf.api_key}}"
version_id = "{{vf.version_id}}"

user_id = "user_123"  # Unique ID used to track conversation state
user_input = "Hello world!"  # User's message to your Voiceflow project

body = {"request": {"type": "text", "payload": "Hello world!"}}

# Start a conversation
response = requests.post(
    f"https://general-runtime.voiceflow.com/state/{version_id}/user/{user_id}/interact",
    json=body,
    headers={"Authorization": api_key},
)

# Log the response
print(response.json())
`;
