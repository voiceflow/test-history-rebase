const KNOWLEDGE_BASE_API_URL = 'https://developer.voiceflow.com/reference/post_knowledge-base-query';

export const curl = String.raw`# ${KNOWLEDGE_BASE_API_URL}
API_KEY='{{vf.api_key}}'

QUESTION='why is the sky blue?'

curl --request POST '{{general-runtime-endpoint}}/knowledge-base/query' \
     --header "Authorization: $API_KEY" \
     --header 'Accept: application/json' \
     --header 'Content-Type: application/json' \
     --data "{
      \"question\": \"$QUESTION\"
     }"
`;
