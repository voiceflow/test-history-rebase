export const nodeJS = `\
const interact = async (name, input) => {
  const response = await fetch(\`https://general-runtime.voiceflow.com/state/{versionID}/user/\${name}/interact\`, {
    method: 'POST',
    headers: {
      Authorization: '{apiKey}',
    },
    body: JSON.stringify({
      request: { type: 'text', payload: input },
    }),
  });

  console.log(response.json());
};

interact('steve', 'hello');
`;

export const curl = `\
curl --request POST 'https://general-runtime.voiceflow.com/state/{versionID}/user/steve/interact'
     --header "Authorization: {apiKey}"
     --header 'Content-Type: application/json'
     --data-raw '{
        "request": { "type": "text", "payload": "hello" }
     }'
`;

export const python = `\
# Example in Python 3 using requests library
import requests

url = 'https://general-runtime.voiceflow.com/state/{versionID}/user/steve/interact'
request = { 'type': 'text', 'payload': 'hello' }
headers = {'Authorization': '{apiKey}'}

response = requests.post(url, json={ 'request': request }, headers=headers )
print(response.json())
`;
