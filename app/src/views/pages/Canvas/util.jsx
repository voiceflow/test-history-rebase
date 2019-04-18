// Convert older deprecated blocks to newer ones
import _ from 'lodash'
import { BlockNodeModel } from './../../components/SRD/models/BlockNodeModel'
import { Toolkit } from "./../../components/SRD/Toolkit";
import randomstring from "randomstring";

const toolkit = new Toolkit()
    ;
const generateID = () => {
    return "xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0
        const v = c === "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

const convertDiagram = (diagram, diagrams) => {

    const port_ids = new Set()

    const save_stuff = {}
    save_stuff.commands = []

    var i;
    // reverse forloop to do splicing operations
    for (i = diagram.nodes.length - 1; i >= 0; i -= 1) {
        let node = diagram.nodes[i]

        if (node.extras) {
            // If diagram/flow blocks, use the name of their flow as the name
            if (node.extras.type === 'flow' && node.extras.diagram_id) {
                let find = diagrams.find(x => x.id === node.extras.diagram_id)
                if (find) {
                    node.name = find.name
                }
            } else if (node.extras.type === 'command' && (typeof node.extras.commands !== 'string') && !(node.extras.google || node.extras.alexa)) {
                if (!node.extras.resume) {
                    node.extras.type = 'jump'
                    if (node.name.toLowerCase() === 'command') {
                        node.name = 'Jump'
                    }
                } else {
                    node.ports = []
                }
            } else if (node.extras.type === 'jump') {
                node.extras.type = 'intent'
                node.name = 'Intent'
            } else if (node.extras.type === 'intent' && node.extras.choices) {
                node.extras.type = 'interaction'
                node.name = 'Interaction'
            } else if (node.extras.type === 'stream') {
                node.ports.forEach(port => (port.label === 'stop/pause' && (port.label = 'pause')))

                if (node.extras.player !== undefined) {
                    if (node.extras.player === false) {
                        if (node.ports.length === 2) {
                            const outputs = ['previous', 'next']
                            outputs.forEach(out => {
                                let ID = generateID()
                                node.ports.push({
                                    "id": ID,
                                    "type": "default",
                                    "selected": false,
                                    "name": ID,
                                    "parentNode": node.id,
                                    "links": [],
                                    "maximumLinks": 1,
                                    "in": false,
                                    "label": out
                                })
                            })
                        }
                        node.ports = node.ports.reverse()
                    } else if (node.extras.player === true) {
                        node.ports = [node.ports[0], node.ports[2], node.ports[3], node.ports[1]]
                    }

                    node.extras.custom_pause = true
                    delete node.extras.player
                }
            }

            if (node.extras.type === 'command' && !node.extras.commands) {
                save_stuff.commands.push(node)
                diagram.nodes.splice(i, 1)
            } else if (node.extras.type === 'story') {
                // DEPRECATE
                // if(!node.extras.new){
                //     node.extras.new = true
                //     node.x = node.x - 91
                //     node.y = node.y - 16
                // }
                if (!node.combines) {
                    node.combines = []
                }
                save_stuff.start = node
            }
        }
        if (Array.isArray(node.ports)) {
            node.ports.forEach(port => port_ids.add(port.id))
            if (!_.isEmpty(node.combines)) {
                _.remove(node.combines, combine => combine === 'temp')
                _.forEach(node.combines, c => {
                    c.ports.forEach(p => port_ids.add(p.id));
                })
            }
        }
    }

    if (!save_stuff.start) {
        console.log("No Start Block (diagram id, commands)", diagram.id, save_stuff.commands)
        save_stuff.start = { "id": "88888888-8888-8888-8888-888888888888", "x": -210, "y": 450, "extras": { "type": "story" }, "ports": [{ "id": "bc62ed8a-8d37-4455-a757-14d54ec67be4", "name": "ada4c7d0-bc0e-40f6-a5b3-c8871f71bbb0", "parentNode": "88888888-8888-8888-8888-888888888888", "links": [], "in": false, "label": " " }], "name": "Start", "combines": [] }
        diagram.nodes.push(save_stuff.start)
    }

    save_stuff.commands.forEach(command => save_stuff.start.combines.push(command))

    // get rid of links that don't have existing ports
    diagram.links = diagram.links.filter(link => {
        return port_ids.has(link.sourcePort) && port_ids.has(link.targetPort)
    })

    return diagram
}


const serializeDiagram = engine => {
    let serialize = engine.getDiagramModel().serializeDiagram();
    _.map(serialize.nodes, node => {
        if (!_.isEmpty(node.combines)) {
            let isHome = node.extras.type === 'story'
            if (!isHome) node.extras.nextID = node.combines[0].id
            node.combines = _.map(node.combines, (combine, idx) => {
                if (combine.parentCombine) {
                    delete combine.parentCombine
                }
                if (!isHome) {
                    if (idx !== node.combines.length - 1 && combine.extras) {
                        combine.extras.nextID = node.combines[idx + 1].id
                    }
                }
                return combine.serialize ? combine.serialize() : combine
            })
        } else {
            delete node.combines
        }
    })
    return serialize
}

const canSave = currentModel => {
    // Get the size of the diagram in bytes
    const size = (new TextEncoder('utf-8').encode(currentModel)).length
    // If the size is too large warn the user
    return size < 399000
}

const createCombineNode = (node, type, parent) => {
    node.parentCombine = parent
    if (type === 'choice') {
        node.addInPort(' ')
        node.addOutPort('else').setMaximumLinks(1)
        node.extras = {
            choices: [],
            inputs: [],
            type: 'choice'
        };
        node.extras.inputs.push('');
        node.extras.choices.push({
            open: true,
            key: randomstring.generate(5)
        })
        let test = node.addOutPort(node.extras.inputs.length);
        test.setMaximumLinks(1);
    } else if (type === 'exit') {
        node.addInPort(' ')
        node.extras.type = 'exit'
    } else if (type === 'interaction') {
        node.addInPort(' ');
        node.addOutPort('else').setMaximumLinks(1);
        node.extras = {
            alexa: {
                choices: []
            },
            google: {
                choices: []
            },
            type: 'interaction'
        }
    } else if (type === 'combine') {
        node.addInPort(' ')
        node.addOutPort(' ').setMaximumLinks(1)
        node.extras = {
            audio: false,
            lines: [
                {
                    collapse: true,
                    audio: false,
                    title: 'Line Audio'
                }
            ],
            type: 'combine'
        }
    } else if (type === 'speak') {
        node.addInPort(' ')
        node.addOutPort(' ').setMaximumLinks(1)
        node.extras = {
            randomize: false,
            type: 'speak'
        }
        // ONBOARDING
        // if(this.onboarding && this.state.onboarding_step < 1){
        //     setTimeout(()=>this.setState({onboarding_step: 1, onboarding_run: true}), 400)
        // }
    } else if (type === 'card') {
        node.addInPort(' ')
        node.addOutPort(' ').setMaximumLinks(1)
        node.extras = {
            cardtype: 'Simple',
            type: 'card',
        }
    } else if (type === 'reminder') {
        node.addInPort(' ')
        node.addOutPort(' ').setMaximumLinks(1)
        node.addOutPort('fail').setMaximumLinks(1)
        node.extras = {
            reminder: null,
            type: 'reminder'
        }
    } else if (type === 'flow') {
        node.addInPort(' ')
        node.addOutPort(' ').setMaximumLinks(1)
        node.extras = {
            diagram_id: null,
            inputs: [],
            outputs: [],
            type: 'flow'
        }
    } else if (type === 'intent') {
        node.addOutPort(' ').setMaximumLinks(1)
        node.extras = {
            alexa: {
                intent: null,
                mappings: [],
                resume: false
            },
            google: {
                intent: null,
                mappings: [],
                resume: false
            },
            type: 'intent'
        }
    } else if (type === 'comment') {
        node.name = 'New Comment'
        node.extras = {
            type: 'comment'
        }
        node.clearListeners()
    } else if (type === 'ending') {
        node.addInPort(' ')
        node.extras = {
            audio: '',
            audioText: '',
            audioVoice: '',
            type: 'ending'
        }
    } else if (type === 'random') {
        node.addInPort(' ')
        node.addOutPort(1).setMaximumLinks(1)
        node.extras = {
            paths: 1,
            type: 'random'
        }
    } else if (type === 'variable') {
        node.addInPort(' ')
        node.addOutPort(' ').setMaximumLinks(1)
        node.extras = {type: 'variable'}
    } else if (type === 'set') {
        node.addInPort(' ')
        node.addOutPort(' ').setMaximumLinks(1)
        node.extras = {
            sets: [],
            type: 'set'
        }
    } else if (type === 'if') {
        node.addInPort(' ')
        node.addOutPort('else').setMaximumLinks(1)
        node.addOutPort('1').setMaximumLinks(1)
        node.extras = {
            expressions: [{
                type: 'value',
                value: '',
                depth: 0
            }],
            type: 'if'
        }
    } else if (type === 'api') {
        node.name = 'API'
        node.addInPort(' ')
        node.addOutPort(' ').setMaximumLinks(1)
        node.addOutPort('fail').setMaximumLinks(1)
        node.extras = {
            url: '',
            method: 'GET',
            headers: [],
            body: [],
            content: '',
            bodyInputType: 'keyValue',
            params: [],
            mapping: [],
            success_id: '',
            failure_id: '',
            type: 'api'
        }
    } else if (type === 'payment') {
        node.addInPort(' ')
        node.addOutPort(' ').setMaximumLinks(1)
        node.addOutPort('fail').setMaximumLinks(1)
        node.extras = {
            product_id: null,
            type: 'payment'
        }
    } else if (type === 'link_account') {
        node.name = 'Link Account'
        node.addInPort(' ')
        node.addOutPort(' ').setMaximumLinks(1)
    } else if (type === 'capture') {
        node.addInPort(' ')
        node.addOutPort(' ').setMaximumLinks(1)
        node.extras = {
            variable: null
        }
    } else if (type === 'mail') {
        node.addInPort(' ')
        node.addOutPort(' ').setMaximumLinks(1)
        node.addOutPort('fail').setMaximumLinks(1)
        node.extras = {
            template_id: null,
            mapping: [],
            to: ''
        }
    } else if (type === 'code') {
        node.addInPort(' ')
        node.addOutPort(' ').setMaximumLinks(1)
        node.addOutPort('fail').setMaximumLinks(1)
        node.extras = {
            code: ''
        }
    } else if (type === 'display') {
        node.addInPort(' ')
        node.addOutPort(' ').setMaximumLinks(1)
        node.extras = {
            display_id: null,
            datasource: '',
            update_on_change: false,
            apl_commands: ''
        }
    } else if (type === 'stream') {
        node.addInPort(' ')
        node.addOutPort('next').setMaximumLinks(1)
        node.addOutPort('previous').setMaximumLinks(1)
        node.extras = {
            audio: ''
        }
    } else if (type === 'permission') {
        node.addInPort(' ')
        node.addOutPort(' ').setMaximumLinks(1)
        node.extras = {}
    } else if (type === 'permissions') {
        node.name = 'User Info'
        node.addInPort(' ')
        node.addOutPort(' ').setMaximumLinks(1)
        node.addOutPort('fail').setMaximumLinks(1)
        node.extras = {
            permissions: []
        }
    } else if (type === 'link_account') {
        node.addInPort(' ')
        node.addOutPort(' ').setMaximumLinks(1)
    }
}

const createDropNode = (event, engine, type, name) => {
    var node = new BlockNodeModel(name, null, toolkit.UID())
    if (type) {
        if (type === 'choice') {
            node.addInPort(' ')
            node.addOutPort('else').setMaximumLinks(1)
            node.extras = {
                choices: [],
                inputs: []
            };
            node.extras.inputs.push('');
            node.extras.choices.push({
                open: true,
                key: randomstring.generate(5)
            })
            let test = node.addOutPort(node.extras.inputs.length);
            test.setMaximumLinks(1);
        } else if (type === 'exit') {
            node.addInPort(' ')
        } else if (type === 'interaction') {
            node.addInPort(' ');
            node.addOutPort('else').setMaximumLinks(1);
            node.extras = {
                alexa: {
                    choices: []
                },
                google: {
                    choices: []
                }
            }
        } else if (type === 'combine') {
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
            node.extras = {
                audio: false,
                lines: [
                    {
                        collapse: true,
                        audio: false,
                        title: 'Line Audio'
                    }
                ]
            }
        } else if (type === 'speak') {
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
            node.extras = {
                randomize: false
            }
            // ONBOARDING
            // if(this.onboarding && this.state.onboarding_step < 1){
            //     setTimeout(()=>this.setState({onboarding_step: 1, onboarding_run: true}), 400)
            // }
        } else if (type === 'card') {
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
            node.extras = {
                cardtype: 'Simple'
            }
        } else if (type === 'reminder') {
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
            node.addOutPort('fail').setMaximumLinks(1)
            node.extras = {
                reminder: null
            }
        } else if (type === 'flow') {
            let diagram_id = event.dataTransfer.getData('diagram_id')
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
            node.extras = {
                diagram_id: diagram_id,
                inputs: [],
                outputs: []
            }
        } else if (type === 'intent') {
            node.addOutPort(' ').setMaximumLinks(1)
            node.extras = {
                alexa: {
                    intent: null,
                    mappings: [],
                    resume: false
                },
                google: {
                    intent: null,
                    mappings: [],
                    resume: false
                }
            }
        } else if (type === 'comment') {
            node.name = 'New Comment'
            node.clearListeners()
        } else if (type === 'ending') {
            node.addInPort(' ')
            node.extras = {
                audio: '',
                audioText: '',
                audioVoice: ''
            }
        } else if (type === 'random') {
            node.addInPort(' ')
            node.addOutPort(1).setMaximumLinks(1)
            node.extras = {
                paths: 1
            }
        } else if (type === 'variable') {
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
            node.extras = {}
        } else if (type === 'set') {
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
            node.extras = {
                sets: []
            }
        } else if (type === 'if') {
            node.addInPort(' ')
            node.addOutPort('else').setMaximumLinks(1)
            node.addOutPort('1').setMaximumLinks(1)
            node.extras = {
                expressions: [{
                    type: 'value',
                    value: '',
                    depth: 0
                }]
            }
        } else if (type === 'api') {
            node.name = 'API'
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
            node.addOutPort('fail').setMaximumLinks(1)
            node.extras = {
                url: '',
                method: 'GET',
                headers: [],
                body: [],
                content: '',
                bodyInputType: 'keyValue',
                params: [],
                mapping: [],
                success_id: '',
                failure_id: ''
            }
        } else if (type === 'integrations') {
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
            node.addOutPort('fail').setMaximumLinks(1)
            node.extras = {
                success_id: '',
                failure_id: '',
                selected_integration: '',
                integrations_data: {},
                selected_action: ''
            }
        } else if (type === 'payment') {
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
            node.addOutPort('fail').setMaximumLinks(1)
            node.extras = {
                product_id: null
            }
        } else if (type === 'cancel') {
            let data = event.dataTransfer.getData('data')
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
            node.addOutPort('fail').setMaximumLinks(1)
            node.extras = {
                product_id: data ? (data * 1) : null
            }
        } else if (type === 'link_account') {
            node.name = 'Link Account'
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
        } else if (type === 'capture') {
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
            node.extras = {
                variable: null
            }
        } else if (type === 'mail') {
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
            node.addOutPort('fail').setMaximumLinks(1)
            node.extras = {
                template_id: null,
                mapping: [],
                to: ''
            }
        } else if (type === 'code') {
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
            node.addOutPort('fail').setMaximumLinks(1)
            node.extras = {
                code: ''
            }
        } else if (type === 'display') {
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
            node.extras = {
                display_id: null,
                datasource: '',
                update_on_change: false,
                apl_commands: ''
            }
        } else if (type === 'stream') {
            node.addInPort(' ')
            node.addOutPort('next').setMaximumLinks(1)
            node.addOutPort('previous').setMaximumLinks(1)
            node.extras = {
                audio: ''
            }
        } else if (type === 'permission') {
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
            node.extras = {}
        } else if (type === 'permissions') {
            node.name = 'User Info'
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
            node.addOutPort('fail').setMaximumLinks(1)
            node.extras = {
                permissions: []
            }
        } else if (type === 'link_account') {
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
        } else if (type === 'module') {
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)

            try {
                let data = JSON.parse(event.dataTransfer.getData('data'))
                let inputs = data.input ? JSON.parse(data.input) : []
                let outputs = data.output ? JSON.parse(data.output) : []

                node.name = data.title ? data.title : 'Module'

                node.extras = {
                    diagram_id: data.diagram_id,
                    mapping: {
                        inputs: inputs.map(i => {
                            return {
                                key: i,
                                val: ''
                            }
                        }),
                        outputs: outputs.map(i => {
                            return {
                                key: i,
                                val: ''
                            }
                        })
                    },
                    version_id: data.version_id,
                    module_id: data.module_id,
                    module_icon: data.module_icon,
                    color: data.color
                }
            } catch (err) {
                console.error(err)
                return this.props.setError('Error - Module Broken')
            }
        }
        engine.stopMove()
        node.extras.type = type

        var points = engine.getRelativeMousePoint(event)
        node.x = points.x - (node.name.length * 4.5 + 40)
        node.y = points.y - 30

        node.setSelected()
        engine.getDiagramModel().clearSelection()
        engine.getDiagramModel().addNode(node)
        engine.setSuperSelect(node)
    }
}

export {
    canSave,
    generateID,
    serializeDiagram,
    convertDiagram,
    createDropNode,
    createCombineNode,
}