import cloneDeep from 'lodash/cloneDeep';
import React from 'react';

const FAVORITE_SECTION_MAX = 3;

const BLOCK_TYPES = {
  speak: {
    text: 'Speak',
    type: 'speak',
    icon: <i className="fas fa-comment" />,
    tip: 'Tell Alexa what to say, or play audio clips',
  },
  choice: {
    text: 'Choice',
    type: 'choice',
    icon: <i className="fas fa-project-diagram" />,
    tip: 'Listen for the user to make a choice from a list of options you set',
  },
  set: {
    text: 'Set',
    type: 'set',
    icon: <i className="fas fa-code" />,
    tip: 'Set the value of a variable, or many variables at once',
  },
  if: {
    text: 'If',
    type: 'if',
    icon: <i className="fas fa-code-branch" />,
    tip: 'Set conditions that activate paths only when true',
  },
  capture: {
    text: 'Capture',
    type: 'capture',
    icon: <i className="fas fa-microphone" />,
    tip: 'Capture what the user says into a variable',
  },
  random: {
    text: 'Random',
    type: 'random',
    icon: <i className="fas fa-random" />,
    tip: 'Choose randomly from a set number of paths',
  },
  interaction: {
    text: 'Interaction',
    type: 'interaction',
    icon: <i className="fas fa-user-alt" />,
    tip: 'Select choices and capture slot values from user input',
  },
  intent: {
    text: 'Intent',
    type: 'intent',
    icon: <i className="fas fa-arrow-alt-from-left" />,
    tip: 'Handle intents, from within the skill and upon skill launch with CanFulfillIntent)',
  },
  stream: {
    text: 'Stream',
    type: 'stream',
    icon: <i className="fas fa-play" />,
    tip: 'Stream long audio files & URLs for the user',
  },
  integrations: {
    text: 'Integrations',
    type: 'integrations',
    icon: <i className="fas fa-globe" />,
    tip: 'Integrate external services into your skill',
  },
  flow: {
    text: 'Flow',
    type: 'flow',
    icon: <i className="fas fa-clone" />,
    tip: 'Organize your project into manageable sections or perform computations',
  },
  code: {
    text: 'Code',
    type: 'code',
    icon: <i className="fab fa-js-square" />,
    tip: 'Modify Variables directly with Code',
  },
  exit: {
    text: 'Exit',
    type: 'exit',
    icon: <i className="fas fa-sign-out" />,
    tip: 'End the skill on the current flow',
  },
  combine: {
    text: 'Combine',
    type: 'combine',
    icon: <i className="fas fa-compress-alt" />,
    tip: 'Combine Different Audio Files to bypass Amazon 5 Audio limit',
  },
  comment: {
    text: 'Comment',
    type: 'comment',
    icon: <i className="far fa-comment-alt" />,
    tip: 'Add notes to your diagram',
  },
  card: { text: 'Card', type: 'card', icon: <i className="fas fa-poll-h" />, tip: 'Tell Alexa to show a card' },
  display: {
    text: 'Display',
    type: 'display',
    icon: <i className="fas fa-image" />,
    tip: 'Show a Multimodal Display on the screen using APL',
  },
  permission: {
    text: 'Permission',
    type: 'permission',
    icon: <i className="fas fa-lock" />,
    tip: 'Ask users to enable permissions (User Info, Reminders, etc.)',
  },
  permissions: {
    text: 'User Info',
    type: 'permissions',
    icon: <i className="fas fa-user" />,
    tip: 'Get User Information and check Permissions',
  },
  payment: {
    text: 'Payment',
    type: 'payment',
    icon: <i className="fas fa-dollar-sign" />,
    tip: 'Request payment from user',
  },
  cancel: {
    text: 'Cancel Payment',
    type: 'cancel',
    icon: <i className="fas fa-user-minus" />,
    tip: "Refund a purchase or cancel an user's subscription",
  },
  reminder: {
    text: 'Reminder',
    type: 'reminder',
    icon: <i className="fas fa-bell" />,
    tip: 'Send a remind to the user in a set amount of time',
  },
};

const SECTIONS = [
  {
    title: 'basic',
    items: [BLOCK_TYPES.speak, BLOCK_TYPES.choice],
  },
  {
    title: 'logic',
    items: [BLOCK_TYPES.set, BLOCK_TYPES.if, BLOCK_TYPES.capture, BLOCK_TYPES.random],
  },
  {
    title: 'advanced',
    items: [
      BLOCK_TYPES.interaction,
      BLOCK_TYPES.intent,
      BLOCK_TYPES.stream,
      BLOCK_TYPES.integrations,
      BLOCK_TYPES.flow,
      BLOCK_TYPES.code,
      BLOCK_TYPES.exit,
    ],
  },
  {
    title: 'visuals',
    items: [BLOCK_TYPES.card, BLOCK_TYPES.display],
  },
  {
    title: 'user',
    items: [BLOCK_TYPES.permission, BLOCK_TYPES.permissions, BLOCK_TYPES.payment, BLOCK_TYPES.cancel, BLOCK_TYPES.reminder],
  },
];

const getSections = (type_counter) => {
  const sections = cloneDeep(SECTIONS);

  // Check whether we want a favourites section
  let sortable = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const type in type_counter) {
    if (type !== 'god' && type !== 'comment' && type !== 'combine' && type !== 'command' && type_counter[type] >= 3) {
      sortable.push([type, type_counter[type]]);
    }
  }

  sortable.sort((a, b) => {
    return b[1] - a[1];
  });
  sortable = sortable.slice(0, Math.min(FAVORITE_SECTION_MAX, sortable.length));

  if (sortable.length > 0) {
    const favorite_section = {
      title: 'favorites',
      items: [],
    };

    sortable.forEach(([key]) => BLOCK_TYPES[key]);

    sections.unshift(favorite_section);
  }

  return sections;
};

const getBlocks = () => {
  const blocks = [];
  getSections().forEach((section) => {
    if (Array.isArray(section.items)) {
      section.items.forEach((block) => blocks.push(block));
    }
  });

  return blocks;
};

const checkBlockDisabledLive = (live_mode, block_type) => {
  return (
    live_mode === true &&
    (block_type === 'choice' ||
      block_type === 'intent' ||
      block_type === 'command' ||
      block_type === 'interaction' ||
      block_type === 'permission' ||
      block_type === 'permissions')
  );
};

export { getSections, getBlocks, checkBlockDisabledLive };
