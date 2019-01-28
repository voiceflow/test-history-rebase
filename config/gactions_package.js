const { getEnvVariable } = require('../util')
const { SLOT_TYPES, BUILT_IN_INTENTS_GOOGLE } = require('../app/src/views/pages/Canvas/Constants')
const _ = require('lodash')
const { getUtterancesWithSlotNames, formatName } = require('../app/src/util')

const _getSlotsForKeysAndFormat = (keys, slots) => {
	let key_set = new Set()

	keys.forEach(key_arr => {
		key_arr.forEach(key => {
			key_set.add(key)
		})
	})

	key_set = [...key_set]

	return key_set.map(key => {
		const slot = _.find(slots, {
			key: key
		})
		return {
			name: formatName(slot.name),
			type: slot.type.value !== 'CUSTOM' ? slot.type.value : formatName(slot.name)
		}
	})
}

const generateGactionsPackage = (params) => {

  const intents = params.intents
  const slots = params.slots
  const used_intents = params.used_intents
  const title = params.inv_name || 'Test Skill'
  const skill_id = params.skill_id || 'P2WdNnRdM0'

  console.log("used_intents", params, used_intents, BUILT_IN_INTENTS_GOOGLE)

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

		const name = formatName(intent.name)

		if (!entered_intents.has(name)) {

			entered_intents.add(name)

			let formatted_intent = {
				name: name
			}

			if (!intent.built_in) {
				formatted_intent.samples = getUtterancesWithSlotNames(intent.inputs, slots, false, true)
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
    },
    {
      "name": "BUY",
      "intent": {
        "name": "com.voiceflow.BUY",
        "parameters": [
          {
            "name": "color",
            "type": "org.schema.type.Color"
          }
        ],
        "trigger": {
          "queryPatterns": [
            "find some $org.schema.type.Color:color sneakers",
            "buy some blue suede shoes",
            "get running shoes"
          ]
        }
      },
      "fulfillment": {
        "conversationName": "Voiceflow"
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