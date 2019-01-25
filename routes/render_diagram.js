const isVarName = require('is-var-name');
const { getEnvVariable } = require('../util')
const { docClient, pool, hashids } = require('./../services')
const draftToMarkdown = require('./../config/drafttomarkdown')
const validUrl = require('valid-url');
const _ = require('lodash');

const expressionfy = (expression, depth = 0) => {
  if (depth > 8) {
    // return a blank
    return 0;
  } else if (expression.type == 'value') {
    let value = expression.value.toString();
    if (!expression.value) {
      return 0
    } else if (isNaN(value)) {
      value = value.replace(/'/g, '\\\'')
      value = value.replace(/"/g, '\\\"')
      return "'" + value + "'";
    } else {
      return (value * 1)
    }
  } else if (expression.type == 'variable') {
    if (isVarName(expression.value)) {
      return `v['${expression.value}']`
    } else {
      return 0
    }
  } else {
    let string = "(";

    if (expression.type == 'not') {
      string += `!${expressionfy(expression.value)}`
    } else if (expression.type == 'and') {
      string += `${expressionfy(expression.value[0])} && ${expressionfy(expression.value[1])}`
    } else if (expression.type == 'or') {
      string += `${expressionfy(expression.value[0])} || ${expressionfy(expression.value[1])}`
    } else if (expression.type == 'plus') {
      string += `${expressionfy(expression.value[0])} + ${expressionfy(expression.value[1])}`
    } else if (expression.type == 'minus') {
      let first = expressionfy(expression.value[0]);
      // if(isNaN(first) && !(/(v\[\")\w+(\"])/.test(first))) return 0;
      let second = expressionfy(expression.value[1]);
      // if(isNaN(second) && !(/(v\[\")\w+(\"])/.test(second))) return 0;

      string += `${first} - ${second}`
    } else if (expression.type == 'times') {
      let first = expressionfy(expression.value[0]);
      // if(isNaN(first) && !(/(v\[\")\w+(\"])/.test(first))) return 0;
      let second = expressionfy(expression.value[1]);
      // if(isNaN(second) && !(/(v\[\")\w+(\"])/.test(second))) return 0;

      string += `${first} * ${second}`
    } else if (expression.type == 'divide') {
      let first = expressionfy(expression.value[0]);
      // if(isNaN(first) && !(/(v\[\")\w+(\"])/.test(first))) return 0;
      let second = expressionfy(expression.value[1]);
      // if((isNaN(second) && !(/(v\[\")\w+(\"])/.test(second))) || second == 0) return 0;

      string += `${first} / ${second}`
    } else if (expression.type == 'greater') {
      string += `${expressionfy(expression.value[0])} > ${expressionfy(expression.value[1])}`
    } else if (expression.type == 'less') {
      string += `${expressionfy(expression.value[0])} < ${expressionfy(expression.value[1])}`
    } else if (expression.type == 'equals') {
      string += `${expressionfy(expression.value[0])} == ${expressionfy(expression.value[1])}`
    }

    return (string + ")");
  }
}

const addStory = (story, cb) => {
  pool.query('SELECT 1 FROM diagrams WHERE id = $1 LIMIT 1', [story.id], (err, res) => {
    if (err || res.rows.length < 1) {
      pool.query('INSERT INTO diagrams (id, name, skill_id) VALUES ($1, $2, $3)',
        [story.id, story.name, story.skill_id], (err, res) => {
          if (err) {
            cb(err)
          } else {
            cb(false)
          }
        })
    } else {
      pool.query('UPDATE diagrams SET name = $1 WHERE id = $2',
        [story.name, story.skill_id], (err, res) => {
          if (err) {
            cb(err)
          } else {
            cb(false)
          }
        })
    }
  })
}

/* 
options object properties {
  type: type needed to be rendered eg. TEST/MARKET
  rendered_set: Set of all visited diagrams (no cycles)
  used_intents: Set of all intents that are used
  used_choices: Set of all choices that are used
  permissions: Set of all permissions required by the skill
  interfaces: Set of all interfaces required by the skill
  intents: Object of all the intents used in the skill
  slots: Object of all the slots used in the skill
}
*/
const renderDiagram = (user, diagram_id, skill_id, options={}, depth = 0, platform='alexa') => new Promise((resolve) => {
  if(!options.rendered_set) options.rendered_set = new Set()
  if(!options.used_intents) options.used_intents = new Set()
  if(!options.used_choices) options.used_choices = new Set()
  if(!options.permissions) options.permissions = new Set()
  if(!options.interfaces) options.interfaces = new Set()

  let params = {
    TableName: getEnvVariable('DIAGRAMS_DYNAMO_TABLE'),
    Key: {
      'id': diagram_id
    }
  };
  if (depth > 10) {
    resolve(413)
    return
  }

  let testing = (skill_id === "TEST");
  docClient.get(params, async (err, data) => {
    if (err) {
      console.error(err)
      resolve(500)
    } else if (data.Item && (data.Item.skill === skill_id || testing)) {
      // Add to set of rendered diagrams to prevent looping
      options.rendered_set.add(diagram_id)
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
      if (options.type === 'market' && !options.is_module_subflow) {
        key = "$" + options.version + '_' + key;
      } else if (options.is_module_subflow) {
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
          if (link_id in links) {
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
        } else if (node.extras.type === 'exit') {
          story.lines[node.id] = {
            end: true
          }
        } else if (node.extras.type === 'command' || node.extras.type === 'jump' || (node.extras.type === 'intent' && node.extras.alexa && node.extras.alexa.intent)) {

          let nextLink = null;
          for (var j = 0; j < node.ports.length; j++) {
            if (!node.ports[j].in) {
              [nextLink] = node.ports[j].links;
            }
          }

          let nextId = getLink(nextLink)
          let extras = node.extras[platform]

          if (extras) { // Default stop and helps don't have platform-specific extras
            if (extras.intent) {
              let intent = extras.intent
              // Log that this intent has been used
              options.used_intents.add(intent.key)
  
              let mappings = []
              if (Array.isArray(extras.mappings)) {
                extras.mappings.forEach(mapping => {
                  if (!mapping.slot) {
                    return
                  }
                  if (intent.built_in) {
                    mappings.push({
                      variable: mapping.variable,
                      slot: mapping.slot.label
                    })
                  } else if (mapping.slot.key in options.slots) {
                    mappings.push({
                      variable: mapping.variable,
                      slot: options.slots[mapping.slot.key]
                    })
                  }
                })
              }
  
              if (intent.built_in) {
                intent = intent.label
              } else if (intent.key in options.intents) {
                intent = options.intents[intent.key]
              }
              if (intent) {
                if (extras.resume) {
                  if (extras.diagram_id) {
                    let result
                    try {
                      result = await renderDiagram(user, extras.diagram_id, skill_id, options, depth + 1, platform)
                    } catch (err) {
                      result = 500
                    }
                    if (result < 300) {
                      story.commands.push({
                        intent: intent,
                        mappings: mappings,
                        diagram_id: extras.diagram_id,
                        end: !!extras.end
                      })
                    }
                  }
                } else if (nextId) {
                  story.commands.push({
                    intent: intent,
                    mappings: mappings,
                    next: nextId
                  })
                }
              }
            } else if (extras.commands) {
              // DEPRECATE OLD COMMANDS
              let commands = extras.commands.split('\n').filter(i => {
                return !!i
              })
  
              commands.forEach(command => {
                story.commands.push({
                  string: command,
                  value: nextId
                })
              })
            }
          }
        } else if (node.extras.type === 'random') {
          let list = node.ports.filter(a => !a.in && a.links.length > 0).map(port => getLink(port.links[0]))
          story.lines[node.id] = {
            random: node.extras.smart ? 2 : 1,
            nextIds: list,
            id: node.id
          };
        } else if (node.extras.type === 'choicenew' || node.extras.type === 'choice') {

          const inputs = node.extras.inputs.map(input => input.split('\n').filter(i => {
            return !!i
          }))

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

          if (inputs) {
            node.extras.inputs.forEach(input => {
              if (input.trim() !== '') {
                input.split('\n').forEach(c => {
                  options.used_choices.add(c.toLowerCase())
                })
              }
            })
          }

        } else if (node.extras.type === 'interaction' || (node.extras.type === 'intent' && (node.extras.alexa && node.extras.alexa.choices))) {

          let interactions = []
          let extras = node.extras[platform]

          extras.choices.forEach(choice => {
            let new_choice = {
              mappings: []
            }
            if (choice.intent) {

              // Log that this intent has been used
              options.used_intents.add(choice.intent.key)

              if (choice.intent.built_in) {
                new_choice.intent = choice.intent.label
              } else if (choice.intent.key in options.intents) {
                new_choice.intent = options.intents[choice.intent.key]
              }
              choice.mappings.forEach(mapping => {
                if (choice.intent.built_in) {
                  new_choice.mappings.push({
                    variable: mapping.variable,
                    slot: mapping.slot.label
                  })
                } else if (mapping.slot && mapping.slot.key in options.slots) {
                  new_choice.mappings.push({
                    variable: mapping.variable,
                    slot: options.slots[mapping.slot.key]
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
          options.interfaces.add('AUDIO_PLAYER')
          let stop = getLink(node.ports.filter(a => a.label === 'stop/pause')[0].links[0]);

          if (node.extras.player) {
            story.lines[node.id] = {
              loop: node.extras.loop,
              play: node.extras.audio,
              nextId: stop,
              PAUSE_ID: node.id,
              NEXT: getLink(node.ports.filter(a => a.label === 'next')[0].links[0]),
              PREVIOUS: getLink(node.ports.filter(a => a.label === 'previous')[0].links[0]),
              // SHUFFLE: links[node.ports.filter(a => a.label === 'shuffle')[0].links[0]]
            };
          } else {
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
          if (node.extras.audio && validUrl.isUri(node.extras.audio)) {
            audio = node.extras.audio;
          } else if (node.extras.lines[0].audio && validUrl.isUri(node.extras.lines[0].audio)) {
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
          if (!options.rendered_set.has(node.extras.diagram_id)) {
            let result
            try {
              // console.log('going in', node.extras.diagram_id);
              // let new_options = options
              // Reset diagram id for sub flows in modules
              // if(type === 'market'){
              //     subflow_diagram_id = options.version + '_' + node.extras.diagram_id
              //     new_options = JSON.parse(JSON.stringify(options))
              //     new_options['is_module_subflow'] = true
              // }
              result = await renderDiagram(user, node.extras.diagram_id, skill_id, options, depth + 1, platform);
            } catch (err) {
              return resolve(500)
            }

            if (result < 300) {
              linkDiagram()
            }
          } else {
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

          if (node.extras.sets) {
            story.lines[node.id] = {
              sets: node.extras.sets.map(block => {
                return {
                  variable: block.variable,
                  expression: expressionfy(block.expression)
                }
              }),
              nextId: getLink(nextLink)
            };
          } else {
            story.lines[node.id] = {
              variable: node.extras.variable,
              expression: expressionfy(node.extras.expression),
              nextId: getLink(nextLink)
            };
          }
        } else if (node.extras.type === 'if') {
          if (node.extras.expressions) {
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
          } else {
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
            if (node.extras.randomize) {
              random_speak.push(line)
            } else {
              markdownstring += line
            }
          }

          if (Array.isArray(node.extras.dialogs)) {
            node.extras.dialogs.forEach(d => {
              if (d.audio) {
                add(`<audio src="${d.audio}"/>`)
              } else if (d.rawContent) {
                temp = draftToMarkdown(d.rawContent, {
                  alexa: true
                });
                if (d.voice === 'Alexa' || !d.voice) {
                  add(temp)
                } else {
                  add(`<voice name="${d.voice}">${temp}</voice>`)
                }
              }
            });
          } else {
            // DEPRECATE OLD SPEAK 
            let raw;
            if (node.extras.rawContent) {
              raw = node.extras.rawContent;
            } else {
              raw = node.extras.raw;
            }
            if (raw) {
              markdownstring = draftToMarkdown(raw, {
                alexa: true
              });
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

          if (node.extras.randomize && random_speak.length !== 0) {
            story.lines[node.id].random_speak = random_speak
          } else if (markdownstring) {
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
            title: draftToMarkdown(node.extras.title, {
              alexa: false
            })
          }

          if (card.type === 'Standard') {
            card.text = draftToMarkdown(node.extras.content, {
              alexa: false,
              newline: true
            })
            if (node.extras.large_img) {
              card.image = {}
              card.image.largeImageUrl = node.extras.large_img

              if (node.extras.small_img) {
                card.image.smallImageUrl = node.extras.small_img
              }
            }
          } else if (card.type === 'Simple') {
            card.content = draftToMarkdown(node.extras.content, {
              alexa: false,
              newline: true
            })
          } else {
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
              if (param_map.val && param_map.key) {
                headers.push({
                  val: draftToMarkdown(param_map.val),
                  key: draftToMarkdown(param_map.key)
                })
              }
            })
          }

          let formattedBody
          if (node.extras.bodyInputType = 'rawInput') {
            if (node.extras.content) {
              formattedBody = node.extras.content
            } else if (!_.isNil(node.extras.rawContent)) {
              formattedBody = draftToMarkdown(node.extras.rawContent)
            }
          } else if (!_.isNil(node.extras.body)) {
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
              if (typeof param_map.path !== 'string') {
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
          if (id && id[0] && (node.extras.to === '_USER' || validateEmail(node.extras.to))) {
            let mapping;
            if (Array.isArray(node.extras.mapping)) {
              mapping = node.extras.mapping.filter(m => {
                return m.val && m.key
              });
            } else {
              mapping = [];
            }

            story.lines[node.id] = {
              template_id: id[0],
              to: node.extras.to,
              mapping: mapping,
              success_id: getLink(node.ports.filter(a => a.in === false && a.label !== 'fail')[0].links[0]),
              fail_id: getLink(node.ports.filter(a => a.in === false && a.label === 'fail')[0].links[0])
            }
          } else {
            story.lines[node.id] = {
              nextId: getLink(node.ports.filter(a => a.in === false && a.label === 'fail')[0].links[0])
            }
          }
        } else if (node.extras.type === 'display') {
          options.interfaces.add('ALEXA_PRESENTATION_APL')
          let id = hashids.decode(node.extras.display_id)

          story.lines[node.id] = {
            display_id: id[0],
            datasource: node.extras.datasource,
            update_on_change: node.extras.update_on_change,
            nextId: getLink(node.ports.filter(a => a.in === false)[0].links[0])
          }
        } else if(node.extras.type === 'reminder') {
          options.permissions.add('alexa::alerts:reminders:skill:readwrite')
          node_reminder = node.extras.reminder
          let reminder = {}
          reminder.text = draftToMarkdown(node_reminder.text)
          reminder.type = node_reminder.reminder_type
          reminder.time = node_reminder.time
          if(reminder.type === 'SCHEDULED_ABSOLUTE'){
            reminder.timezone = node_reminder.timezone
            reminder.date = node_reminder.date
          }

          story.lines[node.id] = {
            reminder: reminder,
            success_id: getLink(node.ports.filter(a => a.in === false && a.label !== 'fail')[0].links[0]),
            fail_id: getLink(node.ports.filter(a => a.in === false && a.label === 'fail')[0].links[0])
          }
        } else if (node.extras.type === 'permission') {
          let nextLink = null
          for (var j = 0; j < node.ports.length; j++) {
            if (!node.ports[j].in) {
              [nextLink] = node.ports[j].links;
            }
          }

          // Permission Card
          story.lines[node.id] = {
            permission_card: true,
            nextId: getLink(nextLink)
          }
        } else if (node.extras.type === 'permissions') {
          // Email/Name/Phone Permission Requests
          const permissions = node.extras.permissions ? node.extras.permissions : []
          permissions.forEach(permission => {
            if(permission && permission.selected && permission.selected.value){
              options.permissions.add(permission.selected.value)
            }
          })

          story.lines[node.id] = {
            permissions: permissions,
            success_id: getLink(node.ports.filter(a => a.in === false && a.label !== 'fail' && a.label !== 'declined')[0].links[0]),
            fail_id: getLink(node.ports.filter(a => a.in === false && a.label === 'fail')[0].links[0])
          }
        } else if (node.extras.type === 'link_account') {
          story.lines[node.id] = {
            link_account: true,
            nextId: getLink(node.ports.filter(a => a.in === false)[0].links[0])
          }
        } else if (node.extras.type === 'module') {

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
        } else if (node.extras.type === 'cancel') {
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
          if (nextLink) {
            story.lines[node.id] = {
              nextId: getLink(nextLink)
            }
          }
        }
      }
      let render_type
      if (!options.type) {
        render_type = testing ? 'testing' : 'live'
      } else {
        render_type = options.type
      }
      let params = {
        TableName: `${getEnvVariable('SKILLS_DYNAMO_TABLE_BASE_NAME')}.${render_type}`,
        Item: story
      }
      docClient.put(params, err => {
        if (err) {
          console.log(err)
          res.sendStatus(err.statusCode)
        } else if (testing || options.type === 'market') {
          resolve(200)
        } else {
          // Add the story to SQL as well
          addStory(story, (err) => {
            if (err) {
              console.error(err)
              resolve(500)
              return
            } else {
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

module.exports = {
  renderDiagram: renderDiagram
}