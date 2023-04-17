import { MLGenAutoComplete, MLGenEntityPrompt, MLGenEntityValue, MLGenerativeResponse, MLGenPromptRequest, MLGenUtteranceRequest } from '@/types';

import { ApiRequest } from '../types';
import { AbstractController } from './utils';

class GenerationController extends AbstractController {
  utterance(req: ApiRequest<Record<string, never>, MLGenUtteranceRequest>) {
    return this.services.generation.utterance(req.body, req.user!.creator_id);
  }

  prompt(req: ApiRequest<MLGenPromptRequest>) {
    return this.services.generation.prompt(req.body, req.user!.creator_id);
  }

  entityValue(req: ApiRequest<MLGenEntityValue>) {
    return this.services.generation.entityValue(req.body, req.user!.creator_id);
  }

  entityReprompt(req: ApiRequest<MLGenEntityPrompt>) {
    return this.services.generation.entityReprompt(req.body, req.user!.creator_id);
  }

  autoComplete(req: ApiRequest<MLGenAutoComplete>) {
    return this.services.generation.autoComplete(req.body);
  }

  generativeResponse(req: ApiRequest<MLGenerativeResponse>) {
    return this.services.generation.generativeResponse({ ...req.body, system: req.body?.system?.trim() });
  }

  generativeChat(req: ApiRequest<MLGenerativeResponse>) {
    return this.services.generation.generativeChat(req.body);
  }
}

export default GenerationController;
