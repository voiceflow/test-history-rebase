export const nodeJS = `const axios = require('axios');

const apiKey = '{{vf.api_key}}';
const versionID = '{{vf.version_id}}';

const userID = 'user_123'; // The unique ID used to track conversation state
const userInput = 'Hello world!'; // The user's message to your Voiceflow project

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

export const curl = `
curl --request POST 'https://general-runtime.voiceflow.com/state/{{vf.version_id}}}/user/steve/interact'
     --header "Authorization: {{vf.api_key}}"
     --header 'Content-Type: application/json'
     --data-raw '{
        "request": { "type": "text", "payload": "Hello world!" }
     }'
`;

export const python = `
import requests

api_key = "{{vf.api_key}}"
version_id = "{{vf.version_id}}"

user_id = "user_123"  # The unique ID used to track conversation state
user_input = "Hello world!"  # The user's message to your Voiceflow project

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
