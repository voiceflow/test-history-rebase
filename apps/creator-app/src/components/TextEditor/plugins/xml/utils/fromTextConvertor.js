import { genKey } from 'draft-js';
import _toLower from 'lodash/toLower';

import { SlateEditorAPI } from '@/components/SlateEditable';

import { EntityType, Mutability } from '../../constants';
import getOpenTagText from './getOpenTagText';

const SPACE = ' ';

// used for replacing characters in HTML
const REGEX_CR = /\r/g;
const REGEX_LF = /\n/g;
const REGEX_ZWS = /&#8203;?/g;
const REGEX_NBSP = /&nbsp;/g;
const REGEX_CARRIAGE = /&#13;?/g;
const REGEX_LEADING_LF = /^\n/g;
const REGEX_SINGLE_TAG = /<([^ />]+)([^>]+?)\/>/g;

const createSupportedOpenTagsRegex = (tags) =>
  new RegExp(`(<)(?!\\b(${tags.map((tag) => `${tag}`).join('|')})\\b|/)`, 'g');
const createSupportedCloseTagsRegex = (tags) =>
  new RegExp(`(</)(?!\\b(${tags.map((tag) => `${tag}`).join('|')})\\b|/)`, 'g');

const removeFunkyCharactersAndUnsupportedTags = (value, { tags, newLinesAllowed }) => {
  if (!value) return '';

  const text = typeof value === 'string' ? value : SlateEditorAPI.serialize(value);
  const formattedValue = text
    .replace(REGEX_NBSP, SPACE)
    .replace(REGEX_CARRIAGE, '')
    .replace(REGEX_ZWS, '')
    .replace(REGEX_SINGLE_TAG, '<$1$2></$1>')
    .replace(createSupportedOpenTagsRegex(Object.keys(tags)), '&lt;')
    .replace(createSupportedCloseTagsRegex(Object.keys(tags)), '&lt;/');

  if (!newLinesAllowed) {
    formattedValue.replace(REGEX_CR, '');
  } else {
    formattedValue.replace(REGEX_CR, '\n');
  }

  return formattedValue;
};

function getSafeBodyFromHTML(html) {
  let doc;
  let root = null;

  // Provides a safe context
  if (document.implementation && document.implementation.createHTMLDocument) {
    doc = document.implementation.createHTMLDocument('foo');
    doc.documentElement.innerHTML = html;
    [root] = doc.getElementsByTagName('body');
  }

  return root;
}

const fromTextConvertor =
  () =>
  ({ tags, newLinesAllowed }) =>
  (next) =>
  (value, { cursor, entityMap, entityRanges }) => {
    const html = removeFunkyCharactersAndUnsupportedTags(value, { tags, newLinesAllowed });
    const safeBody = getSafeBodyFromHTML(html);
    let nextCursor = cursor;

    if (!safeBody) {
      return next(value, { cursor: nextCursor, entityMap, entityRanges });
    }

    const processTextNode = (node) => {
      let { textContent } = node;
      let addedText = '';

      const trimmedText = textContent.trim();

      // If we are not in a pre block and the trimmed content is empty, normalize to a single space.
      if (trimmedText === '') {
        textContent = ' ';
      }

      // Trim leading line feed, which is invisible in HTML
      textContent = textContent.replace(REGEX_LEADING_LF, '\n ');

      if (!newLinesAllowed) {
        // Can't use empty string because MSWord
        textContent = textContent.replace(REGEX_LF, SPACE);
      }

      addedText = next(textContent, { cursor: nextCursor, entityMap, entityRanges, withoutTrim: true }); // eslint-disable-line callback-return

      nextCursor += addedText.length;

      return addedText;
    };

    const processTagNode = (node, nodeName) => {
      const { isSingle, attributes: validAttributes } = tags[nodeName] ?? {};

      const attributes = [...(node.attributes || [])]
        .filter((attr) => !!validAttributes[_toLower(attr.name)])
        .reduce((acc, attr) => Object.assign(acc, { [_toLower(attr.name)]: attr.value }), {});

      let addedText = getOpenTagText(nodeName, isSingle, attributes);

      if (!tags[nodeName]) {
        return processNodes(node.childNodes);
      }

      const key = genKey();
      const closeKey = genKey();

      entityMap[key] = {
        type: EntityType.XML_OPEN_TAG,
        data: {
          key,
          tag: nodeName,
          text: addedText,
          isSingle,
          linkedKey: isSingle ? null : closeKey,
          attributes,
        },
        mutability: Mutability.IMMUTABLE,
      };

      entityRanges.push({ key, offset: nextCursor, length: addedText.length });

      nextCursor += addedText.length;

      if (isSingle) {
        return addedText;
      }

      addedText += processNodes(node.childNodes);

      const closeTag = `</${nodeName}>`;

      entityMap[closeKey] = {
        type: EntityType.XML_CLOSE_TAG,
        data: {
          key: closeKey,
          tag: nodeName,
          text: closeTag,
          linkedKey: key,
        },
        mutability: Mutability.IMMUTABLE,
      };

      entityRanges.push({
        key: closeKey,
        offset: nextCursor,
        length: closeTag.length,
      });

      nextCursor += closeTag.length;

      return `${addedText}${closeTag}`;
    };

    const processNode = (text, node) => {
      const nodeName = node.nodeName.toLowerCase();

      const addedText = nodeName === '#text' ? processTextNode(node) : processTagNode(node, nodeName);

      return text + addedText;
    };

    const processNodes = (nodes, text = '') => [...nodes].reduce(processNode, text);

    return processNodes(safeBody.childNodes);
  };

export default fromTextConvertor;
