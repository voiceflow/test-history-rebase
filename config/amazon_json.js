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
	                },
	                {
	                    "name": "AMAZON.NavigateHomeIntent",
	                    "samples": []
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
    r.keywords = r.keywords.split(",").map(item => item.trim());

    return {
     	"manifest": {
             "publishingInformation": {
                 "locales": {
                     "en-US": {
                         "summary": r.summary,
                         "examplePhrases": r.invocations,
                         "keywords": r.keywords,
                         "name": r.name,
                         "description": r.description,
                         "smallIconUri": r.small_icon,
                         "largeIconUri": r.large_icon
                     }
                 },
                 "isAvailableWorldwide": false,
                 "testingInstructions": r.instructions,
                 "category": r.category,
                 "distributionCountries": [
                     "US"
                 ]
             },
             "apis": {
                 "custom": {
                     "endpoint": {
                         "uri": `https://app.getvoiceflow.com/state/skill/${encoded_id}`,
                         "sslCertificateType": "Wildcard"
                     }
                 }
             },
             "manifestVersion": "1.0",
             "privacyAndCompliance": {
                 "allowsPurchases": r.purchase,
                 "locales": {
                     "en-US": {
                         "termsOfUseUrl": "https://getvoiceflow.com",
                         "privacyPolicyUrl": "https://getvoiceflow.com"
                     }
                 },
                 "isExportCompliant": r.export,
                 "isChildDirected": r.copa,
                 "usesPersonalInfo": r.personal,
                 "containsAds": r.ads
             }
         }
    }
}


module.exports = {
	interactionModel: interactionModel,
	manifest: manifest
}