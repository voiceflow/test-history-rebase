const AWS = require('aws-sdk');

AWS.config.loadFromPath('./aws-config.json');

const docClient = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
});

const Story = require('./story.js');
const Audio = require('./audio.js');

const getDiagrams = (req, res) => {
    if (!req.user) {
        res.sendStatus(401);

        return;
    }
    let params = {
        TableName: 'com.getstoryflow.diagrams.production',
        ProjectionExpression: 'id, title'
    };
    if (!req.user.admin) {
        params.FilterExpression = 'creator = :creator';
        params.ExpressionAttributeValues = {':creator': req.user.id};
    }
    docClient.scan(params, (err, data) => {
        if (err) {
            console.log(err);
            res.sendStatus(err.statusCode);
        } else {
            res.send(data.Items);
        }
    });
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
        diagram.title = "Unnamed Story";
    }

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

const publish = (req, res) => {
    if (!req.user) {
        res.sendStatus(401);

        return;
    } else if (req.params.env === 'production' && !req.user.admin) {
        res.sendStatus(403);

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
            let diagram = JSON.parse(data.Item.data);
            let creator = data.Item.creator;

            if (creator !== req.user.id && !req.user.admin) {
                res.sendStatus(403);

                return;
            }

            let links = {};
            for (let i = 0; i < diagram.links.length; i++) {
                links[diagram.links[i].id] = diagram.links[i].target;
            }
            let story = {
                id: diagram.id,
                creator: creator,
                lines: {}
            };
            for (let i = 0; i < diagram.nodes.length; i++) {
                let node = diagram.nodes[i];
                if (node.extras.type === 'story') {
                    story.title = node.extras.title;
                    story.startId = node.id;
                    story.audio = node.extras.audio;
                    story.preview = node.extras.preview;
                    story.prompt = node.extras.prompt;
                    let nextLink = null;
                    for (let j = 0; j < node.ports.length; j++) {
                        if (!node.ports[j].in) {
                            [nextLink] = node.ports[j].links;
                        }
                    }
                    story.lines[node.id] = {
                        audio: node.extras.audio,
                        nextId: links[nextLink]
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
                } else if (node.extras.type === 'line') {
                    let nextLink = null;
                    for (let j = 0; j < node.ports.length; j++) {
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
                    for (let j = 0; j < node.ports.length; j++) {
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
                    for (let j = 0; j < node.ports.length; j++) {
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
                }
            }
            let params = {
                TableName: 'com.getstoryflow.stories.'+req.params.env,
                Item: story
            };
            docClient.put(params, err => {
                if (err) {
                    console.log(err);
                    res.sendStatus(err.statusCode);
                } else {
                    Story.getStoriesInternal(req.params.env, stories => {
                        Audio.updateTitles(stories, req.params.env);
                    });
                    res.sendStatus(200);
                }
            });
        } else {
            res.sendStatus(404);
        }
    });
};

exports.getDiagrams = getDiagrams;
exports.getDiagram = getDiagram;
exports.setDiagram = setDiagram;
exports.publish = publish;
