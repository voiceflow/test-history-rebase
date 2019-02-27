// Convert older deprecated blocks to newer ones

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

            if(node.extras.type === 'command'){
                save_stuff.commands.push(node)
                diagram.nodes.splice(i, 1)
            }else if(node.extras.type === 'story'){
                if(!node.combines) node.combines = []
                save_stuff.start = node
            }
        }
        if(Array.isArray(node.ports)){
            node.ports.forEach(port => port_ids.add(port.id))
        }
    }

    save_stuff.commands.forEach(command => save_stuff.start.combines.push(command))

    // get rid of links that don't have existing ports
    diagram.links = diagram.links.filter(link => {
        return port_ids.has(link.sourcePort) && port_ids.has(link.targetPort)
    })

    return diagram
}

export {
    convertDiagram
}