const { getEnvVariable } = require('../util')
const { SLOT_TYPES, BUILT_IN_INTENTS_GOOGLE } = require('../app/src/views/pages/Canvas/Constants')
const _ = require('lodash')

const generateGactionsPackage = (params) => {

  const intents = params.intents
  const slots = params.slots
  const used_intents = params.used_intents
  const title = params.title || 'Test Skill'
  const skill_id = params.skill_id || 'P2WdNnRdM0'

  console.log("used_intents", used_intents, BUILT_IN_INTENTS_GOOGLE)

  const intents_for_google = []
	const entered_intents = new Set()

	used_intents.forEach(intent_key => {
		if (typeof intent_key !== 'string') return

		let intent
		if (intent_key.startsWith('actions.intent.')) {
			intent = _.find(BUILT_IN_INTENTS_GOOGLE, {
				name: intent_key
			})
			intent.built_in = true
		} else {
			intent = _.find(intents, {
				key: intent_key
			})
		}

		if (!intent) {
			return
		}

		const name = _formatName(intent.name)

		if (!entered_intents.has(name)) {

			entered_intents.add(name)

			let formatted_intent = {
				name: name
			}

			if (!intent.built_in) {
				formatted_intent.samples = _getUtterancesWithSlotNames(intent.inputs, slots)
				formatted_intent.slots = _getSlotsForKeysAndFormat(intent.inputs.map(input => input.slots), slots)
			}
			intents_for_google.push(formatted_intent)
		}
	})

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
        "url": `${getEnvVariable('SKILL_ENDPOINT')}/state/skill/gactions/${skill_id}`
        // "url": "https://app.getstoryflow.com/gactions/state/skill/P2WdNnRdM0"
      }
    },
    "locale": "en"
  }
  return JSON.stringify(base)
}

module.exports.generateGactionsPackage = generateGactionsPackage