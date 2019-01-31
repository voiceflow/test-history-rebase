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
      type: slot.type.value.toLowerCase() !== 'custom' ? slot.type.value : formatName(slot.name),
      samples: slot.inputs
		}
	})
}

const generateDialogflowPackage = (params) => {

  const intents = params.intents
  const slots = params.slots
  const used_intents = params.used_intents

  const intents_for_google = []
  const slots_for_google = []
  const entered_intents = new Set()
  const used_slots = new Set()

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
        const slot_keys = intent.inputs.map(input => input.slots)

				formatted_intent.samples = getUtterancesWithSlotNames(intent.inputs, slots, false, true)
        formatted_intent.slots = _getSlotsForKeysAndFormat(slot_keys, slots)

        slot_keys.forEach(key_arr => {
          key_arr.forEach(key => used_slots.add(key))
        })
			}
			intents_for_google.push(formatted_intent)
		}
  })

  used_slots.forEach(slot_key => {
    const slot = _.find(slots, {key:slot_key})
    if (!/^actions\.intent/.test(slot.name)) {
      slots_for_google.push({
        name: null,
        displayName: slot.name,
        kind: null,
        entities: slot.inputs.map(input => {
          return {
            value: input,
            synonyms: [input]
          }
        })
      })
    }
  })

  return {
    intents: intents_for_google,
    slots: slots_for_google
  }
}

module.exports.generateDialogflowPackage = generateDialogflowPackage