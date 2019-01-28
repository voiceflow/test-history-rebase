
const _ = require('lodash')

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
				const slot = _.find(slots, {
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

module.exports = {
  getUtterancesWithSlotNames,
  formatName
}