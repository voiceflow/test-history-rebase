import { Constants } from '@voiceflow/alexa-types';
import { BaseDiagramNode as DBNode, BasePort as DBPort } from '@voiceflow/api-sdk';
import { Button, Node as BaseNode } from '@voiceflow/base-types';
import { Types as VoiceTypes } from '@voiceflow/voice-types';
import cuid from 'cuid';

import { DialogType, RepromptType } from '../../../constants';
import { Link, LinkData, Node, NodeData, Port, SpeakData } from '../../../models';
import { Nullable } from '../../../types';
import { createAdapter, createSimpleAdapter } from '../../utils';
import { generateOutPort } from '../utils';

export const createBlockAdapter = createSimpleAdapter;

export interface PortsAdapter<D = unknown> {
  toDB: (ports: { port: Port; target: string | null; link?: Link }[], node: Node, data: D) => DBPort<LinkData>[];
  fromDB: (ports: DBPort<LinkData>[], node: DBNode) => { port: Port; target: string | null }[];
}

// TODO: refactor merge repromptAdapter and noMatchRepromptAdapter to use the same types
export const repromptAdapter = createAdapter<VoiceTypes.Prompt<any>, NodeData.Reprompt>(
  (reprompt) => {
    const type = reprompt.voice === Constants.Voice.AUDIO ? RepromptType.AUDIO : RepromptType.TEXT;

    return {
      type,
      desc: reprompt.desc,
      voice: type === RepromptType.TEXT ? reprompt.voice : null,
      audio: type === RepromptType.TEXT ? null : reprompt.content,
      content: type === RepromptType.TEXT ? reprompt.content : '',
    };
  },
  (reprompt) => ({
    desc: reprompt.desc ?? undefined,
    voice: reprompt.type === RepromptType.AUDIO ? Constants.Voice.AUDIO : (reprompt.voice as Constants.Voice | undefined) ?? Constants.Voice.ALEXA,
    content: (reprompt.type === RepromptType.AUDIO ? reprompt.audio : reprompt.content) ?? '',
  })
);

export const noMatchRepromptAdapter = createAdapter<VoiceTypes.Prompt<any>, SpeakData>(
  (reprompt) =>
    reprompt.voice === Constants.Voice.AUDIO
      ? { url: reprompt.content, type: DialogType.AUDIO, id: cuid() }
      : { type: DialogType.VOICE, voice: reprompt.voice, content: reprompt.content, id: cuid() },
  (reprompt) => ({
    voice: reprompt.type === DialogType.AUDIO ? Constants.Voice.AUDIO : (reprompt.voice as Constants.Voice | undefined) ?? Constants.Voice.ALEXA,
    content: reprompt.type === DialogType.AUDIO ? reprompt.url : reprompt.content,
  })
);

export const noMatchAdapter = createAdapter<BaseNode.Utils.StepNoMatch<VoiceTypes.Prompt<any>>, NodeData.NoMatches>(
  ({ type = BaseNode.Utils.NoMatchType.REPROMPT, randomize, reprompts, pathName = 'No Match' }) => ({
    type,
    pathName,
    randomize,
    reprompts: noMatchRepromptAdapter.mapFromDB(reprompts),
  }),
  ({ type, randomize, reprompts, pathName }) => ({
    type,
    pathName,
    randomize,
    reprompts: noMatchRepromptAdapter.mapToDB(reprompts),
  })
);

export const defaultPortAdapter: PortsAdapter = {
  toDB: (ports) => ports.map(({ port, target, link }) => ({ type: port.label || '', target, id: port.id, data: link?.data })),
  fromDB: (ports, node) =>
    ports.map((port) => ({
      port: generateOutPort(node.nodeID, port, { label: port.type }),
      target: port.target,
    })),
};

export const getPortByLabel = (ports: { port: Port; target: string | null; link?: Link }[], label: string) =>
  ports.find(({ port }) => port.label === label);

export const chipsToIntentButtons = (chips?: Nullable<Button.Chip[]>): Nullable<Button.IntentButton[]> =>
  chips?.map(({ label: name }) => ({ name, type: Button.ButtonType.INTENT, payload: { intentID: null } })) ?? null;
