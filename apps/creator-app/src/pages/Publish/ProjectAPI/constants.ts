export const curl = String.raw`# View our quick start guide to get your API key:
API_KEY='{{vf.api_key}}'
VERSION_ID='646bc'

curl --request GET \ --url "https://api.voiceflow.com/v2/versions/$VERSION_ID/export?prototype=true" \
     --header "Authorization: $API_KEY" \
     --header 'accept: application/json'
`;
