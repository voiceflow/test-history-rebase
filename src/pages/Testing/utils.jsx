import { parse } from 'html-parse-stringify';
import _ from 'lodash';
import React from 'react';

import { TestAction } from './constants';

const VALID_TAGS = new Set(['voice', 'prosody', 'break', 's', 'w', 'sub', 'say-as', 'phoneme', 'p', 'lang', 'emphasis', 'amazon:effect', 'text']);

export const recurse = (tag, index = 0) => {
  if (tag.type === 'text') {
    if (!tag.content.trim()) {
      return null;
    }
    return tag.content;
  }

  if (!VALID_TAGS.has(tag.name)) {
    return null;
  }

  if (tag.children && tag.children.length > 0) {
    const returnString = [];
    tag.children.forEach((t, i) => {
      returnString.push(recurse(t, i));
    });

    if (tag.name === 's') {
      return returnString;
    }

    if (tag.name === 'voice') {
      return (
        <React.Fragment key={index}>
          {tag.attrs.name !== '_DEFAULT' && (
            <>
              <span className="text-muted">{tag.attrs.name}</span>
              <br />
            </>
          )}
          {returnString}
        </React.Fragment>
      );
    }

    return (
      <span key={index} className="tag-wrap">
        <span className="tag-span">{tag.name}</span> {returnString}
      </span>
    );
  }

  return (
    <span key={index} className="tag-wrap tag-span">
      ({tag.name})
    </span>
  );
};

const getAudioMeta = (audio) =>
  new Promise((resolve, reject) => {
    if (!audio) return resolve(0);

    audio.addEventListener('error', reject);
    audio.addEventListener('loadedmetadata', (e) => {
      resolve(e.target.duration);
    });
  });

const newAudio = (src) => {
  if (!src) return null;

  let newSrc = src;
  if (newSrc.startsWith('soundbank://soundlibrary/')) {
    newSrc = `${src.replace('soundbank://soundlibrary/', 'https://d3qhmae9zx9eb.cloudfront.net/')}.mp3`;
  }

  return new Audio(newSrc);
};

export const getUserTestOutputs = async (trace, ending, state) => {
  const dom = [];
  let idx = 0;

  // eslint-disable-next-line no-restricted-syntax
  for (const block of trace) {
    if (block.diagram) {
      dom.push({
        debug: 'diagram',
        type: block.isExitFlow ? TestAction.EXIT_FLOW : TestAction.ENTER_FLOW,
        diagram: typeof block.diagram === 'object' ? block.diagram.diagram_id : block.diagram,
      });
    } else if (block.debug) {
      dom.push(block);
    }

    // eslint-disable-next-line no-continue
    if (!block.output) continue;

    const type = block.block;
    const parsed = parse(block.output)[0];

    if (idx === 0 && type === 'Choice' && ending) {
      const outputBlock = {
        node: block.line.id,
        type,
        delay: 500,
      };
      dom.push(outputBlock);
    }

    if (type === 'Speak') {
      // eslint-disable-next-line no-await-in-loop
      const results = await Promise.all(
        block.audio.map(async (audioFile) => {
          const audio = newAudio(audioFile);
          try {
            return {
              duration: await getAudioMeta(audio),
              audio,
            };
          } catch (err) {
            return {
              audioFile,
              duration: -1,
            };
          }
        })
      );

      parsed.children.forEach((child, idx) => {
        const audioData = results[idx];

        if (audioData.duration === -1) {
          dom.push({
            debug: 'audio',
            text: (
              <>
                Unable to play audio <b>{audioData.audioFile}</b>
              </>
            ),
            important: true,
          });
          return;
        }

        const outputBlock = {};
        if (child.name === 'audio') {
          outputBlock.text = 'Audio File';
        } else {
          outputBlock.text = recurse(child) || child.name;
        }

        outputBlock.audio = audioData.audio;
        outputBlock.delay = audioData.duration * 1000;

        outputBlock.node = block.line.id;
        outputBlock.audioType = child.name;
        outputBlock.type = type;
        outputBlock.isLast = !block.line.nextId;

        dom.push(outputBlock);
      });
    } else if (type === 'Stream') {
      const url = state.play.url;
      const audio = newAudio(url);
      const text = url.length > 40 ? `...${url.substr(-33)}` : url;
      // eslint-disable-next-line no-await-in-loop
      const duration = await getAudioMeta(audio);
      const outputBlock = {
        audio,
        delay: duration * 1000,
        audioType: 'stream',
        text,
        node: block.line.id,
        isLast: !block.line.NEXT,
        type,
      };
      dom.push(outputBlock);
    } else if (type === 'Choice' && idx > 0) {
      const outputBlock = {
        options: _.map(block.line.inputs, _.head),
        node: block.line.id,
        type,
      };
      dom.push(outputBlock);
    } else if (type === 'Interaction') {
      const outputBlock = {
        node: block.line.id,
        type,
      };
      dom.push(outputBlock);
    } else if (type === 'Flow') {
      const outputBlock = {
        node: block.line.id,
        isLast: !block.line.nextId,
        type,
      };
      dom.push(outputBlock);
    } else if (type === 'One Shot Intent') {
      const outputBlock = {
        node: block.line.id,
        type,
      };
      dom.push(outputBlock);
    } else {
      if (!_.isEmpty(parsed.children)) {
        // eslint-disable-next-line lodash/collection-return, lodash/collection-method-value, no-loop-func
        _.map(parsed.children, (child) => {
          const outputBlock = {
            text: child.children[0].children[0].content,
            node: block.line.id,
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
