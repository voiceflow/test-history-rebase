export const curl = String.raw`# https://developer.voiceflow.com/docs/exports
API_KEY="{{vf.api_key}}"

# development version, find more versions in settings
VERSION_ID="{{vf.version_id}}"

curl --request GET \
     --url "{{api-endpoint}}/v2/versions/$VERSION_ID/export?prototype=true" \
     --header "Authorization: $API_KEY" \
     --header 'accept: application/json'
`;
