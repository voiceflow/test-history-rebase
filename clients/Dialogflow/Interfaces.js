const { getEnvVariable } = require('../../util')
const uuid = require('uuid/v4')

module.exports.Agent = (encoded_skill_id) => {
  return {
    "description": "",
    "language": "en",
    "disableInteractionLogs": false,
    "disableStackdriverLogs": true,
    "googleAssistant": {
      "googleAssistantCompatible": true,
      "welcomeIntentSignInRequired": false,
      "startIntents": [],
      "systemIntents": [],
      "endIntentIds": [],
      "oAuthLinking": {
        "required": false,
        "grantType": "AUTH_CODE_GRANT"
      },
      "voiceType": "MALE_1",
      "capabilities": [],
      "protocolVersion": "V2",
      "autoPreviewEnabled": true,
      "isDeviceAgent": false
    },
    "webhook": {
      "url": `${getEnvVariable('SKILL_ENDPOINT')}/state/skill/gactions/${encoded_skill_id}`,
      "available": true,
      "useForDomains": false,
      "cloudFunctionsEnabled": false,
      "cloudFunctionsInitialized": false
    },
    "isPrivate": true,
    "customClassifierMode": "use.after",
    "mlMinConfidence": 0.3,
    "supportedLanguages": [],
    "onePlatformApiVersion": "v2",
    "analyzeQueryTextSentiment": false,
    "enabledKnowledgeBaseNames": [],
    "knowledgeServiceConfidenceAdjustment": -0.4,
    "dialogBuilderMode": false
  }
}

module.exports.Package = () => {
  return {
    "version": "1.0.0"
  }
}

module.exports.EntityEntry = (value, synynoms) => {
  return {
    "value": value,
    "synonyms": synynoms || []
  }
}

module.exports.Entity = (name) => {
  const id = uuid()
  return {
    "id": id,
    "name": name,
    "isOverridable": true,
    "isEnum": false,
    "automatedExpansion": false
  }
}

module.exports.IntentEntry = () => {
  const id = uuid()
  return {
    "id": id,
    "data": [{
        "text": "test",
      },
    ],
    "isTemplate": false
  }
}

module.exports.Intent = (name) => {
  return {
    "id": name,
    "name": name,
    "auto": true,
    "contexts": [],
    "responses": [{
      "resetContexts": false,
      "affectedContexts": [],
      "parameters": [{
        "id": "795fab68-70e4-400d-b728-2cc65d915ffa",
        "dataType": "@Animal",
        "name": "fav_animal",
        "value": "$fav_animal",
        "isList": false
      }],
      "messages": [{
        "type": "simple_response",
        "platform": "google",
        "lang": "en",
        "textToSpeech": "you want a dog"
      }],
      "defaultResponsePlatforms": {},
      "speech": []
    }],
    "priority": 500000,
    "webhookUsed": true,
    "webhookForSlotFilling": false,
    "lastUpdate": 1548632203,
    "fallbackIntent": false,
    "events": []
  }
}