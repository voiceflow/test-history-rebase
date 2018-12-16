const _ = require('lodash')
const {BUILT_IN_INTENTS, DEFAULT_INTENTS, CATCHALL_SLOT_VALUES, VALID_UTTERANCES} = require('./Constants')

const _formatName = (name) => {
	let formatted_name = name.replace(' ', '_')
	Array.from(Array(10).keys()).forEach(i => {
		formatted_name = formatted_name.replace(i.toString(), String.fromCharCode(i + 65))
	})
	return formatted_name
}

const _getUtterancesWithSlotNames = (utterances, slots) => {

	const re = /(\{\{\[[^\}\{\[\]]+]\.([a-zA-Z0-9]+)\}\})/g;
	let m;

	const utterance_text = utterances.map(e => e.text)

	const new_utterances = utterance_text.map( input => {
		let new_input = input
		do {
			m = re.exec(input)
			if (m) {
				const replace = m[1]
				const key = m[2]
				const slot =_.find(slots, { key: key })
				if (slot) {
					let slot_name = _.find(slots, { key: key }).name
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
	const used_intents = req.used_intents
	
	const intents_for_amazon = []
	const entered_intents = new Set()

	used_intents.forEach(intent_key => {
		if(!intent_key) return
		
		let intent
		if(intent_key.startsWith('AMAZON.')){
			intent = _.find(BUILT_IN_INTENTS, {name: intent_key})
			intent.built_in = true
		}else{
			intent = _.find(intents, { key: intent_key })
		}

		if (!intent) {
			return
			// throw(`Intent Key ${intent_key} not found!`)
		}

		const name = _formatName(intent.name)

		if(!entered_intents.has(name)){

			entered_intents.add(name)

			let formatted_intent = {
				name: name
			}
	
			if (!intent.built_in) {
				formatted_intent.samples = _getUtterancesWithSlotNames(intent.inputs, slots)
				formatted_intent.slots = _getSlotsForKeys(intent.inputs.map(input => input.slots), slots)
			}else {
				formatted_intent.samples = []
			}
	
			intents_for_amazon.push(formatted_intent)
		}
	})

	// Write in default intents if they haven't been declared already
	DEFAULT_INTENTS.forEach(intent => {
		if(!entered_intents.has(intent.name)){
			entered_intents.add(intent.name)
			intents_for_amazon.push(intent)
		}
	})

	const content_slot_values = []

	
	used_choices.forEach(choice => {
		let reg = new RegExp('[^' + VALID_UTTERANCES + '|]')
		let safe_choice = choice.replace(reg, ' ')
		content_slot_values.push({
			name: {
				value: safe_choice
			}
		})
	})

	// Add random catchall values
	CATCHALL_SLOT_VALUES.forEach(val => {
		content_slot_values.push(val)
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
		// else{
		// 	const slot_name = slot.type.value
		// 	const values = slot.inputs.map(input => {
		// 		return {
		// 			name: {
		// 			  value: input
		// 			}
		// 		}
		// 	})
		// 	slot_types.push({
		// 		name: slot_name,
		// 		values: values
		// 	})
		// }
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
