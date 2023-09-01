export const nodeJS = `const axios = require('axios');

// View our quick start guide to get your API key:
// https://developer.voiceflow.com/reference/overview
const apiKey = '{{vf.api_key}}';

const userID = 'user_123'; // Unique ID used to track conversation state
const userInput = 'Hello world!'; // User's message to your Voiceflow assistant

const body = {
  action: {
    type: 'text',
    payload: userInput,
  },
};

async function startInteract() {
  // Start a conversation
  const response = await axios({
    method: 'POST',
    baseURL: '{{general-service-endpoint}}',
    url: \`/state/user/\${userID}/interact\`,
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

export const curl = String.raw`# View our quick start guide to get your API key:
# https://developer.voiceflow.com/reference/overview
API_KEY='{{vf.api_key}}'

USER_ID='user_123'
USER_INPUT='Hello world!'

curl --request POST "{{general-runtime-endpoint}}/state/user/$USER_ID/interact" \
     --header "Authorization: $API_KEY" \
     --header 'Content-Type: application/json' \
     --data "{
          \"action\": {
               \"type\": \"text\",
               \"payload\": \"$USER_INPUT\"
          }
     }"`;

export const python = `import requests

# View our quick start guide to get your API key:
# https://developer.voiceflow.com/reference/overview
api_key = "{{vf.api_key}}"

user_id = "user_123"  # Unique ID used to track conversation state
user_input = "Hello world!"  # User's message to your Voiceflow assistant

body = {"action": {"type": "text", "payload": "Hello world!"}}

# Start a conversation
response = requests.post(
    f"{{general-service-endpoint}}/state/user/{user_id}/interact",
    json=body,
    headers={"Authorization": api_key},
)

# Log the response
print(response.json())
`;
