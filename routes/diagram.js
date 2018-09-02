module.exports = (docClient, pool) => {

const getDiagrams = (req, res) => {
    if (!req.user) {
        res.sendStatus(401);
        return;
    }
    let params = {
        TableName: 'com.getstoryflow.diagrams.production',
        ProjectionExpression: req.query.verbose ? 'id, title, last_save' : 'id, title'
    };
    if (!req.user.admin) {
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

            if (diagram.creator !== req.user.id && !req.user.admin) {
                res.sendStatus(403);

                return;
            }

            res.send(data.Item);
        } else {
            res.sendStatus(404);
        }
    });
};

const setDiagram = (req, res) => {
    if (!req.body) {
        res.sendStatus(400);

        return;
    } else if (!req.user) {
        res.sendStatus(401);

        return;
    }

    let diagram = req.body;

    if (!diagram.creator) {
        diagram.creator = req.user.id;
    } else if (diagram.creator !== req.user.id && !req.user.admin) {
        res.sendStatus(403);

        return;
    }

    if (diagram.title.trim() === "" || !diagram.title.trim()){
        diagram.title = "Unnamed Project";
    }

    diagram.last_save = Date.now();

    let params = {
        TableName: 'com.getstoryflow.diagrams.production',
        Item: diagram
    };
    docClient.put(params, err => {
        if (err) {
            console.log(err);
            res.sendStatus(err.statusCode);
        } else {
            res.sendStatus(200);
        }
    });
};

const deleteDiagram = (req, res) => {
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

const renderStory = (params, req, res, success) => {
    docClient.get(params, (err, data) => {
        if (err) {
            console.log(err);
            res.sendStatus(err.statusCode);
        } else if (data.Item) {
            let diagram = JSON.parse(data.Item.data);
            let creator = data.Item.creator;

            if (creator !== req.user.id && !req.user.admin) {
                res.sendStatus(403);

                return;
            }

            let links = {};
            for (var i = 0; i < diagram.links.length; i++) {
                links[diagram.links[i].id] = diagram.links[i].target;
            }
            let story = {
                id: diagram.id,
                env: req.params.env,
                creator: creator,
                lines: {}
            };
            
            story.title = data.Item.title;

            for (var i = 0; i < diagram.nodes.length; i++) {
                let node = diagram.nodes[i];
                if (node.extras.type === 'story') {
                    story.startId = node.id;
                    story.audio = node.extras.audio;
                    story.preview = node.extras.preview;
                    story.prompt = node.extras.prompt;
                    let nextLink = null;
                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links;
                        }
                    }
                    story.lines[node.id] = {
                        audio: node.extras.audio,
                        nextId: links[nextLink]
                    };
                } else if (node.extras.type === 'random') {
                    let list = node.ports.filter(a => !a.in && a.links.length > 0).map(port => links[port.links[0]]);
                    story.lines[node.id] = {
                        random: true,
                        nextIds: list,
                        nextId: list.length > 0 ? list[0] : null
                    };
                } else if (node.extras.type === 'choice') {
                    story.lines[node.id] = {
                        audio: node.extras.audio,
                        prompt: node.extras.prompt,
                        choices: node.extras.choices,
                        inputs: node.extras.inputs.map(input => input.split('\n')),
                        elseId: links[node.ports.filter(a => a.label === 'else')[0].links[0]],
                        // Get all output ports, then assign labels to outputs, then lastly returns the next IDs. Returns a list of linked nodes
                        nextIds: node.ports.filter(a => !a.in && a.label !== 'else').sort((a, b) => a.label - b.label).map(port => links[port.links[0]])
                    };
                } else if (node.extras.type === 'choicenew') {
                    story.lines[node.id] = {
                        audio: null,
                        prompt: node.extras.prompt,
                        choices: node.extras.choices,
                        inputs: node.extras.inputs.map(input => input.split('\n')),
                        elseId: links[node.ports.filter(a => a.label === 'else')[0].links[0]],
                        // Get all output ports, then assign labels to outputs, then lastly returns the next IDs. Returns a list of linked nodes
                        nextIds: node.ports.filter(a => !a.in && a.label !== 'else').sort((a, b) => a.label - b.label).map(port => links[port.links[0]])
                    };
                } else if (node.extras.type === 'multiline') {
                    let nextLink = null;
                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links;
                        }
                    }
                    let audio = null;
                    if(node.extras.audio){
                        audio = node.extras.audio;
                    }else if(node.extras.lines[0].audio){
                        audio = node.extras.lines[0].audio;
                    }
                    story.lines[node.id] = {
                        audio: audio,
                        nextId: links[nextLink]
                    };
                } else if (node.extras.type === 'line') {
                    let nextLink = null;
                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links;
                        }
                    }
                    story.lines[node.id] = {
                        audio: node.extras.audio,
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
                } else if (node.extras.type === 'ending') {
                    story.lines[node.id] = {
                        audio: node.extras.audio
                    };
                } else if (node.extras.type === 'set') {
                    let nextLink = null;
                    for (var j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links;
                        }
                    }
                    story.lines[node.id] = {
                        variable: node.extras.variable,
                        expression: node.extras.expression,
                        nextId: links[nextLink]
                    };
                } else if (node.extras.type === 'if') {
                    story.lines[node.id] = {
                        variable: node.extras.variable,
                        operation: node.extras.operation,
                        expression: node.extras.expression,
                        trueId: links[node.ports.filter(a => a.label === 'true')[0].links[0]],
                        falseId: links[node.ports.filter(a => a.label === 'false')[0].links[0]]
                    };
                }
            }
            let params = {
                TableName: 'com.getstoryflow.stories.'+ story.env,
                Item: story
            };
            docClient.put(params, err => {
                if (err) {
                    console.log(err);
                    res.sendStatus(err.statusCode);
                } else {
                    // Add the story to SQL as well
                    addStory(story, (err) => {
                        if(err){
                            console.log(err);
                            res.status(500).send(err);
                            return;
                        }else{
                            res.sendStatus(200);
                            if(success && typeof success == "function"){
                                success();
                            }
                        }
                    })
                }
            });
        } else {
            res.sendStatus(404);
        }
    });
}

const addStory = (story, cb) => {
    pool.query('SELECT 1 FROM stories WHERE story_id = $1 AND env = $2 LIMIT 1', [story.id, story.env], (err,res) => {
        if(err || res.rows.length < 1){
            pool.query('INSERT INTO stories (story_id, env, title, preview, creator) VALUES ($1, $2, $3, $4, $5)', 
                [story.id, story.env, story.title, story.preview, story.creator], (err,res) => {
                if(err) {
                    cb(err);
                }else{
                    cb();
                }
            })
        }else{
            pool.query('UPDATE stories SET preview = $1, creator = $2, title = $3 WHERE story_id = $4 AND env = $5', 
                [story.preview, story.creator, story.title, story.id, story.env], (err,res) => {
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
    if (!req.user || !req.params.id) {
        res.sendStatus(401);

        return;
    } else if (!(req.params.env === "testing") && !req.user.admin) {
        res.sendStatus(403);

        return;
    }

    let params = {
        TableName: 'com.getstoryflow.diagrams.production',
        Key: {'id': req.params.id}
    };

    renderStory(params, req, res);
};

const publishReview = (req, res) => {
    if (!req.user || !req.params.id) {
        res.sendStatus(401);

        return;
    } else if (!req.user.admin) {
        res.sendStatus(403);

        return;
    }

    let params = {
        TableName: 'com.getstoryflow.reviews.staging',
        Key: {'id': req.params.id}
    };

    renderStory(params, req, res, () => {
        if( req.params.env != 'production' || req.params.env != 'sandbox'){
            return;
        }
        let update_params = {
            TableName: 'com.getstoryflow.reviews.staging',
            Key: { id: req.params.id },
            UpdateExpression: "set #status = :s",
            ExpressionAttributeValues:{
                ":s" : "published"
            },
            ExpressionAttributeNames:{
                "#status": "status"
            }
        };

        docClient.update(update_params, function(err, data) {
            if (err) {
                console.log(err);
            }
        });
    });
};

return {
    getDiagrams: getDiagrams,
    getDiagram: getDiagram,
    deleteDiagram: deleteDiagram,
    setDiagram: setDiagram,
    publish: publish,
    publishReview: publishReview
}}
