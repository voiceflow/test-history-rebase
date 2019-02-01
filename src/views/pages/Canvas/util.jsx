const generateID = () => {
    return "xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0
        const v = c === "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

// Convert older deprecated blocks to newer ones
import { find } from 'lodash'

const convertDiagram = (diagram, diagrams) => {

    const port_ids = new Set()

    diagram.nodes.forEach(node => {
        if(node.extras){
            // If diagram/flow blocks, use the name of their flow as the name
            if (node.extras.type === 'flow' && node.extras.diagram_id) {
                let find = diagrams.find(x => x.id === node.extras.diagram_id)
                if(find){
                    node.name = find.name
                }
            }else if(node.extras.type === 'command' && (typeof node.extras.commands !== 'string') && !(node.extras.google || node.extras.alexa)){
                if(!node.extras.resume){
                    node.extras.type = 'jump'
                    if(node.name.toLowerCase() === 'command'){
                        node.name = 'Jump'
                    }
                }else{
                    node.ports = []
                }
            } else if(node.extras.type === 'jump'){
                node.extras.type = 'intent'
                node.name = 'Intent'
            } else if(node.extras.type === 'intent' && node.extras.choices){
                node.extras.type = 'interaction'
                node.name = 'Interaction'
            } else if(node.extras.type === 'story' && node.name === 'Start Block'){
                node.name = 'Start'
            } else if(node.extras.type === 'stream') {
                node.ports.forEach(port => (port.label === 'stop/pause' && (port.label = 'pause')))

                if(node.extras.player !== undefined){
                    if(node.extras.player === false){
                        if(node.ports.length === 2){
                            const outputs = ['previous', 'next']
                            outputs.forEach(out => {
                                let ID = generateID()
                                node.ports.push({
                                    "id": ID,
                                    "type":"default",
                                    "selected":false,
                                    "name": ID,
                                    "parentNode": node.id,
                                    "links":[],
                                    "maximumLinks":1,
                                    "in":false,
                                    "label": out
                                })
                            })
                        }
                        node.ports = node.ports.reverse()
                    }else if(node.extras.player === true){
                        node.ports = [node.ports[0], node.ports[2], node.ports[3], node.ports[1]]
                    }

                    node.extras.custom_pause = true
                    delete node.extras.player
                }
            }
        }
        if(Array.isArray(node.ports)){
            node.ports.forEach(port => port_ids.add(port.id))
        }
    })

    // get rid of links that don't have existing ports
    diagram.links = diagram.links.filter(link => {
        return port_ids.has(link.sourcePort) && port_ids.has(link.targetPort)
    })

    return diagram
}

const getSlotsForKeys = (keys, slots) => {
	let key_set = new Set()

	keys.forEach(key_arr => {
		key_arr.forEach(key => {
			key_set.add(key)
		})
	})

	key_set = [...key_set]

	return key_set.map(key => {
        const slot = find(slots, {key: key})
        let type = slot.type.value.toLowerCase() !== 'custom' ? slot.type.value : slot.name

		return {
			name: slot.name,
			type: type
		}
	})
}

export {
    convertDiagram,
    getSlotsForKeys
}