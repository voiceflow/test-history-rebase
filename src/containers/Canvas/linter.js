function setLinterAndReturnUpdateFlag(node, n_old_warnings, new_warnings) {
  node.linter = [...new_warnings];

  if ((n_old_warnings === 0 && new_warnings.length > 0) || (n_old_warnings > 0 && new_warnings.length === 0)) {
    return true;
  }
  return false;
}

const interactionBlockLinter = (node, platform) => {
  const INTERACTION_BLOCK_LINTER_WARNINGS = {
    missing_intent: 'You are missing an intent in one or more of your choices',
  };

  const active_warnings = new Set();

  const n = node.linter.length;
  const extras = node.extras[platform];

  // eslint-disable-next-line no-restricted-syntax
  for (const choice in Object.values(extras.choices)) {
    if (!choice.intent) {
      active_warnings.add(INTERACTION_BLOCK_LINTER_WARNINGS.missing_intent);
      break;
    }
  }

  return setLinterAndReturnUpdateFlag(node, n, active_warnings);
};
const intentBlockLinter = (node, platform) => {
  const INTENT_BLOCK_LINTER_WARNINGS = {
    missing_intent: 'You have not selected an intent for this block to handle',
  };

  const active_warnings = new Set();

  const n = node.linter.length;
  const extras = node.extras[platform];

  if (extras && !extras.intent) {
    active_warnings.add(INTENT_BLOCK_LINTER_WARNINGS.missing_intent);
  }

  return setLinterAndReturnUpdateFlag(node, n, active_warnings);
};

const commandBlockLinter = (node, platform) => {
  const COMMAND_BLOCK_LINTER_WARNINGS = {
    missing_intent: 'You have not selected an intent for this block to handle',
  };

  const active_warnings = new Set();

  const n = node.linter.length;
  const extras = node.extras[platform];

  if (extras && !extras.intent) {
    active_warnings.add(COMMAND_BLOCK_LINTER_WARNINGS.missing_intent);
  }

  return setLinterAndReturnUpdateFlag(node, n, active_warnings);
};

const Linter = {
  interaction: interactionBlockLinter,
  intent: intentBlockLinter,
  command: commandBlockLinter,
};

export default Linter;
