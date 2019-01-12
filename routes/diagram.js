const Util = require('./../config/util');
const draftToMarkdown = require('./../config/drafttomarkdown');
const isVarName = require('is-var-name');
const {docClient, pool, hashids, validateEmail} = require('./../services');
const validUrl = require('valid-url');
const _ = require('lodash');
const { getEnvVariable } = require('../util')

const generateID = () => {
    return "xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0
        const v = c === "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

const expressionfy = (expression, depth=0) => {
    if(depth > 8){
        // return a blank
        return 0;
    }else if(expression.type == 'value'){
        let value = expression.value.toString();
        if(!expression.value){
            return 0
        }else if(isNaN(value)){
            value = value.replace(/'/g, '\\\'')
            value = value.replace(/"/g, '\\\"')
            return "'" + value + "'";
        }else{
            return (value * 1)
        }
    }else if(expression.type == 'variable'){
        if(isVarName(expression.value)){
            return `v['${expression.value}']`
        }else{
            return 0
        }
    }else{
        let string = "(";

        if(expression.type == 'not'){
            string += `!${expressionfy(expression.value)}`
        }else if(expression.type == 'and'){
            string += `${expressionfy(expression.value[0])} && ${expressionfy(expression.value[1])}`
        }else if(expression.type == 'or'){
            string += `${expressionfy(expression.value[0])} || ${expressionfy(expression.value[1])}`
        }else if(expression.type == 'plus'){
            string += `${expressionfy(expression.value[0])} + ${expressionfy(expression.value[1])}`
        }else if(expression.type == 'minus'){
            let first = expressionfy(expression.value[0]);
            // if(isNaN(first) && !(/(v\[\")\w+(\"])/.test(first))) return 0;
            let second = expressionfy(expression.value[1]);
            // if(isNaN(second) && !(/(v\[\")\w+(\"])/.test(second))) return 0;

            string += `${first} - ${second}`
        }else if(expression.type == 'times'){
            let first = expressionfy(expression.value[0]);
            // if(isNaN(first) && !(/(v\[\")\w+(\"])/.test(first))) return 0;
            let second = expressionfy(expression.value[1]);
            // if(isNaN(second) && !(/(v\[\")\w+(\"])/.test(second))) return 0;

            string += `${first} * ${second}`
        }else if(expression.type == 'divide'){
            let first = expressionfy(expression.value[0]);
            // if(isNaN(first) && !(/(v\[\")\w+(\"])/.test(first))) return 0;
            let second = expressionfy(expression.value[1]);
            // if((isNaN(second) && !(/(v\[\")\w+(\"])/.test(second))) || second == 0) return 0;

            string += `${first} / ${second}`
        }else if(expression.type == 'greater'){
            string += `${expressionfy(expression.value[0])} > ${expressionfy(expression.value[1])}`
        }else if(expression.type == 'less'){
            string += `${expressionfy(expression.value[0])} < ${expressionfy(expression.value[1])}`
        }else if(expression.type == 'equals'){
            string += `${expressionfy(expression.value[0])} == ${expressionfy(expression.value[1])}`
        }

        return (string + ")");
    }
}

const getVariables = (req, res) => {
    let params = {
        TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
        Key: {'id': req.params.id},
        ProjectionExpression: 'variables'
    }

    docClient.get(params, (err, data) => {
        if (err) {
            console.error(err);
            res.sendStatus(err.statusCode);
        } else if (data.Item) {
            res.send(data.Item.variables);
        } else {
            res.sendStatus(404);
        }
    })
}

const getDiagrams = (req, res) => {
    if (!req.user) {
        res.sendStatus(401);
        return;
    }
    let params = {
        TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
        ProjectionExpression: req.query.verbose ? 'id, title, last_save' : 'id, title'
    }

    if(req.user.admin < 100){
        params.FilterExpression = 'creator = :creator'
        params.ExpressionAttributeValues = {':creator': req.user.id}
    }

    let items = []

    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            data.Items.forEach(function(item) {
               items.push(item)
            });

            // continue scanning if we have more items
            if (typeof data.LastEvaluatedKey != "undefined") {
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            }else{
                items.sort((a, b) => {
                    let keyA = a.title,
                        keyB = b.title;
                    // Compare the 2 dates
                    if(keyA < keyB) return -1;
                    if(keyA > keyB) return 1;
                    return 0;
                });
                res.send(items);
            }
        }
    }
};

const getDiagram = (req, res) => {
    if (!req.user) {
        res.sendStatus(401);

        return;
    }

    let params = {
        TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
        Key: {'id': req.params.id}
    };
    docClient.get(params, (err, data) => {
        if (err) {
            console.log(err)
            res.sendStatus(err.statusCode);
        } else if (data.Item) {
            let diagram = data.Item

            if (diagram.preview === false) {
                res.sendStatus(403)
                return;
            }

            res.send(data.Item)
        } else {
            res.sendStatus(404)
        }
    })
}

const updateName = async (req, res) => {
    if(!req.body || !req.body.name){
        res.sendStatus(401);
        return;
    }

    pool.query('UPDATE diagrams SET name = $1 WHERE id = $2', 
        [req.body.name, req.params.id], (err) => {
        if(err){
            res.sendStatus(500);
        }else{
            res.sendStatus(200);
        }
    });
}

const setDiagram = async (req, res) => {
    let diagram = req.body
    diagram.skill = hashids.decode(diagram.skill)[0]

    // TODO: find underlying issue
    // check to make sure not to to overwrite projects with empty
    let data
    try{
        data = JSON.parse(diagram.data)
    }catch(err){
        return res.status(500).send('Invalid Project Format')
    }
    if(!data || !data.nodes || data.nodes.length === 0){
        return res.status(500).send('Empty Project')
    }

    try{
        let result = await pool.query('SELECT creator_id FROM skills WHERE skill_id = $1 LIMIT 1', [diagram.skill])

        if(result.rows.length > 0 && result.rows[0].creator_id !== req.user.id && req.user.admin < 100){
            return res.sendStatus(403)
        }else{
            diagram.creator = req.user.id
        }
    }catch(err){
        console.error(err);
        return res.sendStatus(500)
    }

    diagram.last_save = Date.now();
    let params = {
        TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
        Item: {
            id: diagram.id,
            variables: diagram.variables,
            data: diagram.data,
            skill: diagram.skill,
            creator: diagram.creator
        }
    }

    let permissions_string, global_string
    // Make sure that the JSON validly parses
    try {
        permissions_string = diagram.permissions ? JSON.stringify(diagram.permissions) : '[]'
    } catch(err) {
        permissions_string = '[]'
    }
    try {
        global_string = diagram.global ? JSON.stringify(diagram.global) : '[]'
    } catch(err) {
        global_string = '[]'
    }

    try {
        used_intents_string = diagram.used_intents ? JSON.stringify(diagram.used_intents) : '[]'
    } catch(err) {
        used_intents_string = '[]'
    }

    docClient.put(params, async(err) => {
        if (err) {
            console.log(err);
            res.sendStatus(err.statusCode);
        } else {
            try{
                if(req.query.new){
                    if (!diagram.title){
                        diagram.title = "New Flow";
                    }
                    // If it is a new diagram insert (assume it has no blocks)
                    await pool.query('INSERT INTO diagrams (id, name, skill_id) VALUES ($1, $2, $3)', [diagram.id, diagram.title, diagram.skill]);
                }else{
                    // otherwise update
                    await pool.query('UPDATE diagrams SET sub_diagrams = $1, permissions = $2, used_intents = $3 WHERE id = $4', [diagram.sub_diagrams, permissions_string, used_intents_string, diagram.id]);
                    await pool.query('UPDATE skills SET global=$1 WHERE skill_id=$2', [global_string, diagram.skill]);
                }
                res.sendStatus(200);
            }catch(e){
                console.error(e);
                console.trace();
                res.sendStatus(500);
            }
        }
    })
};

const deleteDiagram = (req, res) => {

    pool.query(`
            DELETE FROM diagrams d USING skills s
            WHERE d.skill_id = s.skill_id AND d.id = $1 AND s.creator_id = $2 AND s.diagram != d.id
        `,
        [req.params.id, req.user.id], (err, response) => {
            if(err){
                console.log(err)
                return res.sendStatus(500)
            }
            if(response.rowCount !== 0){
                let params = {
                    TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
                    Key: {'id': req.params.id}
                }

                docClient.delete(params, err => {
                    if (err) {
                        console.log(err);
                        res.sendStatus(err.statusCode);
                    } else {
                        res.sendStatus(200);
                    }
                })
            }
        }
    )
}

const copyDiagram = (req, res) => {
    let old_diagram_id = req.params.diagram_id
    let params = {
        TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
        Key: {'id': old_diagram_id}
    };

    // In case the insert row fails, delete on Dynamo
    const cleanUpDynamo = (new_diagram_id) => {
        let params = {
            TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
            Key: {'id': new_diagram_id}
        };
        docClient.delete(params, err => {
            if (err) {
                console.log(err)
                res.sendStatus(err.statusCode)
            } else {
                res.sendStatus(200)
            }
        });
    }

    const insertDiagramRow = (new_diagram_id, old_diagram_id, diagram_name) => {
        pool.query(
            `INSERT INTO diagrams (id, name, skill_id, permissions, used_intents) 
            (SELECT $1, $2, skill_id, permissions, used_intents FROM diagrams WHERE id = $3)`,
            [new_diagram_id, diagram_name, old_diagram_id],
            (err, data) => {
                if(err) {
                    console.log(err)
                    cleanUpDynamo(new_diagram_id)
                    res.sendStatus(500)
                } else {
                    res.send(new_diagram_id)
                }
            }    
        )
    }

    // TODO: There might be no need to modify the flow blocks, i dunno
    const purgeSubflows = (diagram) => {
        diagram.nodes.forEach(node => {
            if (node.extras.diagram_id && node.extras.diagram_id !== null) {
                node.extras.diagram_id = null;
                if(node.extras.type === 'flow'){
                    node.name = 'Flow'
                }
            }
        })
        return diagram
    }

    // Copy on Dynamo
    docClient.get(params, (err, data) => {
        if (err) {
            console.log(err);
            res.sendStatus(err.statusCode);
        } else if (data.Item) {
            let purged_diagram = purgeSubflows(JSON.parse(data.Item.data))
            let new_diagram_id = generateID()
            let diagram_name = 'Diagram Copy'
            if(req.query && req.query.name && req.query.name.length < 80){
                diagram_name = req.query.name
            }
            
            let params = {
                TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
                Item: {
                    id: new_diagram_id,
                    variables: data.variables,
                    data: JSON.stringify(purged_diagram),
                    skill: data.skill,
                    creator: data.creator
                }
            };

            docClient.put(params, async(err) => {
                if (err) {
                    console.log(err)
                    res.sendStatus(err.statusCode)
                } else {
                    insertDiagramRow(new_diagram_id, old_diagram_id, diagram_name)
                }
            });
        } else {
            res.sendStatus(404)
        }
    });
}

const renderDiagram = (user, diagram_id, skill_id, depth=0, rendered_set=(new Set()), type=undefined, options={}, used_intents, used_choices, intents, slots) => new Promise((resolve) => {
    let params = {
        TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
        Key: {'id': diagram_id}
    };

    if(depth > 10){
        resolve(413)
        return
    }

    let testing = (skill_id==="TEST");

    docClient.get(params, async (err, data) => {
        if (err) {
            console.error(err)
            resolve(500)
        } else if (data.Item && (data.Item.skill === skill_id || testing)) {

            // Add to set of rendered diagrams to prevent looping
            rendered_set.add(diagram_id)
            if (data.Item.creator !== user.id && user.admin < 100) {
                resolve(403);
                return;
            }

            let diagram = JSON.parse(data.Item.data);

            let links = {};

            for (var i = 0; i < diagram.links.length; i++) {
                links[diagram.links[i].id] = {
                    target: diagram.links[i].target,
                    source: diagram.links[i].source
                }
            }

            // If publishing to market, insert version before. If subflow, don't prepend $ so story.js doesn't confuse itself for global scope
            let key = diagram_id
            if(type === 'market' && !options.is_module_subflow){
                key = "$" + options.version + '_' + key;
            } else if(options.is_module_subflow){
                key = options.version + '_' + key;
            }

            let story = {
                id: key,
                skill_id: skill_id,
                name: data.Item.title,
                lines: {},
                variables: data.Item.variables,
                commands: []
            }

            // Iterate through every block in the diagram
            for (var i = 0; i < diagram.nodes.length; i++) {
                
                let node = diagram.nodes[i];
                let getLink = (link_id) => {
                    if(link_id in links){
                        return links[link_id].target === node.id ? links[link_id].source : links[link_id].target
                    }
                }

                if (node.extras.type === 'story') {
                    story.startId = node.id;
                    story.prompt = node.extras.prompt;
                    let nextLink = null;
                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links;
                        }
                    }
                    story.lines[node.id] = {
                        nextId: getLink(nextLink)
                    };
                } else if(node.extras.type === 'exit'){
                    story.lines[node.id] = {
                        end: true
                    }
                } else if (node.extras.type === 'command' || node.extras.type === 'jump') {

                    let nextLink = null;
                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links;
                        }
                    }

                    let nextId = getLink(nextLink)
                    if(node.extras.intent){
                        let intent = node.extras.intent
                        // Log that this intent has been used
                        if (used_intents) {
                            used_intents.add(intent.key)
                        }

                        let mappings = []
                        if(Array.isArray(node.extras.mappings)){
                            node.extras.mappings.forEach(mapping => {
                                if(!mapping.slot){
                                    return
                                }
                                if(intent.built_in){
                                    mappings.push({
                                        variable: mapping.variable,
                                        slot: mapping.slot.label
                                    })
                                }else if(mapping.slot.key in slots){
                                    mappings.push({
                                        variable: mapping.variable,
                                        slot: slots[mapping.slot.key]
                                    })
                                }
                            })
                        }
                        
                        if(intent.built_in){
                            intent = intent.label
                        }else if(intent.key in intents){
                            intent = intents[intent.key]
                        }
                        if(intent){
                            if(node.extras.resume){
                                if(node.extras.diagram_id){
                                    let result
                                    try{
                                        result = await renderDiagram(user, node.extras.diagram_id, skill_id, depth+1, rendered_set, type, options, used_intents, used_choices, intents, slots)
                                    }catch(err){
                                        result = 500
                                    }
                                    if(result < 300){
                                        story.commands.push({
                                            intent: intent,
                                            mappings: node.extras.mappings,
                                            diagram_id: node.extras.diagram_id,
                                            end: !!node.extras.end
                                        })
                                    }
                                }
                            }else if(nextId){
                                story.commands.push({
                                    intent: intent,
                                    mappings: node.extras.mappings,
                                    next: nextId
                                })
                            }
                        }
                    }else if(node.extras.commands){
                        // DEPRECATE OLD COMMANDS
                        let commands = node.extras.commands.split('\n').filter(i => { return !!i })

                        commands.forEach(command => {
                            story.commands.push({
                                string: command,
                                value: nextId
                            })
                        })
                    }
                } else if (node.extras.type === 'random') {
                    let list = node.ports.filter(a => !a.in && a.links.length > 0).map(port => getLink(port.links[0]))
                    story.lines[node.id] = {
                        random: node.extras.smart ? 2 : 1,
                        nextIds: list,
                        id: node.id
                    };
                } else if (node.extras.type === 'choicenew' || node.extras.type === 'choice') {

                    const inputs = node.extras.inputs.map(input => input.split('\n').filter(i => { return !!i }))

                    story.lines[node.id] = {
                        prompt: node.extras.prompt ? node.extras.prompt : true,
                        choices: node.extras.choices,
                        inputs: inputs,
                        elseId: getLink(node.ports.filter(a => a.label === 'else')[0].links[0]),
                        // Get all output ports, then assign labels to outputs, then lastly returns the next IDs. Returns a list of linked nodes
                        nextIds: node.ports.filter(a => !a.in && a.label !== 'else').sort((a, b) => a.label - b.label).map(port => {
                            let link = getLink(port.links[0]);
                            return link ? link : null;
                        })
                    };

                    if (inputs && used_choices) {
                        node.extras.inputs.forEach(input => {
                            if(input.trim() !== ''){
                                input.split('\n').forEach(c => {
                                    used_choices.add(c.toLowerCase())
                                })
                            }
                        })
                    }

                } else if (node.extras.type === 'intent') {
                    
                    let interactions = []
                    node.extras.choices.forEach(choice => {
                        let new_choice = {mappings: []}
                        if(choice.intent){

                            // Log that this intent has been used
                            if (used_intents) {
                                used_intents.add(choice.intent.key)
                            }

                            if(choice.intent.built_in){
                                new_choice.intent = choice.intent.label
                            }else if(choice.intent.key in intents){
                                new_choice.intent = intents[choice.intent.key]
                            }
                            choice.mappings.forEach(mapping => {
                                if(choice.intent.built_in){
                                    new_choice.mappings.push({
                                        variable: mapping.variable,
                                        slot: mapping.slot.label
                                    })
                                }else if(mapping.slot.key in slots){
                                    new_choice.mappings.push({
                                        variable: mapping.variable,
                                        slot: slots[mapping.slot.key]
                                    })
                                }
                            })
                        }
                        interactions.push(new_choice)
                    })

                    story.lines[node.id] = {
                        interactions: interactions,
                        elseId: getLink(node.ports.filter(a => a.label === 'else')[0].links[0]),
                        prompt: true,
                        // Get all output ports, then assign labels to outputs, then lastly returns the next IDs. Returns a list of linked nodes
                        nextIds: node.ports.filter(a => !a.in && a.label !== 'else').sort((a, b) => a.label - b.label).map(port => {
                            let link = getLink(port.links[0]);
                            return link ? link : null;
                        })
                    }
                } else if (node.extras.type === 'stream') {
                    let stop = getLink(node.ports.filter(a => a.label === 'stop/pause')[0].links[0]);

                    if(node.extras.player){
                        story.lines[node.id] = {
                            loop: node.extras.loop,
                            play: node.extras.audio,
                            nextId: stop,
                            PAUSE_ID: node.id,
                            NEXT: getLink(node.ports.filter(a => a.label === 'next')[0].links[0]),
                            PREVIOUS: getLink(node.ports.filter(a => a.label === 'previous')[0].links[0]),
                            // SHUFFLE: links[node.ports.filter(a => a.label === 'shuffle')[0].links[0]]
                        };
                    }else{
                        story.lines[node.id] = {
                            loop: node.extras.loop,
                            play: node.extras.audio,
                            nextId: stop
                        };
                    }
                } else if (node.extras.type === 'multiline' || node.extras.type === 'line' || node.extras.type === 'audio' || node.extras.type === 'combine') {
                    let nextLink;
                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links;
                        }
                    }

                    let audio;
                    if(node.extras.audio && validUrl.isUri(node.extras.audio)){
                        audio = node.extras.audio;
                    }else if(node.extras.lines[0].audio && validUrl.isUri(node.extras.lines[0].audio)){
                        audio = node.extras.lines[0].audio;
                    }

                    story.lines[node.id] = {
                        audio: audio,
                        nextId: getLink(nextLink)
                    };

                } else if (node.extras.type === 'listen') {
                    let nextLink = null;
                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links
                        }
                    }
                    story.lines[node.id] = {
                        audio: node.extras.audio,
                        prompt: node.extras.prompt,
                        nextId: getLink(nextLink)
                    };
                } else if (node.extras.type === 'retry') {
                    let nextLink = null;
                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links
                        }
                    }
                    story.lines[node.id] = {
                        audio: node.extras.audio,
                        retry: true,
                        nextId: getLink(nextLink)
                    };
                } else if (node.extras.type === 'flow' && node.extras.diagram_id) {

                    let subflow_diagram_id = node.extras.diagram_id
                    
                    let nextLink = null;
                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links
                        }
                    }

                    story.lines[node.id] = {
                        nextId: getLink(nextLink)
                    }

                    const linkDiagram = () => {
                        story.lines[node.id].diagram_id = node.extras.diagram_id,
                        story.lines[node.id].variable_map = {
                            inputs: node.extras.inputs.filter(input => (input.arg1 && input.arg2)).map(input => [input.arg1, input.arg2]),
                            outputs: node.extras.outputs.filter(output => (output.arg1 && output.arg2)).map(output => [output.arg1, output.arg2]),
                        }
                    }

                    // Check if this diagram has been rendered already
                    if(!rendered_set.has(node.extras.diagram_id)){
                        let result
                        try{
                            // console.log('going in', node.extras.diagram_id);
                            // let new_options = options
                            // Reset diagram id for sub flows in modules
                            // if(type === 'market'){
                            //     subflow_diagram_id = options.version + '_' + node.extras.diagram_id
                            //     new_options = JSON.parse(JSON.stringify(options))
                            //     new_options['is_module_subflow'] = true
                            // }
                            result = await renderDiagram(user, node.extras.diagram_id, skill_id, depth+1, rendered_set, type, options, used_intents, used_choices, intents, slots);
                        }catch(err){
                            return resolve(500)
                        }

                        if(result < 300){
                            linkDiagram()
                        }
                    }else{
                        linkDiagram()
                    }
                } else if (node.extras.type === 'ending') {
                    story.lines[node.id] = {
                        audio: node.extras.audio
                    };
                } else if (node.extras.type === 'set' || node.extras.type === 'variable') {
                    let nextLink = null;
                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links;
                        }
                    }

                    if(node.extras.sets){
                        story.lines[node.id] = {
                            sets: node.extras.sets.map(block => {
                                return {
                                    variable: block.variable,
                                    expression: expressionfy(block.expression)
                                }
                            }),
                            nextId: getLink(nextLink)
                        };
                    }else{
                        story.lines[node.id] = {
                            variable: node.extras.variable,
                            expression: expressionfy(node.extras.expression),
                            nextId: getLink(nextLink)
                        };
                    }
                } else if (node.extras.type === 'if') {
                    if(node.extras.expressions){
                        story.lines[node.id] = {
                            expressions: node.extras.expressions.map(expression => {
                                let rendered = expressionfy(expression);
                                return rendered ? rendered : false
                            }),
                            elseId: getLink(node.ports.filter(a => a.label === 'else')[0].links[0]),
                            nextIds: node.ports.filter(a => !a.in && a.label !== 'else').sort((a, b) => a.label - b.label).map(port => {
                                let link = getLink(port.links[0]);
                                return link ? link : null;
                            })
                        };
                    }else{
                        story.lines[node.id] = {
                            expression: expressionfy(node.extras.expression),
                            trueId: getLink(node.ports.filter(a => a.label === 'true')[0].links[0]),
                            falseId: getLink(node.ports.filter(a => a.label === 'false')[0].links[0])
                        };
                    }
                } else if (node.extras.type === 'speak') {

                    let markdownstring = ''
                    let random_speak = []
                    let nextLink = null

                    const add = (line) => {
                        if(node.extras.randomize){
                            random_speak.push(line)
                        }else{
                            markdownstring += line
                        }
                    }
                    
                    if(Array.isArray(node.extras.dialogs)){
                        node.extras.dialogs.forEach(d => {
                            if(d.audio){
                                add(`<audio src="${d.audio}"/>`)
                            }else if(d.rawContent){
                                temp = draftToMarkdown(d.rawContent, {alexa: true});
                                if(d.voice === 'Alexa' || !d.voice){
                                    add(temp)
                                }else{
                                    add(`<voice name="${d.voice}">${temp}</voice>`)
                                }
                            }
                        });
                    }else{
                        // DEPRECATE OLD SPEAK 
                        let raw;
                        if(node.extras.rawContent){
                            raw = node.extras.rawContent;
                        }else{
                            raw = node.extras.raw;
                        }
                        if(raw){
                            markdownstring = draftToMarkdown(raw, {alexa: true});
                        }
                    }

                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links;
                        }
                    }

                    story.lines[node.id] = {
                        nextId: getLink(nextLink)
                    }

                    if(node.extras.randomize && random_speak.length !== 0){
                        story.lines[node.id].random_speak = random_speak
                    }else if(markdownstring){
                        story.lines[node.id].speak = markdownstring
                    }

                } else if (node.extras.type === 'card' && node.extras.cardtype && node.extras.title) {
                    let nextLink = null;
                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links;
                        }
                    }

                    let card = {
                        type: node.extras.cardtype,
                        title: draftToMarkdown(node.extras.title, {alexa: false})
                    }
                    
                    if(card.type === 'Standard'){
                        card.text = draftToMarkdown(node.extras.content, {alexa: false, newline: true})
                        if(node.extras.large_img){
                            card.image = {}
                            card.image.largeImageUrl = node.extras.large_img

                            if(node.extras.small_img){
                                card.image.smallImageUrl = node.extras.small_img
                            }
                        }
                    }else if(card.type === 'Simple'){
                        card.content = draftToMarkdown(node.extras.content, {alexa: false, newline: true})
                    }else{
                        card = undefined
                    }

                    story.lines[node.id] = {
                        card: card,
                        nextId: getLink(nextLink)
                    }

                } else if (node.extras.type === 'capture') {

                    let nextLink = null;
                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links;
                        }
                    }

                    story.lines[node.id] = {
                        variable: node.extras.variable,
                        prompt: true,
                        nextId: getLink(nextLink)
                    }
                } else if (node.extras.type === 'api') {

                    if (!_.isNil(node.extras.params)) {
                        node.extras.params.forEach(param_map => {
                            param_map.val = draftToMarkdown(param_map.val)
                            param_map.key = draftToMarkdown(param_map.key)
                        })
                    }

                    let headers = []
                    if (!_.isNil(node.extras.headers)) {
                        node.extras.headers.forEach(param_map => {
                            if(param_map.val && param_map.key){
                                headers.push({
                                    val: draftToMarkdown(param_map.val),
                                    key: draftToMarkdown(param_map.key)
                                })
                            }
                        })
                    }

                    let formattedBody
                    if(node.extras.bodyInputType = 'rawInput'){
                        if (node.extras.content){
                            formattedBody = node.extras.content
                        }else if(!_.isNil(node.extras.rawContent)){
                            formattedBody = draftToMarkdown(node.extras.rawContent)
                        }
                    }else if (!_.isNil(node.extras.body)) {
                        formattedBody = []
                        node.extras.body.forEach(param_map => {
                            formattedBody.push({
                                val: draftToMarkdown(param_map.val),
                                key: draftToMarkdown(param_map.key)
                            })
                        })
                    }

                    let formattedUrl = '';
                    if (!_.isNil(node.extras.url)) {
                        formattedUrl = draftToMarkdown(node.extras.url)
                    }

                    if (!_.isNil(node.extras.mapping)) {
                        node.extras.mapping.forEach(param_map => {
                            if(typeof param_map.path !== 'string'){
                                param_map.path = draftToMarkdown(param_map.path)
                            }
                            param_map.path = param_map.path.trim()
                        })
                    }
                    
                    story.lines[node.id] = {
                        body: formattedBody,
                        headers: headers,
                        params: node.extras.params,
                        url: formattedUrl,
                        method: node.extras.method,
                        mapping: node.extras.mapping,
                        success_id: getLink(node.ports.filter(a => a.in === false && a.label !== 'fail')[0].links[0]),
                        fail_id: getLink(node.ports.filter(a => a.in === false && a.label === 'fail')[0].links[0])
                    }

                } else if (node.extras.type === 'mail') {

                    let id = hashids.decode(node.extras.template_id);
                    if(id && id[0] && (node.extras.to === '_USER' || validateEmail(node.extras.to))){
                        let mapping;
                        if(Array.isArray(node.extras.mapping)){
                            mapping = node.extras.mapping.filter(m => {
                                return m.val && m.key
                            });
                        }else{
                            mapping = [];
                        }

                        story.lines[node.id] = {
                            template_id: id[0],
                            to: node.extras.to,
                            mapping: mapping,
                            success_id: getLink(node.ports.filter(a => a.in === false && a.label !== 'fail')[0].links[0]),
                            fail_id: getLink(node.ports.filter(a => a.in === false && a.label === 'fail')[0].links[0])
                        }
                    }else{
                        story.lines[node.id] = {
                            nextId: getLink(node.ports.filter(a => a.in === false && a.label === 'fail')[0].links[0])
                        }
                    }
                } else if (node.extras.type === 'display') {
                    let id = hashids.decode(node.extras.display_id)

                    story.lines[node.id] = {
                        display_id: id[0],
                        datasource: node.extras.datasource,
                        update_on_change: node.extras.update_on_change,
                        nextId: getLink(node.ports.filter(a => a.in === false)[0].links[0])
                    }
                } else if (node.extras.type === 'permissions') {

                    const permissions = node.extras.permissions ? node.extras.permissions : [];
                    story.lines[node.id] = {
                        permissions: permissions,
                        success_id: getLink(node.ports.filter(a => a.in === false && a.label !== 'fail' && a.label !== 'declined')[0].links[0]),
                        fail_id: getLink(node.ports.filter(a => a.in === false && a.label === 'fail')[0].links[0]),
                        declined_id: getLink(node.ports.filter(a => a.in === false && a.label === 'declined')[0].links[0]),
                        nextId: getLink(node.ports.filter(a => a.in === false && a.label !== 'fail' && a.label !== 'declined')[0].links[0])
                    }
                } else if (node.extras.type === 'module'){

                    let nextLink = null;
                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links;
                        }
                    }
                    
                    story.lines[node.id] = {
                        diagram_id: node.extras.diagram_id,
                        variable_map: {
                            inputs: node.extras.mapping.inputs.filter(input => (input.key && input.val)).map(input => [input.val, input.key]),
                            outputs: node.extras.mapping.outputs.filter(output => (output.key && output.val)).map(output => [output.val, output.key]),
                        },
                        nextId: getLink(nextLink)
                    };
                } else if (node.extras.type === 'payment') {
                    story.lines[node.id] = {
                        product_id: node.extras.product_id,
                        success_id: getLink(node.ports.filter(a => a.in === false && a.label !== 'fail')[0].links[0]),
                        fail_id: getLink(node.ports.filter(a => a.in === false && a.label === 'fail')[0].links[0])
                    };
                } else if (node.extras.type === 'cancel_payment') {
                    story.lines[node.id] = {
                        cancel_product_id: node.extras.product_id,
                        success_id: getLink(node.ports.filter(a => a.in === false && a.label !== 'fail')[0].links[0]),
                        fail_id: getLink(node.ports.filter(a => a.in === false && a.label === 'fail')[0].links[0])
                    };
                } else {
                    let nextLink = null
                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links
                        }
                    }
                    if(nextLink){
                        story.lines[node.id] = {
                            nextId: getLink(nextLink)
                        }
                    }
                } 
            }
            let render_type
            if(!type){
                render_type = testing ? 'testing' : 'live'
            }else{
                render_type = type
            }

            let params = {
                TableName: `${getEnvVariable('SKILLS_DYNAMO_TABLE_BASE_NAME')}.${render_type}`,
                Item: story
            }
            docClient.put(params, err => {
                if (err) {
                    console.log(err)
                    res.sendStatus(err.statusCode)
                } else if(testing || type === 'market') {
                    resolve(200)
                } else {
                    // Add the story to SQL as well
                    addStory(story, (err) => {
                        if(err){
                            console.error(err)
                            resolve(500)
                            return
                        }else{
                            resolve(200)
                        }
                    })
                }
            })
        } else {
            resolve(404)
        }
    })
})

const addStory = (story, cb) => {
    pool.query('SELECT 1 FROM diagrams WHERE id = $1 LIMIT 1', [story.id], (err,res) => {
        if(err || res.rows.length < 1){
            pool.query('INSERT INTO diagrams (id, name, skill_id) VALUES ($1, $2, $3)', 
                [story.id, story.name, story.skill_id], (err,res) => {
                if(err) {
                    cb(err)
                }else{
                    cb(false)
                }
            })
        }else{
            pool.query('UPDATE diagrams SET name = $1 WHERE id = $2', 
                [story.name, story.skill_id], (err,res) => {
                if(err) {
                    cb(err)
                }else{
                    cb(false)
                }
            })
        }
    })
}

const publish = (req, res) => {
    if (!req.user || !req.params.skill_id || !req.params.diagram_id) {
        return res.sendStatus(401)
    }

    let skill_id = hashids.decode(req.params.skill_id)[0]

    pool.query('SELECT creator_id, slots, intents FROM skills WHERE skill_id = $1 LIMIT 1', [skill_id], async (err, result) => {
        if(err || result.rows.length === 0){
            return res.sendStatus(500)
        }else if(result.rows[0].creator_id !== req.user.id){
            return res.sendStatus(401)
        }
        let intents = {}
        let slots = {}
        if(Array.isArray(result.rows[0].intents)){
            result.rows[0].intents.forEach(intent => {
                if(intent.key){
                    intents[intent.key] = intent.name
                }
            })
        }
        if(Array.isArray(result.rows[0].slots)){
            result.rows[0].slots.forEach(slot => {
                if(slot.key){
                    slots[slot.key] = slot.name
                }
            })
        }

        let used_intents = new Set()
        let used_choices = new Set()
        let status = await renderDiagram(req.user, req.params.diagram_id, skill_id, undefined, undefined, undefined, undefined, used_intents, used_choices, intents, slots)

        used_intents = [...used_intents]
        used_choices = [...used_choices]

        pool.query('UPDATE skills set used_intents = $2, used_choices = $3 WHERE skill_id = $1', [skill_id, JSON.stringify(used_intents), JSON.stringify(used_choices)], async (err) => {
            if(err){
                return res.sendStatus(500)
            }
            res.sendStatus(status)
        })
    })
}

const publishTest = async (req, res) => {
    if (!req.user || !req.params.diagram_id) {
        res.sendStatus(401)
        return;
    }

    let intents = {}
    let slots = {}
    if(Array.isArray(req.body.intents)){
        req.body.intents.forEach(intent => {
            if(intent.key && intent.inputs && intent.inputs.length !== 0){
                intents[intent.key] = intent.name
            }
        })
    }
    if(Array.isArray(req.body.slots)){
        req.body.slots.forEach(slot => {
            if(slot.key){
                slots[slot.key] = slot.name
            }
        })
    }

    let used_intents = new Set()
    let used_choices = new Set()
    let status = await renderDiagram(req.user, req.params.diagram_id, 'TEST', undefined, undefined, undefined, undefined, used_intents, used_choices, intents, slots)

    res.sendStatus(status)
}

module.exports = {
    updateName: updateName,
    getVariables: getVariables,
    getDiagrams: getDiagrams,
    getDiagram: getDiagram,
    deleteDiagram: deleteDiagram,
    setDiagram: setDiagram,
    publish: publish,
    publishTest: publishTest,
    renderDiagram: renderDiagram,
    copyDiagram: copyDiagram
}
