import { entity } from '@/postgres/entity/entity.fixture';
import { intent } from '@/postgres/intent/intent.fixture';
import { persona } from '@/postgres/persona/persona.fixture';
import { response } from '@/postgres/response/response.fixture';
import { variable } from '@/postgres/variable/variable.fixture';

import { NodeType } from '../../node/node-type.enum';
import type { Port } from '../../port/port.dto';
import { nextPort } from '../../port/port.fixture';
import { PortType } from '../../port/port-type.enum';
import type { ListenStep } from './listen.step';
import type { AutomaticReprompt, BaseListenData, ButtonListenItem, IntentListenItem, NoMatch } from './listen-data.dto';
import { ListenType } from './listen-type.enum';

const noReply: BaseListenData['noReply'] = {
  limit: 3,
  repromptID: response.id,
  showPort: false,
};

const noMatch: NoMatch['noMatch'] = {
  repromptID: response.id,
  showPort: false,
};

const automaticReprompt: AutomaticReprompt['automaticReprompt'] = {
  personaOverrideID: persona.id,
  rules: [{ id: 'rule-1', value: ['user must not talk about fight club'] }],
  exitScenarios: [{ id: 'exit-scenario-1', value: ['exit if the user is upset'] }],
  showExitPort: true,
};

const baseListenStep = {
  id: 'listen-step-1',
  parentID: 'block-1',
  type: NodeType.STEP__LISTEN__V3,

  ports: {
    [PortType.NEXT]: nextPort,
    [PortType.EXIT]: { key: PortType.EXIT, link: null },
    [PortType.NO_MATCH]: { key: PortType.NO_MATCH, link: null },
    [PortType.NO_REPLY]: { key: PortType.NO_REPLY, link: null },
  },
} satisfies Partial<ListenStep>;

/* listen for button */

const buttonItem: ButtonListenItem = {
  id: 'button-1',
  label: ['click me'],
};
const buttonPort: Port = {
  key: buttonItem.id,
  link: null,
};

export const buttonListenStep: ListenStep = {
  ...baseListenStep,

  data: {
    type: ListenType.BUTTON,
    listenForTriggers: true,
    buttons: [buttonItem],
    automaticReprompt,
    noReply,
    noMatch,
  },

  ports: {
    ...baseListenStep.ports,
    [buttonPort.key]: buttonPort,
  },
};

/* listen for entity */

export const entityListenStep: ListenStep = {
  ...baseListenStep,

  data: {
    type: ListenType.ENTITY,
    listenForTriggers: true,
    entities: [
      {
        id: 'entity-1',
        entityID: entity.id,
        variableID: variable.id,
        repromptID: response.id,
        isRequired: true,
        inlineInput: { placeholder: ['type here'] },
      },
    ],
    automaticReprompt,
    noReply,
    noMatch,
  },
};

/* listen for intent */

const intentItem: IntentListenItem = {
  id: 'intent-1',
  intentID: intent.id,
  button: ['click me'],
};
const intentPort: Port = {
  key: intentItem.id,
  link: null,
};

export const intentListenStep: ListenStep = {
  ...baseListenStep,

  data: {
    type: ListenType.INTENT,
    listenForTriggers: true,
    automaticReprompt,
    noReply,
    noMatch,
    intents: [intentItem],
  },

  ports: {
    ...baseListenStep.ports,
    [intentPort.key]: intentPort,
  },
};

/* listen for raw */

export const rawListenStep: ListenStep = {
  ...baseListenStep,

  data: {
    type: ListenType.RAW,
    variableID: variable.id,
    noReply,
    listenForTriggers: false,
  },
};
