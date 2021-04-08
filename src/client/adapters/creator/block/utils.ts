import { Voice } from '@voiceflow/alexa-types';
import { DiagramNode as DBNode, Port as DBPort } from '@voiceflow/api-sdk';
import { NoMatches, Prompt } from '@voiceflow/general-types';
import cuid from 'cuid';

import { createAdapter, createSimpleAdapter } from '@/client/adapters/utils';
import { DialogType, RepromptType } from '@/constants';
import { Link, LinkData, Node, NodeData, Port } from '@/models';
import { SpeakData } from '@/models/Speak';

import { generateOutPort } from '../utils';

export const createBlockAdapter = createSimpleAdapter;

export type PortsAdapter<D = unknown> = {
  toDB: (ports: { port: Port; target: string | null; link?: Link }[], node: Node, data: D) => DBPort<LinkData>[];
  fromDB: (ports: DBPort<LinkData>[], node: DBNode) => { port: Port; target: string | null }[];
};

// TODO: refactor merge repromptAdapter and noMatchRepromptAdapter to use the same types
export const repromptAdapter = createAdapter<Prompt<any>, NodeData.Reprompt>(
  (reprompt) => {
    const type = reprompt.voice === Voice.AUDIO ? RepromptType.AUDIO : RepromptType.TEXT;

    return {
      type,
      voice: type === RepromptType.TEXT ? reprompt.voice : null,
      audio: type === RepromptType.TEXT ? null : reprompt.content,
      content: type === RepromptType.TEXT ? reprompt.content : '',
    };
  },
  (reprompt) => ({
    voice: reprompt.type === RepromptType.AUDIO ? Voice.AUDIO : (reprompt.voice as Voice | undefined) ?? Voice.ALEXA,
    content: (reprompt.type === RepromptType.AUDIO ? reprompt.audio : reprompt.content) ?? '',
  })
);

export const noMatchRepromptAdapter = createAdapter<Prompt<any>, SpeakData>(
  (reprompt) =>
    reprompt.voice === Voice.AUDIO
      ? { url: reprompt.content, type: DialogType.AUDIO, id: cuid() }
      : { type: DialogType.VOICE, voice: reprompt.voice, content: reprompt.content, id: cuid() },
  (reprompt) => ({
    voice: reprompt.type === DialogType.AUDIO ? Voice.AUDIO : (reprompt.voice as Voice | undefined) ?? Voice.ALEXA,
    content: reprompt.type === DialogType.AUDIO ? reprompt.url : reprompt.content,
  })
);

export const noMatchAdapter = createAdapter<NoMatches<any>, NodeData.NoMatches>(
  ({ randomize, reprompts }) => ({
    randomize,
    reprompts: noMatchRepromptAdapter.mapFromDB(reprompts),
  }),
  ({ randomize, reprompts }) => ({
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
