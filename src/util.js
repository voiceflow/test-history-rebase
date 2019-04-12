const  { find } = require('lodash')
const { SLOT_TYPES } = require('./Constants')
const randomstring = require("randomstring")
const { validSpokenCharacters, validLatinChars } = require('./services/Regex')
const draftToMarkdown = require('./services/draftConvert')

const getUtterancesWithSlotNames = (utterances, slots, square_brackets=false, format_name=false) => {

	const re = /(\{\{\[[^}{[\]]+]\.([a-zA-Z0-9]+)\}\})/g;
	let m;

	const new_utterances = utterances.map(e => e.text).filter(e => !!e.trim()).map(input => {
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

const getSlotType = (slot, platform) => {
	let type = slot.name
	if (slot.type.value && slot.type.value.toLowerCase() !== 'custom') {
		let default_slot = find(SLOT_TYPES, (s => s.label.toLowerCase() === slot.type.value.toLowerCase()))
		if (!default_slot) {
			type = slot.type.value  //Platform specific slot
		} else {
			type = default_slot.type[platform]
		}
	}
	return type
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

		slot.name = formatName(slot.name)

		return {
			name: slot.name,
			type: getSlotType(slot, platform)
		}
	})
}

const getSlotsForKeys = (keys, slots, platform) => {
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

		if (slot_type && slot_type.toLowerCase() !== 'custom') {
			formatted_type = slot.type.value
			const built_in_slot = find(SLOT_TYPES, { label: slot_type })
			if (built_in_slot && platform && built_in_slot.type[platform]) {
				formatted_type = built_in_slot.type[platform]
			}
		}

		return {
			name: slot.name,
			type: formatted_type
		}
	})
}

const findSlot = (slot_type, platform) => {
  const built_in_slot = find(SLOT_TYPES, { label: slot_type })
  if(built_in_slot) return built_in_slot.type[platform] 
  return null
}

const replacer = (match, inner, slots, extracted) => {
	const slot = find(slots, {name: inner})
	if(slot){
		slot.name = formatName(slot.name)
		extracted.push({
			name: slot.name,
			type: getSlotType(slot, 'alexa')
		})
		return `{${slot.name}}`
	}else{
		return inner.replace(/_/g, " ")
	}
}

exports.parseChoiceInput = (input, slots) => {
	let extracted = []
	input = input.replace(/\[([a-zA-Z_]{1,170})\]/g, (match, inner) => replacer(match, inner, slots, extracted)).replace()

	// get rid of any non valid characters
	let reg = new RegExp("[^"+validSpokenCharacters+" \\{\\}|]", "g")
	return {
		formatted_input: input.replace(reg, ''),
		extracted_slots: extracted
	}
}

exports.stripSample = (utterance) => {
	let reg = new RegExp("[^"+validSpokenCharacters+"\\{\\}|]", "g")
	return utterance.replace(reg, '').normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

exports.utteranceToIntentName = (utterance, existing) => {
	let reg = new RegExp("[^"+validLatinChars+"_|]", "g")
	// REGEX GOD
	let name = utterance
		.trim().replace(/\s/g, '_').replace(reg, '').normalize('NFD')
		.replace(/[\u0300-\u036f]/g, "").toLowerCase().substring(0, 170)

	// make sure the first letter is valid alphanumeric
	while(!'abcdefghijklmnopqrstuvwxyz'.includes(name.charAt(0)) && name.length > 0){
		name = name.substring(1)
	}

	while(existing.has(name) || !name.trim()){
    if(name.trim()){
      name = name.substring(0, 164) + '_'
    }
		name += randomstring.generate({length: 5, charset: 'alphabetic', capitalization: 'lowercase'})
	}

	return name
}

// THIS IS TERRIBLE BUT JUST TO CHECK IF IT IS ON BACKEND
// if(process.env.CONFIG_ID_HASH){
// 	const { DEFAULT_ALEXA_INTENT_MATCH } = require('./Constants')
// 	const LANGUAGE_SET = {}
// 	for(var language in DEFAULT_ALEXA_INTENT_MATCH){
// 		let intents = DEFAULT_ALEXA_INTENT_MATCH[language]
// 		LANGUAGE_SET[language] = {}
// 		for(var intent of intents){
// 			for(var sample of intent.samples){
// 				LANGUAGE_SET[language][exports.stripSample(sample)] = intent.name
// 			}
// 		}
// 	}
// 	exports.LANGUAGE_SET = LANGUAGE_SET
// }

const deepDraftToMarkdown = (object) => {
  let result = object
  let variables = new Set()
  let regex = /\{([A-Za-z0-9_]*)\}/g

  const finder = str => {
    let match = regex.exec(str)
    while (match != null) {
      if(/[A-Za-z0-9_]{1,24}/.test(match[1])){
          variables.add(match[1])
        }
        match = regex.exec(str)
    }
  }

  const recurse = (sub_collection, resultToModify) => {
    if (typeof sub_collection === 'object') {
      for (let key in sub_collection) {
        let val = sub_collection[key]
        if (typeof val === 'object' && val && val.blocks && val.entityMap && Object.keys(val).length === 2) {
          val = draftToMarkdown(val)
        }
        if (typeof val === 'object' && val && val.value !== undefined && typeof val.value !== 'object') {
          val = val.value
        }
        resultToModify[key] = val
        recurse(sub_collection[key], resultToModify[key])
      }
    } else {
      if (typeof sub_collection === 'string') {
        finder(sub_collection)
      }
    }
  }

  recurse(object, result)
  return {
    result,
    variables: [...variables]
  }
}

const deepVariableSubstitution = (object, variableMap) => {
  const replacer = (match, inner, variables_map, uriEncode = false) => {
    if(inner in variables_map){
        return uriEncode ? encodeURIComponent(variables_map[inner]) : variables_map[inner]
    }else{
        return match
    }
  }

  const recurse = (sub_collection, uriEncode = false) => {
    if (typeof sub_collection === 'object') {
      for (let key in sub_collection) {
        sub_collection[key] = key === 'url' ? recurse(sub_collection[key], true) : recurse(sub_collection[key])
      }
    } else if (typeof sub_collection === 'string') {
      return sub_collection.replace(/\{([A-Za-z0-9_]*)\}/g, (match, inner) => replacer(match, inner, variableMap, uriEncode))
    }
    return sub_collection
  }

  return recurse(object)
}

exports.findSlot = findSlot
exports.getUtterancesWithSlotNames = getUtterancesWithSlotNames
exports.formatName = formatName
exports.getSlotsForKeysAndFormat = getSlotsForKeysAndFormat
exports.getSlotsForKeys = getSlotsForKeys
exports.getSlotType = getSlotType
exports.deepDraftToMarkdown = deepDraftToMarkdown
exports.deepVariableSubstitution = deepVariableSubstitution