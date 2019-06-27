import { parse } from 'html-parse-stringify';
import _ from 'lodash';
import { RegexVariables } from 'utils/variable';

export const getDiagramIntents = (diagramEngine, results, testing_info) => {
  const detected_intents = [];
  const diagram_intents = _.some(diagramEngine.getDiagramModel().getNodes(), (node) => {
    if (node.extras.type === 'intent') {
      return {
        id: node.id,
        google_intent: node.extras.google,
        alexa_intent: node.extras.alexa,
      };
    }
  });
  _.forEach(results, (result) => {
    const intent_name = result.name;
    const detected_slots = result.slots;
    const slot_mapping = testing_info.slot_mappings[intent_name] || [];
    const formatted_slots = {};

    slot_mapping.forEach((slot, i) => {
      if (detected_slots) {
        formatted_slots[slot.name] = {
          value: detected_slots[i],
        };
      }
    });
    if (intent_name) {
      detected_intents.push({
        intent: intent_name,
        slots: formatted_slots,
      });
    }
  });
  return {
    detected_intents,
    diagram_intents,
  };
};

const getAudioMeta = (audio) => {
  return new Promise((resolve) => {
    audio.addEventListener('loadedmetadata', (e) => {
      resolve(e.target.duration);
    });
  });
};

export const getUserTestOutputs = async (data, trace, res, variableMapping) => {
  const dom = [];
  let delay = 0;
  if (data.input) {
    const outputBlock = {
      self: data.input,
      delay,
    };
    dom.push(outputBlock);
  }
  let idx = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const block of trace) {
    if (block.isExitFlow) {
      delay += 1000;
      const outputBlock = {
        node: trace[idx - 1].line.id,
        delay,
      };
      if (block.diagram) outputBlock.diagram = block.diagram;
      dom.push(outputBlock);
      // eslint-disable-next-line no-continue
      continue;
    }
    // eslint-disable-next-line no-continue
    if (!block.output) continue;
    const type = block.block;
    const parsed = parse(block.output)[0];
    if (idx === 0 && type === 'Choice' && res.ending) {
      const outputBlock = {
        node: block.line.id,
        diagram: !_.isEmpty(res.diagrams) && _.last(res.diagrams).id,
        type,
        delay,
      };
      delay += 500;
      dom.push(outputBlock);
    }
    if (type === 'Speak') {
      delay += 1000;
      // eslint-disable-next-line no-await-in-loop
      const results = await Promise.all(
        block.audio.map(async (audioFile) => {
          const audio = new Audio(audioFile);
          return {
            duration: await getAudioMeta(audio),
            audio,
          };
        })
      );
      let children = [];
      if (parsed.children.length > 0) {
        _.map(parsed.children, (c) => {
          if (c.children.length > 0) {
            children = children.concat(c.children);
          } else {
            children = children.concat(c);
          }
        });
      }
      // eslint-disable-next-line lodash/collection-return, lodash/collection-method-value, no-loop-func
      let audioMappingIdx = 0;
      let audioType = children[0].name === 'audio' ? 'audio' : 'speak';
      _.map(children, (child, idx) => {
        const outputBlock = {};
        if (child.name === 'audio') {
          outputBlock.text = 'Audio File';
        } else {
          const replaced = RegexVariables(child.content || child.name, variableMapping);
          outputBlock.text = replaced;
        }
        let duration = delay;
        outputBlock.delay = delay;
        if (idx === 0) {
          outputBlock.audio = results[audioMappingIdx].audio;
          duration = results[audioMappingIdx].duration * 1000;
          delay += duration;
        }
        if (audioType === 'audio' && child.name !== 'audio') {
          audioType = 'speak';
          audioMappingIdx++;
          outputBlock.audio = results[audioMappingIdx].audio;
          duration = results[audioMappingIdx].duration * 1000;
          delay += duration;
        } else if (audioType === 'speak' && child.name === 'audio') {
          audioType = 'audio';
          audioMappingIdx++;
          outputBlock.audio = results[audioMappingIdx].audio;
          duration = results[audioMappingIdx].duration * 1000;
          delay += duration;
        }
        outputBlock.node = block.line.id;
        outputBlock.audioType = child.type === 'text' || child.type === 'speak' || (child.name === 'audio' && 'audio');
        outputBlock.type = type;
        outputBlock.isLast = !block.line.nextId;
        dom.push(outputBlock);
      });
    } else if (type === 'Stream') {
      delay += 1000;
      // eslint-disable-next-line no-await-in-loop
      const results = await Promise.all(
        // eslint-disable-next-line sonarjs/no-identical-functions
        block.audio.map(async (audioFile) => {
          const audio = new Audio(audioFile);
          return {
            duration: await getAudioMeta(audio),
            audio,
          };
        })
      );
      const duration = results[0].duration * 1000;
      const outputBlock = {
        audio: results[0].audio,
        text: 'Streaming',
        node: block.line.id,
        isLast: !block.line.nextId,
        delay,
        type,
      };
      dom.push(outputBlock);
      const outputBlockChoices = {
        options: [
          {
            label: 'Resume',
            val: 'AMAZON.ResumeIntent',
          },
          {
            label: 'Pause',
            val: 'AMAZON.PauseIntent',
          },
          {
            label: 'Next',
            val: 'AMAZON.NextIntent',
          },
          {
            label: 'Previous',
            val: 'AMAZON.PreviousIntent',
          },
        ],
        node: block.line.id,
        isLast: !block.line.nextId,
        delay,
        type,
      };
      delay += duration;
      dom.push(outputBlockChoices);
    } else if (type === 'Choice' && idx > 0) {
      const outputBlock = {
        options: _.map(block.line.inputs, _.head),
        node: block.line.id,
        type,
        delay,
      };
      dom.push(outputBlock);
    } else if (type === 'Flow') {
      const outputBlock = {
        node: block.line.id,
        diagram: block.line.diagram_id,
        isLast: !block.line.nextId,
        type,
        delay,
      };
      delay += 500;
      dom.push(outputBlock);
    } else if (type === 'One Shot Intent') {
      const outputBlock = {
        node: block.line.id,
        diagram: _.last(block.diagrams).id,
        type,
        delay,
      };
      delay += 500;
      dom.push(outputBlock);
    } else {
      if (!_.isEmpty(parsed.children)) {
        // eslint-disable-next-line lodash/collection-return, lodash/collection-method-value, no-loop-func
        _.map(parsed.children, (child) => {
          const outputBlock = {
            text: child.children[0].children[0].content,
            node: block.line.id,
            delay,
            type: 'system',
            isLast: !block.line.nextId,
          };
          dom.push(outputBlock);
        });
      }
    }
    idx++;
  }
  return dom;
};
