import { Constants } from '@voiceflow/alexa-types';
import { Button, Models as BaseModels, Node as BaseNode } from '@voiceflow/base-types';
import { Nullable, Utils } from '@voiceflow/common';
import { Types as VoiceTypes } from '@voiceflow/voice-types';
import _pickBy from 'lodash/pickBy';

import { RepromptType } from '../../../constants';
import { Link, LinkData, Node, NodeData, Port } from '../../../models';
import { PathPoint, PathPoints } from '../../../types';
import { createAdapter, createSimpleAdapter } from '../../utils';
import { generateOutPort } from '../utils';

export const createBlockAdapter = createSimpleAdapter;

export interface PortsAdapter<D = unknown> {
  toDB: (ports: { port: Port; target: string | null; link?: Link }[], node: Node, data: D) => BaseModels.BasePort<LinkData>[];
  fromDB: (ports: BaseModels.BasePort<LinkData>[], node: BaseModels.BaseDiagramNode) => { port: Port; target: string | null }[];
}

export const voiceRepromptAdapter = createAdapter<VoiceTypes.Prompt<any>, NodeData.VoicePrompt>(
  (reprompt) => {
    const type = reprompt.voice === Constants.Voice.AUDIO ? RepromptType.AUDIO : RepromptType.TEXT;

    return {
      id: Utils.id.cuid.slug(),
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

export const voiceNoMatchAdapter = createAdapter<BaseNode.Utils.StepNoMatch<VoiceTypes.Prompt<any>>, NodeData.VoiceNoMatches>(
  ({ type = BaseNode.Utils.NoMatchType.REPROMPT, randomize, reprompts, pathName = 'No Match' }) => ({
    type,
    pathName,
    randomize,
    reprompts: voiceRepromptAdapter.mapFromDB(reprompts),
  }),
  ({ type, randomize, reprompts, pathName }) => ({
    type,
    pathName,
    randomize,
    reprompts: voiceRepromptAdapter.mapToDB(reprompts),
  })
);

const removePointsFalseyValues = (points?: PathPoints) =>
  points?.map((pathPoint): PathPoint => ({ ..._pickBy<PathPoint>(pathPoint, (value) => value === true), point: pathPoint.point }));

export const defaultPortAdapter: PortsAdapter = {
  toDB: (ports) =>
    ports.map(({ port, target, link }) => {
      const linkData: LinkData = {
        ...link?.data,
        points: link?.data?.points && removePointsFalseyValues(link?.data?.points),
      };

      return { type: port.label || '', target, id: port.id, data: linkData };
    }),
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

export const choiceAdapter = createAdapter<BaseNode.Interaction.Choice, NodeData.InteractionChoice>(
  ({ goTo = null, intent, action = BaseNode.Interaction.ChoiceAction.PATH, mappings = [] }) => ({
    id: Utils.id.cuid.slug(),
    goTo,
    intent,
    action,
    mappings,
  }),
  ({ goTo, intent, action, mappings }) => ({
    goTo: goTo ?? undefined,
    intent: intent ?? '',
    action,
    mappings,
  })
);
