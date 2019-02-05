
const  { find } = require('lodash')
const { SLOT_TYPES } = require('./Constants')

const getUtterancesWithSlotNames = (utterances, slots, square_brackets=false, format_name=false) => {

	const re = /(\{\{\[[^\}\{\[\]]+]\.([a-zA-Z0-9]+)\}\})/g;
	let m;

	const utterance_text = utterances.map(e => e.text)

	const new_utterances = utterance_text.map(input => {
		let new_input = input
		do {
			m = re.exec(input)
			if (m) {
				const replace = m[1]
				const key = m[2]
				const slot = find(slots, {
					key: key
				})
				if (slot) {
					let slot_name = slot.name
					if (format_name) slot_name = formatName(slot_name)
					if (square_brackets) {
            new_input = new_input.replace(replace, `[${slot_name}]`)
          } else {
            new_input = new_input.replace(replace, `{${slot_name}}`)
          }
				} else {
					return new_input
				}
			}
		} while (m);
		return new_input
	})
	return new_utterances
}

const formatName = (name) => {
	let formatted_name = name.replace(' ', '_')
	Array.from(Array(10).keys()).forEach(i => {
		formatted_name = formatted_name.replace(i.toString(), String.fromCharCode(i + 65))
	})
	return formatted_name
}

const getSlotsForKeysAndFormat = (keys, slots, platform) => {
	let key_set = new Set()

	keys.forEach(key_arr => {
		key_arr.forEach(key => {
			key_set.add(key)
		})
	})

	key_set = Array.from(key_set)

	return key_set.map(key => {
		const slot = find(slots, {
			key: key
		})

		let type = formatName(slot.name)
		if (slot.type.value.toLowerCase() !== 'custom') {
			let default_slot = find(SLOT_TYPES, (s => s.label.toLowerCase() === slot.type.value.toLowerCase()))
			if (!default_slot) throw(`Default slot not found for label ${slot.name}`)
			type = default_slot.type[platform]
		}

		return {
			name: formatName(slot.name),
			type: type
		}
	})
}

const getSlotsForKeys = (keys, slots, platform='alexa') => {
	let key_set = new Set()

	keys.forEach(key_arr => {
		key_arr.forEach(key => {
			key_set.add(key)
		})
	})

	key_set = Array.from(key_set)

	return key_set.map(key => {
		const slot = find(slots, {key: key})
		let slot_type = slot.type.value
		let formatted_type = slot.name

		if (slot_type.toLowerCase() !== 'custom') {
			formatted_type = slot.type.value
			const built_in_slot = find(SLOT_TYPES, { label: slot_type })
			if (built_in_slot && built_in_slot.type[platform]) {
				formatted_type = built_in_slot.type[platform]
			}
		}

		return {
			name: slot.name,
			type: formatted_type
		}
	})
}

exports.getUtterancesWithSlotNames = getUtterancesWithSlotNames
exports.formatName = formatName
exports.getSlotsForKeysAndFormat = getSlotsForKeysAndFormat
exports.getSlotsForKeys = getSlotsForKeys