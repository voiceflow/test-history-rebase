const Util = require('./../config/util');
const draftToMarkdown = require('./../config/drafttomarkdown');
const isVarName = require('is-var-name');
const {docClient, pool, hashids, validateEmail} = require('./../services');
const validUrl = require('valid-url');
const _ = require('lodash');

const expressionfy = (expression, depth=0) => {
    if(depth > 8){
        // return a blank
        return 0;
    }else if(expression.type == 'value'){
        let value = expression.value.toString();
        if(!expression.value){
            return 0;
        }else if(isNaN(value)){
            return "'" + value.replace(/'/g, '\"') + "'";
        }else{
            return (value * 1);
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
        TableName: 'com.getstoryflow.diagrams.production',
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
    });
}

const getDiagrams = (req, res) => {
    if (!req.user) {
        res.sendStatus(401);
        return;
    }
    let params = {
        TableName: 'com.getstoryflow.diagrams.production',
        ProjectionExpression: req.query.verbose ? 'id, title, last_save' : 'id, title'
    };

    if(!req.user.admin){
        params.FilterExpression = 'creator = :creator';
        params.ExpressionAttributeValues = {':creator': req.user.id};
    }

    let items = [];

    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            data.Items.forEach(function(item) {
               items.push(item);
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
        TableName: 'com.getstoryflow.diagrams.production',
        Key: {'id': req.params.id}
    };
    docClient.get(params, (err, data) => {
        if (err) {
            console.log(err);
            res.sendStatus(err.statusCode);
        } else if (data.Item) {
            let diagram = data.Item;

            if (diagram.preview === false) {
                res.sendStatus(403);
                return;
            }

            res.send(data.Item);
        } else {
            res.sendStatus(404);
        }
    });
};

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
    let diagram = req.body;
    diagram.skill = hashids.decode(diagram.skill)[0];

    try{
        let result = await pool.query('SELECT creator_id FROM skills WHERE skill_id = $1 LIMIT 1', [diagram.skill]);

        if(result.rows.length > 0 && result.rows[0].creator_id !== req.user.id && req.user.admin !== 10){
            return res.sendStatus(403);
        }else{
            diagram.creator = req.user.id;
        }
    }catch(err){
        console.error(err);
        return res.sendStatus(500);
    }

    diagram.last_save = Date.now();
    let params = {
        TableName: 'com.getstoryflow.diagrams.production',
        Item: {
            id: diagram.id,
            variables: diagram.variables,
            data: diagram.data,
            skill: diagram.skill,
            creator: diagram.creator
        }
    };

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

    docClient.put(params, async(err) => {
        if (err) {
            console.log(err);
            res.sendStatus(err.statusCode);
        } else {
            try{
                if(req.query.new){
                    if (diagram.title !== "ROOT" ){
                        diagram.title = "New Flow";
                    }
                    // If it is a new diagram insert (assume it has no blocks)
                    await pool.query('INSERT INTO diagrams (id, name, skill_id) VALUES ($1, $2, $3)', [diagram.id, diagram.title, diagram.skill]);
                }else{
                    // otherwise update
                    await pool.query('UPDATE diagrams SET sub_diagrams = $1, permissions = $2 WHERE id = $3', [diagram.sub_diagrams, permissions_string, diagram.id]);
                    await pool.query('UPDATE skills SET global=$1 WHERE skill_id=$2', [global_string, diagram.skill]);
                }
                res.sendStatus(200);
            }catch(e){
                console.error(e);
                console.trace();
                res.sendStatus(500);
            }
        }
    });
};

const deleteDiagram = (req, res) => {
    let params = {
        TableName: 'com.getstoryflow.diagrams.production',
        Key: {'id': req.params.id}
    };
    docClient.get(params, (err, data) => {
        if (err) {
            console.log(err);
            res.sendStatus(err.statusCode);
        } else if (data.Item) {
            if (data.Item.creator !== req.user.id && !req.user.admin) {
                res.sendStatus(403);
                return;
            }
            docClient.delete(params, err => {
                if (err) {
                    console.log(err);
                    res.sendStatus(err.statusCode);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    }); 
}

const renderDiagram = (user, diagram_id, skill_id, depth=0, rendered_set=(new Set()), type=undefined, options={}) => new Promise((resolve) => {
    let params = {
        TableName: 'com.getstoryflow.diagrams.production',
        Key: {'id': diagram_id}
    };

    if(depth > 10){
        resolve(413);
        return;
    }

    let testing = (skill_id==="TEST");

    docClient.get(params, async (err, data) => {
        if (err) {
            console.error(err);
            resolve(500);
        } else if (data.Item && (data.Item.skill === skill_id || testing)) {

            // Add to set of rendered diagrams to prevent looping
            rendered_set.add(diagram_id)
            if (data.Item.creator !== user.id && !user.admin) {
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
            };

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
                } else if (node.extras.type === 'command') {

                    if(node.extras.commands){
                        let nextLink = null;
                        for (var j = 0; j < node.ports.length; j++) {
                            if (!node.ports[j].in) {
                                [nextLink] = node.ports[j].links;
                            }
                        }

                        let nextId = getLink(nextLink)
                        let commands = node.extras.commands.split('\n').filter(i => { return !!i });

                        commands.forEach(command => {
                            story.commands.push({
                                string: command,
                                value: nextId
                            });
                        });
                    }

                } else if (node.extras.type === 'random') {
                    let list = node.ports.filter(a => !a.in && a.links.length > 0).map(port => getLink(port.links[0]))
                    story.lines[node.id] = {
                        random: node.extras.smart ? 2 : 1,
                        nextIds: list,
                        id: node.id
                    };
                } else if (node.extras.type === 'choicenew' || node.extras.type === 'choice') {
                    story.lines[node.id] = {
                        prompt: node.extras.prompt ? node.extras.prompt : true,
                        choices: node.extras.choices,
                        inputs: node.extras.inputs.map(input => input.split('\n').filter(i => { return !!i })),
                        elseId: getLink(node.ports.filter(a => a.label === 'else')[0].links[0]),
                        // Get all output ports, then assign labels to outputs, then lastly returns the next IDs. Returns a list of linked nodes
                        nextIds: node.ports.filter(a => !a.in && a.label !== 'else').sort((a, b) => a.label - b.label).map(port => {
                            let link = getLink(port.links[0]);
                            return link ? link : null;
                        })
                    };
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
                            [nextLink] = node.ports[j].links;
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
                            [nextLink] = node.ports[j].links;
                        }
                    }
                    story.lines[node.id] = {
                        audio: node.extras.audio,
                        retry: true,
                        nextId: getLink(nextLink)
                    };
                } else if (node.extras.type === 'flow' && node.extras.diagram_id) {
                    let subflow_diagram_id = node.extras.diagram_id
                    // Check if this diagram has been rendered already, rerender if this is a module
                    if(!rendered_set.has(node.extras.diagram_id) || type === 'market'){
                        let result;
                        try{
                            // console.log('going in', node.extras.diagram_id);
                            let new_options = options
                            // Reset diagram id for sub flows in modules
                            if(type === 'market'){
                                subflow_diagram_id = options.version + '_' + node.extras.diagram_id
                                new_options = JSON.parse(JSON.stringify(options))
                                new_options['is_module_subflow'] = true
                            }
                            result = await renderDiagram(user, node.extras.diagram_id, skill_id, depth+1, rendered_set, type, new_options)
                        }catch(err){
                            console.log(err)
                            resolve(500);
                            return;
                        }

                        if(result !== 200){
                            resolve(result);
                            return;
                        }
                    }

                    let nextLink = null;
                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links;
                        }
                    }

                    story.lines[node.id] = {
                        diagram_id: subflow_diagram_id,
                        variable_map: {
                            inputs: node.extras.inputs.filter(input => (input.arg1 && input.arg2)).map(input => [input.arg1, input.arg2]),
                            outputs: node.extras.outputs.filter(output => (output.arg1 && output.arg2)).map(output => [output.arg1, output.arg2]),
                        },
                        nextId: getLink(nextLink)
                    };

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

                    let markdownstring = '';
                    let nextLink = null;
                    
                    if(Array.isArray(node.extras.dialogs)){
                        node.extras.dialogs.forEach(d => {
                            if(d.audio && validUrl.isUri(d.audio)){
                                markdownstring += `<audio src="${d.audio}"/>`
                            }else if(d.rawContent){
                                temp = draftToMarkdown(d.rawContent, {alexa: true});
                                if(d.voice === 'Alexa' || !d.voice){
                                    markdownstring += temp;
                                }else{
                                    markdownstring += `<voice name="${d.voice}">${temp}</voice>`
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
                        speak: markdownstring,
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

                    let formattedRawContent = '';
                    if (!_.isNil(node.extras.rawContent)) {
                        formattedRawContent = draftToMarkdown(node.extras.rawContent);
                    }

                    if (!_.isNil(node.extras.params)) {
                        node.extras.params.forEach(param_map => {
                            param_map.val = draftToMarkdown(param_map.val);
                            param_map.key = draftToMarkdown(param_map.key);
                        });
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
                        });
                    }

                    if (!_.isNil(node.extras.body)) {
                        node.extras.body.forEach(param_map => {
                            param_map.val = draftToMarkdown(param_map.val);
                            param_map.key = draftToMarkdown(param_map.key);
                        });
                    }

                    let formattedUrl = '';
                    if (!_.isNil(node.extras.url)) {
                        formattedUrl = draftToMarkdown(node.extras.url);
                    }

                    if (!_.isNil(node.extras.mapping)) {
                        node.extras.mapping.forEach(param_map => {
                            if(typeof param_map.path !== 'string'){
                                param_map.path = draftToMarkdown(param_map.path);
                            }
                            param_map.path = param_map.path.trim();
                        });
                    }
                    
                    story.lines[node.id] = {
                        body: node.extras.body,
                        headers: headers,
                        params: node.extras.params,
                        url: formattedUrl,
                        method: node.extras.method,
                        mapping: node.extras.mapping,
                        bodyInputType: node.extras.bodyInputType,
                        rawContent: formattedRawContent,
                        success_id: getLink(node.ports.filter(a => a.in === false && a.label !== 'fail')[0].links[0]),
                        fail_id: getLink(node.ports.filter(a => a.in === false && a.label === 'fail')[0].links[0])
                    };

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
                } else {
                    let nextLink = null;
                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links;
                        }
                    }
                    if(nextLink){
                        story.lines[node.id] = {
                            nextId: getLink(nextLink)
                        }
                    }
                } 
            }
            let render_type;
            if(!type){
                render_type = testing ? 'testing' : 'live';
            }else{
                render_type = type;
            }

            let params = {
                TableName: `com.getstoryflow.skills.${render_type}`,
                Item: story
            };
            docClient.put(params, err => {
                if (err) {
                    console.log(err);
                    res.sendStatus(err.statusCode);
                } else if(testing || type === 'market') {
                    resolve(200);
                } else {
                    // Add the story to SQL as well
                    addStory(story, (err) => {
                        if(err){
                            console.error(err);
                            resolve(500)
                            return;
                        }else{
                            resolve(200);
                        }
                    })
                }
            });
        } else {
            resolve(404);
        }
    });
});

const addStory = (story, cb) => {
    pool.query('SELECT 1 FROM diagrams WHERE id = $1 LIMIT 1', [story.id], (err,res) => {
        if(err || res.rows.length < 1){
            pool.query('INSERT INTO diagrams (id, name, skill_id) VALUES ($1, $2, $3)', 
                [story.id, story.name, story.skill_id], (err,res) => {
                if(err) {
                    cb(err);
                }else{
                    cb(false);
                }
            })
        }else{
            pool.query('UPDATE diagrams SET name = $1 WHERE id = $2', 
                [story.name, story.skill_id], (err,res) => {
                if(err) {
                    cb(err);
                }else{
                    cb(false);
                }
            })
        }
    });
}

const publish = (req, res) => {
    if (!req.user || !req.params.skill_id || !req.params.diagram_id) {
        res.sendStatus(401);
        return;
    }

    let skill_id = hashids.decode(req.params.skill_id)[0];

    pool.query('SELECT creator_id FROM skills WHERE skill_id = $1 LIMIT 1', [skill_id], async (err, result) => {
        if(err || result.rows.length === 0){
            return res.sendStatus(500);
        }else if(result.rows[0].creator_id !== req.user.id){
            return res.sendStatus(401);
        }

        let status = await renderDiagram(req.user, req.params.diagram_id, skill_id);
        res.sendStatus(status);
    })
};

const publishTest = async (req, res) => {
    if (!req.user || !req.params.diagram_id) {
        res.sendStatus(401);
        return;
    }

    let status = await renderDiagram(req.user, req.params.diagram_id, 'TEST');

    res.sendStatus(status);
};

module.exports = {
    updateName: updateName,
    getVariables: getVariables,
    getDiagrams: getDiagrams,
    getDiagram: getDiagram,
    deleteDiagram: deleteDiagram,
    setDiagram: setDiagram,
    publish: publish,
    publishTest: publishTest,
    renderDiagram: renderDiagram
}
