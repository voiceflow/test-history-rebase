const generateGactionsPackage = (params) => {

  const intents = params.intents
  const slots = params.slots
  const locales = params.locales
  const title = params.title || 'Test Skill'

  const base = {
    "actions": [{
      "description": "Default Welcome Intent",
      "name": "MAIN",
      "fulfillment": {
        "conversationName": "Voiceflow"
      },
      "intent": {
        "name": "actions.intent.MAIN",
        "trigger": {
          "queryPatterns": [
            `talk to ${title}`
          ]
        }
      }
    }],
    "conversations": {
      "Voiceflow": {
        "name": "Voiceflow",
        "url": "https://app.getstoryflow.com/gactions/state/skill/P2WdNnRdM0"
      }
    },
    "locale": "en"
  }
  return JSON.stringify(base)
}

module.exports.generateGactionsPackage = generateGactionsPackage