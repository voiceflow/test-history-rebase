const generateGactionsPackage = (params) => {

  const intents = params.intents
  const slots = params.slots
  const locales = params.locales
  const title = params.title || 'Test Skill'
  const skill_id = params.skill_id || 'P2WdNnRdM0'

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
        "url": `https://lovely-turkey-33.localtunnel.me/state/skill/gactions/${skill_id}`
        // "url": "https://app.getstoryflow.com/gactions/state/skill/P2WdNnRdM0"
      }
    },
    "locale": "en"
  }
  return JSON.stringify(base)
}

module.exports.generateGactionsPackage = generateGactionsPackage