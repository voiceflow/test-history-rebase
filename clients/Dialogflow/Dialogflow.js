'use strict';

const AdmZip = require('adm-zip');
const _ = require('lodash');
const dialogflow = require('dialogflow');
const uuid = require('uuid/v4');
const { Package, Agent } = require('./Interfaces');
const { BUILT_IN_EXAMPLES, WelcomeIntent, FallbackIntent } = require('./Constants');

class DialogFlow {
  constructor(projectId, privateKey, clientEmail) {
    this.projectId = projectId;

    const config = {
      credentials: {
        private_key: privateKey,
        client_email: clientEmail,
      },
    };

    this.sessionClient = new dialogflow.SessionsClient(config);
    this.agentClient = new dialogflow.AgentsClient(config);
    this.intentsClient = new dialogflow.IntentsClient(config);
    this.entitiesClient = new dialogflow.EntityTypesClient(config);
  }

  setLocale(locale) {
    this.locale = locale;
  }

  // async listAgents() {
  //   const search = await this.agentClient.searchAgents({
  //     parent: 'projects/-',
  //   });
  //   return search;
  // }

  async getAgent() {
    const search = await this.agentClient.getAgent({
      parent: `projects/${this.projectId}`,
    });

    return search.filter((e) => e || null);
  }

  async updateIntents(new_intents) {
    const intents_to_delete = [];
    const display_name_map = {};

    try {
      let all_intents = await this.intentsClient.listIntents({
        parent: `projects/${this.projectId}/agent`,
        pageSize: 1000,
        languageCode: this.locale,
      });

      if (all_intents[0]) {
        [all_intents] = all_intents;
      }

      all_intents.forEach((intent) => {
        if (
          !_.find(new_intents, {
            name: intent.displayName,
          })
        ) {
          intents_to_delete.push(intent);
        }
        display_name_map[intent.displayName] = intent.name;
      });

      const inline_batch_intents = new_intents.map((intent) => this._formatIntentForUpdate(intent, display_name_map[intent.name]));

      if (inline_batch_intents && inline_batch_intents.length > 0) {
        // Handle the operation using the promise pattern.
        const updateResp = await this.intentsClient.batchUpdateIntents({
          parent: `projects/${this.projectId}/agent`,
          intentBatchInline: {
            intents: inline_batch_intents,
          },
          languageCode: this.locale,
        });

        const operation = updateResp[0];
        await operation.promise();
      }

      if (intents_to_delete && intents_to_delete.length > 0) {
        const deleteResp = await this.intentsClient.batchDeleteIntents({
          parent: `projects/${this.projectId}/agent`,
          intentBatchInline: {
            intents: intents_to_delete,
          },
          languageCode: this.locale,
        });

        const operation = deleteResp[0];
        await operation.promise();
      }
      return;
    } catch (e) {
      console.error('Error uploading to dialogflow', e);
      // eslint-disable-next-line
      throw `Error uploading to dialogflow: ${e.details || e}`;
    }
  }

  _formatIntentForUpdate(intent, name) {
    const training_phrases = [];
    const events = [];
    let slots = [];
    const parameters = [];

    if (intent.slots) {
      slots = intent.slots.map((s) => s.name);
      intent.slots.forEach((slot) => {
        parameters.push({
          displayName: slot.name,
          entityTypeDisplayName: slot.type.startsWith('@') ? slot.type : `@${slot.type}`,
          isList: false,
          value: `$${slot.name}.original`,
        });
      });
    }
    const regexp = new RegExp(`({(?:${slots.join('|') || '[^{}]+'})})`, 'g');

    if (intent.samples) {
      intent.samples.forEach((input) => {
        const raw_texts = input.split(regexp).filter(Boolean);
        const parts = raw_texts.map((part) => {
          if (/\{[^{}]+\}/.test(part)) {
            const slot_name = part.match(/\{([^{}]+)\}/)[1];
            const slot = _.find(intent.slots, {
              name: slot_name,
            });

            const slot_type = slot.type;
            const { samples } = slot;

            return {
              user_defined: true,
              text: BUILT_IN_EXAMPLES[this.locale][slot_type] || (samples && samples.length > 0 && samples[0]) || 'example',
              alias: slot_name,
              entityType: slot_type.startsWith('@') ? slot_type : `@${slot_name}`,
            };
          }
          return {
            text: part,
          };
        });
        training_phrases.push({
          name: uuid(),
          type: 'EXAMPLE',
          parts,
          events,
        });
      });
    } else if (/actions\.intent/.test(intent.name)) {
      events.push(intent.name.replace(/\./g, '_'));
    }

    return {
      name,
      displayName: intent.name,
      webhookState: 'WEBHOOK_STATE_ENABLED',
      trainingPhrases: training_phrases,
      events,
      parameters,
    };
  }

  async updateEntities(new_slots) {
    const slots_to_delete = [];
    const display_name_map = {};

    try {
      let all_slots = await this.entitiesClient.listEntityTypes({
        parent: `projects/${this.projectId}/agent`,
        page_size: 1000,
        languageCode: this.locale,
      });

      if (all_slots[0]) {
        [all_slots] = all_slots;
      }

      all_slots.forEach((slot) => {
        if (
          !_.find(new_slots, {
            name: slot.displayName,
          })
        ) {
          slots_to_delete.push(slot);
        }
        display_name_map[slot.displayName] = slot.name;
      });

      const inline_batch_slot = new_slots.map((slot) => this._formatSlotForUpdate(slot, display_name_map[slot.displayName]));

      if (inline_batch_slot && inline_batch_slot.length > 0) {
        // Handle the operation using the promise pattern.
        const updateResp = await this.entitiesClient.batchUpdateEntityTypes({
          parent: `projects/${this.projectId}/agent`,
          entityTypeBatchInline: {
            entityTypes: inline_batch_slot,
          },
          languageCode: this.locale,
        });

        const operation = updateResp[0];
        await operation.promise();
      }

      if (slots_to_delete && slots_to_delete.length > 0) {
        const deleteResp = await this.entitiesClient.batchDeleteEntityTypes({
          parent: `projects/${this.projectId}/agent`,
          entityTypeBatchInline: {
            entityTypes: slots_to_delete,
          },
          languageCode: this.locale,
        });

        const operation = deleteResp[0];
        await operation.promise();
      }
      return;
    } catch (e) {
      console.error('Error uploading to dialogflow', e);
      // eslint-disable-next-line
      throw `Error uploading to dialogflow: ${e.details || e}`;
    }
  }

  _formatSlotForUpdate(slot, name) {
    slot.name = name || undefined;
    slot.kind = 'KIND_MAP';
    return slot;
  }

  async updateAgentFulfillment(encoded_id, main_locale, supported_locales) {
    const url = `${process.env.SKILL_ENDPOINT}/state/skill/gactions/${encoded_id}`;

    const agent = Agent();
    agent.webhook = {
      url,
      available: true,
      useForDomains: false,
      cloudFunctionsEnabled: false,
      cloudFunctionsInitialized: false,
    };

    if (main_locale) agent.language = main_locale;
    if (supported_locales) agent.supportedLanguages = supported_locales;

    const zip = new AdmZip();
    zip.addFile('agent.json', Buffer.from(JSON.stringify(agent)));
    zip.addFile('package.json', Buffer.from(JSON.stringify(Package())));
    zip.addFile('entities/', Buffer.from(''));
    zip.addFile('intents/', Buffer.from(''));

    zip.addFile('intents/Default Welcome Intent.json', Buffer.from(JSON.stringify(WelcomeIntent)));
    zip.addFile('intents/Default Fallback Intent.json', Buffer.from(JSON.stringify(FallbackIntent)));

    const buf = zip.toBuffer();
    const b64s = buf.toString('base64');

    const import_resp = await this.agentClient.restoreAgent({
      parent: `projects/${this.projectId}`,
      agentContent: b64s,
    });

    const operation = import_resp[0];
    try {
      await operation.promise();
    } catch (e) {
      console.error('Error uploading to dialogflow', e);
      // eslint-disable-next-line
      throw `Error uploading to dialogflow: ${e}`;
    }
  }

  async trainAgent() {
    const train_resp = await this.agentClient.trainAgent({
      parent: `projects/${this.projectId}`,
    });

    const operation = train_resp[0];
    try {
      await operation.promise();
    } catch (e) {
      console.error('Error training agent', e);
      // eslint-disable-next-line
      throw 'Error training agent';
    }
  }
}

module.exports = DialogFlow;
