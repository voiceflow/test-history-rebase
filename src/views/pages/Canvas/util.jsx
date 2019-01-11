// Convert older deprecated blocks to newer ones
exports.convertDiagram = (diagram, diagrams) => {
    const port_ids = new Set()

    diagram.nodes.forEach(node => {
        if(node.extras){
            // If diagram/flow blocks, use the name of their flow as the name
            if (node.extras.type === 'flow' && node.extras.diagram_id) {
                let find = diagrams.find(x => x.id === node.extras.diagram_id)
                if(find){
                    node.name = find.name
                }
            }else if(node.extras.type === 'command' && (typeof node.extras.commands !== 'string')){
                if(!node.extras.resume){
                    node.extras.type = 'jump'
                    if(node.name.toLowerCase() === 'command'){
                        node.name = 'Jump'
                    }
                }else{
                    node.ports = []
                }
            }else if(node.extras.type === 'story' && node.name === 'Start Block'){
                node.name = 'Start'
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