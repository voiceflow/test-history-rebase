const AdmZip = require('adm-zip');
const _ = require('lodash')
const dialogflow = require('dialogflow');
const uuid = require('uuid/v4')
const { getEnvVariable } = require('../../util')
const { Package, Agent, Intent, IntentEntry} = require('./Interfaces')

const BUILT_IN_EXAMPLES = {
  '@sys.date': 'october 17 2019'
}

class DialogFlow {
  constructor(projectId, privateKey, clientEmail) {
    this.projectId = projectId

    let config = {
      credentials: {
        private_key: privateKey,
        client_email: clientEmail
      }
    }

    this.sessionClient = new dialogflow.SessionsClient(config)
    this.agentClient = new dialogflow.AgentsClient(config)
    this.intentsClient = new dialogflow.IntentsClient(config)
    this.entitiesClient = new dialogflow.EntityTypesClient(config)
  }

  async listAgents() {
    const search = await this.agentClient.searchAgents({
      parent: `projects/-`
    })
    return search
  }

  async getAgent() {
    const search = await this.agentClient.getAgent({
      parent: `projects/${this.projectId}`
    })

    let res = search.filter(e => e ? e : null)
    return res
  }

  async exportAgent() {
    const resp = await this.agentClient.exportAgent({
      parent: `projects/${this.projectId}`
    })
  }

  async deleteAllIntents() {
    let all_intents = []
    let {
      intents,
      next_page_token
    } = await this.intentsClient.listIntents({
      parent: `projects/${this.projectId}`,
      page_size: 1000
    })

    all_intents = all_intents.concat(intents)
    while (next_page_token) {
      ({
        intents,
        next_page_token
      } = await this.intentsClient.listIntents({
        parent: `projects/${this.projectId}`,
        page_size: 1000,
        page_token: next_page_token
      }))
      all_intents = all_intents.concat(intents)
    }

    const delete_resp = await this.intentsClient.batchDeleteIntent({
      parent: `projects/${this.projectId}`,
      intents: all_intents
    })

    let operation = restore_resp[0]
    try {
      await operation.promise()
    } catch (e) {
      console.error('Error uploading to dialogflow', e)
      throw ('Error uploading to dialogflow')
    }
  }

  async updateIntents(new_intents) {
    let intents_to_delete = []
    let display_name_map = {}

    try {
      let all_intents = await this.intentsClient.listIntents({
        parent: `projects/${this.projectId}/agent`,
        page_size: 1000
      })

      if (all_intents[0]) {
        all_intents = all_intents[0]
      }

      all_intents.forEach(intent => {
        if (!_.find(new_intents, {
            name: intent.displayName
          })) {
          intents_to_delete.push(intent)
        }
        display_name_map[intent.displayName] = intent.name
      })

      const inline_batch_intents = new_intents.map(intent => this._formatIntentForUpdate(intent, display_name_map[intent.name]))

      // Handle the operation using the promise pattern.
      const updateResp = await this.intentsClient.batchUpdateIntents({
        parent: `projects/${this.projectId}/agent`,
        intentBatchInline: {
          intents: inline_batch_intents
        }
      })

      let operation = updateResp[0];
      await operation.promise()

      const deleteResp = await this.intentsClient.batchDeleteIntents({
        parent: `projects/${this.projectId}/agent`,
        intentBatchInline: {
          intents: intents_to_delete
        }
      })

      operation = deleteResp[0];
      await operation.promise()

      return
    } catch (e) {
      console.error('Error uploading to dialogflow', e)
      throw (`Error uploading to dialogflow: ${e.details || e}`)
    }
  }

  _formatIntentForUpdate(intent, name) {

    let training_phrases = []
    let events = []
    let slots = []
    let parameters = []

    if (intent.slots) {
      slots = intent.slots.map(s => s.name)
      intent.slots.forEach(slot => {
        parameters.push({
          displayName: slot.name,
          entityTypeDisplayName: slot.type.startsWith('@') ? slot.type : `@${slot.type}`,
          isList: false,
          value: `$${slot.type.startsWith('@') ? slot.type.subString(1) : slot.type}.original`
        })
      })
    }
    const regexp = new RegExp(`(\{(?:${slots.join('|') || '[^\{\}]+'})\})`, 'g')

    if (intent.samples) {
      intent.samples.forEach(input => {

        const raw_texts = input.split(regexp).filter(Boolean)
        const parts = raw_texts.map(part => {
          if (/\{[^\{\}]+\}/.test(part)) {

            const slot_name = part.match(/\{([^\{\}]+)\}/)[1]
            const slot = _.find(intent.slots, {name:slot_name})
            const slot_type = slot.type
            const samples = slot.samples

            return {
              user_defined: true,
              text: BUILT_IN_EXAMPLES[slot_type] || (samples.length > 0 && samples[0] ) || 'example',
              alias: slot_name,
              entityType: slot_type.toLowerCase() === 'custom' ? `@${slot_name}` : `@${slot_type}`
            }
          } else {
            return {
              text: part
            }
          }
        })
        training_phrases.push({
          name: uuid(),
          type: 'EXAMPLE',
          parts: parts,
          events: events
        })
      })
    } else {
      if (/actions\.intent/.test(intent.name)) {
        events.push(intent.name.replace(/\./g, '_'))
      }
    }

    return {
      name: name,
      displayName: intent.name,
      webhookState: 'WEBHOOK_STATE_ENABLED',
      trainingPhrases: training_phrases,
      events: events,
      parameters: parameters
    }
  }

  async updateEntities(new_slots) {
    let slots_to_delete = []
    let display_name_map = {}

    try {
      let all_slots = await this.entitiesClient.listEntityTypes({
        parent: `projects/${this.projectId}/agent`,
        page_size: 1000
      })

      if (all_slots[0]) {
        all_slots = all_slots[0]
      }

      all_slots.forEach(slot => {
        if (!_.find(new_slots, {
            name: slot.displayName
          })) {
            slots_to_delete.push(slot)
        }
        display_name_map[slot.displayName] = slot.name
      })

      const inline_batch_slot = new_slots.map(slot => this._formatSlotForUpdate(slot, display_name_map[slot.displayName]))

      // Handle the operation using the promise pattern.
      const updateResp = await this.entitiesClient.batchUpdateEntityTypes({
        parent: `projects/${this.projectId}/agent`,
        entityTypeBatchInline: {
          entityTypes: inline_batch_slot
        }
      })

      let operation = updateResp[0];
      await operation.promise()

      const deleteResp = await this.entitiesClient.batchDeleteEntityTypes({
        parent: `projects/${this.projectId}/agent`,
        entityTypeBatchInline: {
          entityTypes: slots_to_delete
        }
      })

      operation = deleteResp[0];
      await operation.promise()

      return
    } catch (e) {
      console.error('Error uploading to dialogflow', e)
      throw (`Error uploading to dialogflow: ${e.details || e}`)
    }
  }

  _formatSlotForUpdate(slot, name) {
    slot.name = name || undefined
    slot.kind = 'KIND_MAP'
    return slot
  }

  async updateAgentFulfillment(encoded_id) {
    const url = `${getEnvVariable('SKILL_ENDPOINT')}/state/skill/gactions/${encoded_id}`

    let agent = Agent()
    agent.webhook = {
      "url": url,
      "available": true,
      "useForDomains": false,
      "cloudFunctionsEnabled": false,
      "cloudFunctionsInitialized": false
    }

    const dummy = Intent('dummy_intent_vf')

    let zip = new AdmZip()
    zip.addFile('agent.json', Buffer.from(JSON.stringify(agent)))
    zip.addFile('package.json', Buffer.from(JSON.stringify(Package())))
    zip.addFile('entities/', Buffer.from(''))
    zip.addFile('intents/', Buffer.from(''))

    zip.addFile('intents/dummy_intent_vf.json', Buffer.from(JSON.stringify(dummy)))
    zip.addFile('intents/dummy_intent_vf_usersays_en.json', Buffer.from(JSON.stringify(IntentEntry())))

    const buf = zip.toBuffer()
    const b64s = buf.toString('base64')

    const import_resp = await this.agentClient.importAgent({
      parent: `projects/${this.projectId}`,
      agentContent: b64s
    })

    let operation = import_resp[0]
    try {
      await operation.promise()
    } catch (e) {
      console.error('Error uploading to dialogflow', e)
      throw ('Error uploading to dialogflow')
    }
    return
  }

  async trainAgent() {
    const train_resp = await this.agentClient.trainAgent({
      parent: `projects/${this.projectId}`
    })

    let operation = train_resp[0]
    try {
      await operation.promise()
    } catch (e) {
      console.error('Error training agent', e)
      throw ('Error training agent')
    }
    return
  }

  async restoreAgent({
    intents,
    slots,
    skill_id
  }) {
    console.log("RESTOREAGENT", intents, slots, skill_id)

    let zip = new AdmZip()
    zip.addFile('agent.json', Buffer.from(JSON.stringify(agent)))
    zip.addFile('package.json', Buffer.from(JSON.stringify(p_json)))
    zip.addFile('entities/', Buffer.from(''))
    zip.addFile('intents/', Buffer.from(''))

    zip.addFile('entities/Animal_entries_en.json', Buffer.from(JSON.stringify(animal_entries)))
    zip.addFile('entities/Animal.json', Buffer.from(JSON.stringify(animal)))

    zip.addFile('intents/i would like a dog_usersays_en.json', Buffer.from(JSON.stringify(dog_usersays)))
    zip.addFile('intents/i would like a dog.json', Buffer.from(JSON.stringify(dog)))

    const buf = zip.toBuffer()
    const b64s = buf.toString('base64')

    const restore_resp = await this.agentClient.restoreAgent({
      parent: `projects/${this.projectId}`,
      agentContent: b64s
    })

    let operation = restore_resp[0]
    try {
      await operation.promise()
    } catch (e) {
      console.error('Error uploading to dialogflow', e)
      throw ('Error uploading to dialogflow')
    }
    return
  }
}

module.exports = DialogFlow