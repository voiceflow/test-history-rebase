const _ = require('lodash')

const _formatName = (name) => {
	let formatted_name = name.replace(' ', '_')
	Array.from(Array(10).keys()).forEach(i => {
		formatted_name = formatted_name.replace(i.toString(), String.fromCharCode(i + 65))
	})
	return formatted_name
}

const _getUtterancesWithSlotNames = (utterances, slots) => {

	const re = /(\{\{\[[^\}\{\[\]]+]\.(\d+)\}\})/g;
	let m;

	const utterance_text = utterances.map(e => e.text)

	const new_utterances = utterance_text.map( input => {
		let new_input = input
		do {
			m = re.exec(input)
			if (m) {
				const replace = m[1]
				const key = m[2]
				const slot =_.find(slots, { key: +key })
				if (slot) {
					let slot_name = _.find(slots, { key: +key }).name
					slot_name = _formatName(slot_name)
					new_input = new_input.replace(replace, `{${slot_name}}`)
				} else {
					return new_input
				}
			}
		} while (m);
		return new_input
	})
	return new_utterances
}

const _getSlotsForKeys = (keys, slots) => {
	let key_set = new Set()

	keys.forEach(key_arr => {
		key_arr.forEach(key => {
			key_set.add(key)
		})
	})

	key_set = [...key_set]

	return key_set.map(key => {
		const slot = _.find(slots, {key: key})
		return {
			name: _formatName(slot.name),
			type: slot.type.value !== 'CUSTOM' ? slot.type.value : _formatName(slot.name)
		}
	})
}

const interactionModel = (req) => {

	const invocation = req.inv_name
	const intents = req.intents
	const slots = req.slots
	const used_choices = req.used_choices

	console.log("USED CHOICES", used_choices)

	const used_intents = req.used_intents
	
	const intents_for_amazon = [
		{
			"name": "AMAZON.CancelIntent",
			"samples": [
				"cancel"
			]
		},
		{
			"name": "AMAZON.HelpIntent",
			"samples": [
				"help"
			]
		},
		{
			"name": "AMAZON.StopIntent",
			"samples": [
				"stop"
			]
		},
		{
			"name": "AMAZON.YesIntent",
			"samples": [
				"yes"
			]
		},
		{
			"name": "AMAZON.NoIntent",
			"samples": [
				"no"
			]
		},
		{
			"name": "AMAZON.ResumeIntent",
		},
		{
			"name": "AMAZON.PauseIntent",
		},
		{
			"name": "StoryFlowIntent",
			"slots": [
				{
					"name": "content",
					"type": "Content"
				}
			],
			"samples": [
				"{content}"
			]
		}
	]

	used_intents.forEach(intent_key => {
		const intent = _.find(intents, { key: intent_key })
		if (!intent) {
			throw(`Intent Key ${intent_key} not found!`)
		}
		const name = _formatName(intent.name)
		let samples
		if (!intent.built_in) {
			samples = _getUtterancesWithSlotNames(intent.inputs, slots)
		}
		const _slots = _getSlotsForKeys(intent.inputs.map(input => input.slots), slots)

		intents_for_amazon.push({
			name: name,
			slots: _slots,
			samples: samples
		})
	})

	const content_slot_values = [
		{
			"name": {
				"value": "one"
			}
		},
		{
			"name": {
				"value": "two"
			}
		},
		{
			"name": {
				"value": "three"
			}
		},
		{
			"name": {
				"value": "1"
			}
		},
		{
			"name": {
				"value": "2"
			}
		},
		{
			"name": {
				"value": "3"
			}
		},
		{
			"name": {
				"value": "hey hey"
			}
		},
		{
			"name": {
				"value": "hey hey hey"
			}
		},
		{
			"name": {
				"value": "hey hey hey hey"
			}
		},
		{
			"name": {
				"value": "hey hey hey hey hey"
			}
		},
		{
			"name": {
				"value": "hey hey hey hey hey hey"
			}
		},
		{
			"name": {
				"value": "hey hey hey hey hey hey hey"
			}
		},
		{
			"name": {
				"value": "hey hey hey hey hey hey hey hey"
			}
		},
		{
			"name": {
				"value": "hey hey hey hey hey hey hey hey hey"
			}
		},
		{
			"name": {
				"value": "hey hey hey hey hey hey hey hey hey hey"
			}
		},
		{
			"name": {
				"value": "hey hey hey hey hey hey hey hey hey hey hey"
			}
		},
		{
			"name": {
				"value": "hey hey hey hey hey hey hey hey hey hey hey hey"
			}
		},
		{
			"name": {
				"value": "hey hey hey hey hey hey hey hey hey hey hey hey hey"
			}
		},
		{
			"name": {
				"value": "Quick brown fox jumps over the lazy dog"
			}
		},
		{
			"name": {
				"value": "Nymphs blitz quick vex dwarf jog"
			}
		},
		{
			"name": {
				"value": "Cwm fjord veg balks nth pyx quiz"
			}
		},
		{
			"name": {
				"value": "supercalifragilisticexpialidocious"
			}
		}
	]

	used_choices.forEach(choice => {
		content_slot_values.push({
			name: {
				value: choice
			}
		})
	})

	const slot_types = [
		{
			"name": "Content",
			"values": content_slot_values
		}
	]

	slots.forEach(slot => {
		if (slot.type.value === 'CUSTOM') {
			const slot_name = _formatName(slot.name)
			const values = slot.inputs.map(input => {
				return {
					name: {
					  value: input
					}
				}
			})

			slot_types.push({
				name: slot_name,
				values: values
			})
		}
	})

	return {
	    "interactionModel": {
	        "languageModel": {
	            "invocationName": invocation.toLowerCase(),
	            "intents": intents_for_amazon,
	            "types": slot_types
	        }
	    }
	}
}

const manifest = (r, encoded_id) => {
    r.invocations = r.invocations.value.map(item => ('Alexa, ' + item.toLowerCase()));
	r.keywords = r.keywords.split(",").map(item => item.trim()).filter(word => !!word);
	
	const localeObj = {
		"summary": r.summary,
		"examplePhrases": r.invocations,
		"name": r.name,
		"description": r.description,
		"keywords": r.keywords,
		"smallIconUri": r.small_icon,
		"largeIconUri": r.large_icon
	};
	// optional fields
	// if(r.keywords.length !== 0){
	// 	localeObj.keywords = r.keywords;
	// }
	// if(r.small_icon){
	// 	localeObj.smallIconUri = r.small_icon;
	// }
	// if(r.large_icon){
	// 	localeObj.largeIconUri = r.large_icon;
	// }


	const locales = {}
	r.locales.forEach(locale => {
		locales[locale] = localeObj;
	})

	// TODO: in the future we need a different one for each 
	
	var privacyLocales = null

	if(r.privacy_policy || r.terms_and_cond){
		privacyLocales = {}

		r.locales.forEach(locale => {
			privacyLocales[locale] = {}
			if(r.terms_and_cond){
				privacyLocales[locale].termsOfUseUrl = r.terms_and_cond
			}
			if(r.privacy_policy){
				privacyLocales[locale].privacyPolicyUrl = r.privacy_policy
			}
		})
	}

    let ret = {
     	"manifest": {
             "publishingInformation": {
                 "locales": locales,
                 "isAvailableWorldwide": true,
                 "testingInstructions": r.instructions
             },
             "apis": {
                 "custom": {
                     "endpoint": {
                         "uri": `https://app.getvoiceflow.com/state/skill/${encoded_id}`,
                         "sslCertificateType": "Wildcard"
                     },
                     "interfaces": [{
	                 	"type": "AUDIO_PLAYER"
	                 }]
                 }
             },
             "manifestVersion": "1.0",
             "privacyAndCompliance": {
                 "allowsPurchases": r.purchase,
                 "isExportCompliant": r.export,
                 "isChildDirected": r.copa,
                 "usesPersonalInfo": r.personal,
                 "containsAds": r.ads
			 }
         }
    }
    if(r.category){
    	ret.manifest.publishingInformation.category = r.category
    }
    if(privacyLocales){
    	ret.manifest.privacyAndCompliance.locales = privacyLocales
    }
    if(Array.isArray(r.permissions) && r.permissions.length !== 0){
    	ret.manifest.permissions = r.permissions;
    }

    return ret;
}


module.exports = {
	interactionModel: interactionModel,
	manifest: manifest,
	_getUtterancesWithSlotNames: _getUtterancesWithSlotNames,
	_getSlotsForKeys: _getSlotsForKeys
}
