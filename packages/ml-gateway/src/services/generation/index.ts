import VError from '@voiceflow/verror';
import template from 'es6-template-string';

import logger from '@/logger';
import { MLGenAutoComplete, MLGenEntityPrompt, MLGenEntityValue, MLGenPromptRequest, MLGenUtteranceRequest } from '@/types';

import { AbstractControl } from '../../control';
import { autoCompletePrompt } from './constants';
import { convertUtterances, parseArrayString, parseObjectString } from './utils';

const DEFAULT_LOCALE = 'en-US';

class GenerationService extends AbstractControl {
  async utterance(input: MLGenUtteranceRequest, userID: number) {
    const { requestID, locales: [locale = DEFAULT_LOCALE] = [], intent, examples = [], quantity, workspaceID } = input;

    const prompt = await this.getGenUtteranceGPTPrompt(locale, intent, examples, quantity);
    this.clients.analytics.trackGenRequest('utterance', userID, { ...input, prompt });

    let response;
    try {
      response = await this.clients.openAI.createCompletion({ prompt });
      const { data } = await this.services.billing.consumeGenerationQuota(workspaceID, response.tokensUsed!);
      const parsedResult = parseObjectString<{ utterances: string[]; intent_name?: string }>(response.text);
      const { utterances, intent_name } = parsedResult;
      this.clients.analytics.trackGenResponse('utterance', userID, { ...input, prompt, utterances, parsedResult });

      return {
        requestID,
        results: utterances,
        quota: data,
        ...(intent_name && { inferred_intent: intent_name }),
      };
    } catch (error) {
      logger.error(error);
      this.clients.analytics.trackGenError('utterance', userID, { ...input, requestID, prompt, response });
      throw new VError('failed to generate utterances', VError.HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async prompt(input: MLGenPromptRequest, userID: number) {
    const { requestID, locales: [locale = DEFAULT_LOCALE] = [], examples = [], quantity, workspaceID } = input;

    const prompt = await this.getGenPromptGPTPrompt(locale, examples, quantity);
    this.clients.analytics.trackGenRequest('prompt', userID, { ...input, prompt });

    let response;
    try {
      // ideally returns string array
      response = await this.clients.openAI.createCompletion({ prompt });
      const { data } = await this.services.billing.consumeGenerationQuota(workspaceID, response.tokensUsed!);
      const parsedResult = parseArrayString<string[]>(response.text);
      this.clients.analytics.trackGenResponse('prompt', userID, { ...input, prompt, parsedResult });

      return {
        requestID,
        results: parsedResult,
        quota: data,
      };
    } catch (error) {
      logger.error(error);
      this.clients.analytics.trackGenError('prompt', userID, { ...input, requestID, prompt, response });
      throw new VError('failed to generate prompts', VError.HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async entityValue(input: MLGenEntityValue, userID: number) {
    const { requestID, locales: [locale = DEFAULT_LOCALE] = [], type, name, examples = [], quantity, workspaceID } = input;

    const prompt = await this.getEntityValueGPTPrompt(locale, type, name, examples, quantity);
    this.clients.analytics.trackGenRequest('entity_value', userID, { ...input, prompt });

    let response;
    try {
      response = await this.clients.openAI.createCompletion({ prompt });
      const { data } = await this.services.billing.consumeGenerationQuota(workspaceID, response.tokensUsed!);
      const parsedResult = parseObjectString<Record<string, string[]>>(response.text);
      // transform object to array of arrays of strings, with key as first element
      const results = Object.entries(parsedResult).reduce<string[][]>((acc, [key, value]) => [...acc, [key, ...value]], []);
      this.clients.analytics.trackGenResponse('entity_value', userID, { ...input, prompt, parsedResult });

      return {
        requestID,
        results,
        quota: data,
      };
    } catch (error) {
      logger.error(error);
      this.clients.analytics.trackGenError('entity_value', userID, { ...input, requestID, prompt, response });
      throw new VError('failed to generate entity values', VError.HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async entityReprompt(input: MLGenEntityPrompt, userID: number) {
    const {
      requestID,
      locales: [locale = DEFAULT_LOCALE] = [],
      type,
      name,
      examples = [],
      intentName,
      intentInputs = [],
      quantity,
      workspaceID,
    } = input;

    const prompt = await this.getEntityRepromptGPTPrompt(locale, type, name, examples, intentName, intentInputs, quantity);
    this.clients.analytics.trackGenRequest('entity_reprompt', userID, { ...input, prompt });

    let response;
    try {
      response = await this.clients.openAI.createCompletion({ prompt });
      const { data } = await this.services.billing.consumeGenerationQuota(workspaceID, response.tokensUsed!);
      const parsedResult = parseObjectString<{ eg: string[] }>(response.text);
      this.clients.analytics.trackGenResponse('entity_reprompt', userID, { ...input, prompt, parsedResult });
      const { eg } = parsedResult;

      return {
        requestID,
        results: eg,
        quota: data,
      };
    } catch (error) {
      logger.error(error);
      this.clients.analytics.trackGenError('entity_reprompt', userID, { ...input, requestID, prompt, response });
      throw new VError('failed to generate entity values', VError.HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async getDocRefData(docName: string) {
    const docRef = this.clients.firestore.collection(this.config.FIRESTORE_GPTPROMPT_COLLECTION).doc(docName);
    const docRefData = (await docRef.get()).data();

    if (docRefData) return docRefData;

    throw new VError('no prompt templates available', VError.HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  async getGenUtteranceGPTPrompt(locale: string, intent: string, examples: string[], quantity: number) {
    const docRefData = await this.getDocRefData('gen_utterances');

    const utterances = convertUtterances(examples);

    const parameters = { locale, intent, utterances, quantity };

    // Intent + utterance examples available
    if (intent && utterances) return template.render(docRefData.iname_ex, parameters);

    // No intent + utterance examples available
    if (!intent && utterances) return template.render(docRefData.ex, parameters);

    // Intent available without utterance examples
    if (intent && !utterances) return template.render(docRefData.iname, parameters);

    throw new VError('Utterance generation requires at least one of the two: intent, examples', VError.HTTP_STATUS.BAD_REQUEST);
  }

  async getGenPromptGPTPrompt(locale: string, examples: string[], quantity: number) {
    const docRefData = await this.getDocRefData('gen_nomatch_variants');

    const utterances = convertUtterances(examples);

    // Prompt examples available
    if (utterances) return template.render(docRefData.ex, { locale, utterances, quantity });
    throw new VError('Prompt generation requires at least 1 example', VError.HTTP_STATUS.BAD_REQUEST);
  }

  async getEntityValueGPTPrompt(locale: string, type: string, name: string, examples: string[][], quantity: number) {
    const docRefData = await this.getDocRefData('gen_entity_value');
    const slotExamples = examples.map((exampleList) => `[${convertUtterances(exampleList)}]`).join(', ');
    const parameters = { locale, type: type.replace('VF.', ''), slotName: name, slotExamples, quantity };

    // Entity name available without utterance examples
    if (type.toLowerCase() === 'custom' && name) return template.render(docRefData.ename_ctype, parameters);

    // Augmenting built-in types with provided examples
    if (type.toLowerCase() === 'built-in' && slotExamples) return template.render(docRefData.ename_bitype_ex, parameters);

    // Augmenting built-in types without provided examples
    if (type.toLowerCase() === 'built-in' && !slotExamples) return template.render(docRefData.ename_bitype, parameters);

    throw new VError(
      'Entity value generation can only be execute for entity types: ["custom", "built-in"]; entity name is required for custom entity types!',
      VError.HTTP_STATUS.BAD_REQUEST
    );
  }

  // eslint-disable-next-line max-params
  async getEntityRepromptGPTPrompt(
    locale: string,
    type: string,
    entityName: string,
    examples: string[],
    intentName: string,
    intentValues: string[],
    quantity: number
  ) {
    const docRefData = await this.getDocRefData('gen_entity_reprompt');
    const utterances = convertUtterances(examples);

    const parameters = { locale, slotName: entityName, type, utterances, intent: intentName, intentValues, quantity };

    if (intentName && entityName) return template.render(docRefData.iname_ename, parameters);

    if (entityName && utterances) return template.render(docRefData.iname_uname, parameters);

    if (entityName) return template.render(docRefData.ename, parameters);

    throw new VError(
      'Entity reprompt generation requires at least one of the following: intentName, entityName, entityExamples',
      VError.HTTP_STATUS.BAD_REQUEST
    );
  }

  async autoComplete({ transcript }: MLGenAutoComplete) {
    const result = await this.clients.openAI.createCompletion({ prompt: autoCompletePrompt(transcript) });

    return result.text;
  }
}

export default GenerationService;
