const interactionModel = (invocation) => {
	return {
	    "interactionModel": {
	        "languageModel": {
	            "invocationName": invocation.toLowerCase(),
	            "intents": [
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
	            ],
	            "types": [
	                {
	                    "name": "Content",
						"values": [
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
	                }
	            ]
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
	const privacyLocales = {}
	let privacy_policy = "https://getvoiceflow.com";
	let terms_of_use = "https://getvoiceflow.com";
	if(r.privacy_policy){
		privacy_policy = r.privacy_policy
	}
	if(r.terms_and_cond){
		terms_of_use = r.terms_and_cond
	}

	r.locales.forEach(locale => {
		privacyLocales[locale] = {
			"termsOfUseUrl": terms_of_use,
			"privacyPolicyUrl": privacy_policy
		}
	})

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
                 "locales": privacyLocales,
                 "isExportCompliant": r.export,
                 "isChildDirected": r.copa,
                 "usesPersonalInfo": r.personal,
                 "containsAds": r.ads
			 }
         }
    }
    if(r.category){
    	ret.manifest.publishingInformation.category = r.category;
    }
    if(Array.isArray(r.permissions) && r.permissions.length !== 0){
    	ret.manifest.permissions = r.permissions;
    }

    return ret;
}


module.exports = {
	interactionModel: interactionModel,
	manifest: manifest
}
