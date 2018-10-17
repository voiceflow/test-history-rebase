const interactionModel = (invocation) => {
	return {
	    "interactionModel": {
	        "languageModel": {
	            "invocationName": invocation,
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
	                    "name": "StoryLineIntent",
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

const manifest = (r) => {
    r.invocations = r.invocations.value;
    r.keywords = r.keywords.split(",").map(item => item.trim());

    return amznJSON = {
     	"manifest": {
             "publishingInformation": {
                 "locales": {
                     "en-US": {
                         "summary": r.summary,
                         "examplePhrases": r.invocations,
                         "keywords": r.keywords,
                         "name": r.name,
                         "description": r.description
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
                         "uri": `https://app.getstoryflow.com/skill/${r.skill_id}`
                     }
                 }
             },
             "manifestVersion": "1.0",
             "privacyAndCompliance": {
                 "allowsPurchases": r.purchase,
                 "locales": {
                     "en-US": {
                         "termsOfUseUrl": "https://getstoryflow.com",
                         "privacyPolicyUrl": "https://getstoryflow.com"
                     }
                 },
                 "isExportCompliant": r.export,
                 "isChildDirected": r.copa,
                 "usesPersonalInfo": r.personal
             }
         }
    }
}


module.exports = {
	interactionModel: interactionModel,
	manifest: manifest
}