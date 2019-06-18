import capitalize from 'lodash/capitalize';
import toLower from 'lodash/toLower';
import { parseUrl } from 'query-string';

export const getHumanizedAudioUrl = (src) => {
  const { url } = parseUrl(src);

  return url;
};

export const getStepName = (step, { row } = {}) => {
  if (!step) {
    return '';
  }

  switch (step.node_type || step.button_type) {
    case 'audio':
      return row ? step.audio_url : getHumanizedAudioUrl(step.audio_url);
    case 'text':
      return step.text;
    case 'api_request':
      return step.api_request_name;
    case 'reply':
      return step.required ? capitalize(step.name) : step.name;
    case 'else':
      return capitalize(step.name || 'else');
    default:
      return '';
  }
};

export const sortUserReplies = (a, b) => {
  const typeA = toLower(a.button_type);
  const typeB = toLower(b.button_type);

  if (typeA > typeB) {
    return -1;
  }

  if (typeA < typeB) {
    return 1;
  }

  return a.id - b.id;
};

export const getStepIcon = (step) => {
  if (!step) {
    return '';
  }

  switch (step.node_type || step.button_type) {
    case 'audio':
      return 'audio';
    case 'text':
      return 'alexa';
    case 'api_request':
      return 'code';
    case 'reply':
      return 'user-reply';
    case 'else':
      return 'else';
    default:
      return '';
  }
};

export const getAlexaReplyIconAndGroupBasedOnSiblings = (step, prevStep, nextStep) => {
  const icon = getStepIcon(step);
  const nextIcon = getStepIcon(nextStep);
  const prevIcon = getStepIcon(prevStep);

  return {
    icon: prevIcon === icon ? null : icon,
    typeGroup: nextIcon === icon,
    prevTypeGroup: prevIcon === icon,
  };
};

export const isStepConnected = (step) => {
  if (!step) {
    return false;
  }

  if (step.button_type) {
    return !!step.connected_node_group_id || !!step.connected_node_id;
  }

  return !!step.linked_to_block_id || !!step.linked_to_node_id;
};

export const isBlockNotEmpty = (block) => {
  switch (block && block.block_type) {
    case 'default':
      return !!block.userRepliesIds.length || !!block.alexaRepliesIds.length;
    case 'audio_player':
      return !!block.audio_player_info.stream_url.length !== 0 || !!block.audio_player_info.playback_paused_handler_id;
    case 'condition':
      return !!block.conditionsIds.length;
    case 'quiz':
      return !!block.quizQuestionsIds.length;
    case 'purchase':
      return !!block.project_product_id;
    default:
      return false;
  }
};

export const getProductIdsWithinBlocks = (blocks, products, { withConsumables } = {}) => {
  const cache = {};
  const values = Object.values(blocks || {});

  if (!values.length) {
    return [];
  }

  values.forEach(({ project_product_id: productId }) => {
    const product = products[productId];

    if (product && (product.purchaseType !== 'consumable' || withConsumables)) {
      cache[productId] = productId;
    }
  });

  return Object.values(cache);
};
