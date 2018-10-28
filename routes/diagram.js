const Util = require('./../config/util');
const draftToMarkdown = require('./../config/drafttomarkdown');
const isVarName = require('is-var-name');
const {docClient, pool, hashids} = require('./../services');

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
            return parseInt(value, 10);
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

const setDiagram = async (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }

    let diagram = req.body;
    diagram.skill = hashids.decode(diagram.skill)[0];

    try{
        let result = await pool.query('SELECT creator_id FROM skills WHERE skill_id = $1 LIMIT 1', [diagram.skill]);
        if(result.rows.length > 0 && result.rows[0].creator_id !== req.user.id){
            res.sendStatus(403);
            return;
        }else{
            diagram.creator = req.user.id;
        }
    }catch(err){
        console.error(err);
        res.sendStatus(500);
        return;
    }

    if (diagram.title.trim() === "" || !diagram.title.trim()){
        diagram.title = "New Flow";
    }

    diagram.last_save = Date.now();

    let params = {
        TableName: 'com.getstoryflow.diagrams.production',
        Item: diagram
    };
    docClient.put(params, async(err) => {
        if (err) {
            console.log(err);
            res.sendStatus(err.statusCode);
        } else {
            try{
                // check if diagram exists
                let diagram_sql = await pool.query('SELECT name FROM diagrams WHERE id = $1 LIMIT 1', [diagram.id]);

                // if it doesn't insert row
                if(diagram_sql.rows.length === 0){
                    await pool.query('INSERT INTO diagrams (id, name, skill_id) VALUES ($1, $2, $3)', 
                        [diagram.id, diagram.title, diagram.skill]);
                // if the name changed, update it
                }else if(diagram_sql.rows[0].name !== diagram.title){
                    await pool.query('UPDATE diagrams SET name = $1 WHERE id = $1', [diagram.id]);
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

const renderDiagram = async (user, diagram_id, skill_id) => new Promise((resolve) => {

    let params = {
        TableName: 'com.getstoryflow.diagrams.production',
        Key: {'id': diagram_id}
    };

    let testing = (skill_id==="TEST");

    docClient.get(params, (err, data) => {
        if (err) {
            console.error(err);
            resolve(500);
        } else if (data.Item && (data.Item.skill === skill_id || testing)) {

            if (data.Item.creator !== user.id && !user.admin) {
                resolve(403);
                return;
            }

            let diagram = JSON.parse(data.Item.data);

            let links = {};

            for (var i = 0; i < diagram.links.length; i++) {
                links[diagram.links[i].id] = diagram.links[i].target;
            }

            let story = {
                id: diagram_id,
                skill_id: skill_id,
                name: data.Item.title,
                lines: {},
                commands: []
            };

            for (var i = 0; i < diagram.nodes.length; i++) {
                let node = diagram.nodes[i];
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
                        nextId: links[nextLink]
                    };
                } else if (node.extras.type === 'command') {

                    if(node.extras.commands){
                        let nextLink = null;
                        for (var j = 0; j < node.ports.length; j++) {
                            if (!node.ports[j].in) {
                                [nextLink] = node.ports[j].links;
                            }
                        }

                        let nextId = links[nextLink];
                        let commands = node.extras.commands.split('\n').filter(i => { return !!i });

                        commands.forEach(command => {
                            story.commands.push({
                                string: command,
                                value: nextId
                            });
                        });
                    }

                } else if (node.extras.type === 'random') {
                    let list = node.ports.filter(a => !a.in && a.links.length > 0).map(port => links[port.links[0]]);
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
                        elseId: links[node.ports.filter(a => a.label === 'else')[0].links[0]],
                        // Get all output ports, then assign labels to outputs, then lastly returns the next IDs. Returns a list of linked nodes
                        nextIds: node.ports.filter(a => !a.in && a.label !== 'else').sort((a, b) => a.label - b.label).map(port => links[port.links[0]])
                    };
                } else if (node.extras.type === 'multiline' || node.extras.type === 'line' || node.extras.type === 'audio') {
                    let nextLink;
                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links;
                        }
                    }

                    let audio;
                    if(node.extras.audio){
                        audio = node.extras.audio;
                    }else if(node.extras.lines[0].audio){
                        audio = node.extras.lines[0].audio;
                    }

                    story.lines[node.id] = {
                        audio: audio,
                        nextId: links[nextLink]
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
                        nextId: links[nextLink]
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
                        nextId: links[nextLink]
                    };
                } else if (node.extras.type === 'flow' && node.extras.diagram_id) {
                    
                    let nextLink = null;

                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links;
                        }
                    }

                    story.lines[node.id] = {
                        diagram_id: node.extras.diagram_id,
                        variable_map: {
                            inputs: node.extras.inputs.filter(input => (input.arg1 && input.arg2)).map(input => [input.arg1, input.arg2]),
                            outputs: node.extras.outputs.filter(output => (output.arg1 && output.arg2)).map(output => [input.arg1, input.arg2]),
                        },
                        nextId: links[nextLink]
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
                    story.lines[node.id] = {
                        variable: node.extras.variable,
                        expression: expressionfy(node.extras.expression),
                        nextId: links[nextLink]
                    };
                } else if (node.extras.type === 'if') {
                    story.lines[node.id] = {
                        expression: expressionfy(node.extras.expression),
                        trueId: links[node.ports.filter(a => a.label === 'true')[0].links[0]],
                        falseId: links[node.ports.filter(a => a.label === 'false')[0].links[0]]
                    };
                } else if (node.extras.type === 'speak') {

                    let markdownstring = '';
                    let nextLink = null;
                    
                    if(node.extras.raw){
                        markdownstring = draftToMarkdown(node.extras.raw, {
                            entityItems: {
                                VARIABLE: {
                                    open: entity => {
                                        return "' + v['"
                                    },
                                    close: entity => {
                                        return "'] + '"
                                    }
                                }
                            }
                        });

                        // let period = markdownstring.substr(-1).match(/[.,:!?]/) ? ' ' : '. '

                        markdownstring = "'" + markdownstring + "'";

                        for (var j = 0; j < node.ports.length; j++) {
                            if (!node.ports[j].in) {
                                [nextLink] = node.ports[j].links;
                            }
                        }
                    }

                    story.lines[node.id] = {
                        speak: markdownstring,
                        nextId: links[nextLink]
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
                        nextId: links[nextLink]
                    }
                } else {
                    let nextLink = null;
                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links;
                        }
                    }
                    if(nextLink){
                        story.lines[node.id] = {
                            nextId: links[nextLink]
                        }
                    }
                }
            }
            let params = {
                TableName: `com.getstoryflow.skills.${testing ? 'testing' : 'live'}`,
                Item: story
            };
            docClient.put(params, err => {
                if (err) {
                    console.log(err);
                    res.sendStatus(err.statusCode);
                } else if(testing) {
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

const publish = async (req, res) => {
    if (!req.user || !req.params.skill_id || !req.params.diagram_id) {
        res.sendStatus(401);
        return;
    }

    let skill_id = hashids.decode(req.params.skill_id)[0];

    let status = await renderDiagram(req.user, req.params.diagram_id, skill_id);

    res.sendStatus(status);
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
    getVariables: getVariables,
    getDiagrams: getDiagrams,
    getDiagram: getDiagram,
    deleteDiagram: deleteDiagram,
    setDiagram: setDiagram,
    publish: publish,
    publishTest: publishTest
}
