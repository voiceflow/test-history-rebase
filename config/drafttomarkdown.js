const TRAILING_WHITESPACE = /[ \u0020\t]*$/;

// This escapes some markdown but there's a few cases that are TODO -
// - List items
// - Back tics  (see https://github.com/Rosey/markdown-draft-js/issues/52#issuecomment-388458017)
// - Complex markdown, like links or images. Not sure it's even worth it, because if you're typing
// that into draft chances are you know its markdown and maybe expect it convert? :/
// const MARKDOWN_STYLE_CHARACTERS = /(\*|_|~|\\|'|`)/;

// I hate this a bit, being outside of the function’s scope
// but can’t think of a better way to keep track of how many ordered list
// items were are on, as draft doesn’t explicitly tell us in the raw object 😢.
// This is a hash that will be assigned values based on depth, so like
// orderedListNumber[0] = 1 would mean that ordered list at depth 0 is on number 1.
// orderedListNumber[0] = 2 would mean that ordered list at depth 0 is on number 2.
// This is so we have the right number of numbers when doing a list, eg
// 1. Item One
// 2. Item two
// 3. Item three
// And so on.

let orderedListNumber = {};
let previousOrderedListDepth = 0;

const _escape = function(word) {
  if (typeof word === 'string') {
    word = word
      .replace(/"/g, '"')
      .replace(/'/g, '\'')
      .replace(/[\u2018\u2019]/g, '\'')
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/&/g, 'ampersand')
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    return word;
  }
  if (typeof word === 'number') {
    return word;
  }
  if (typeof word === 'boolean') {
    return word;
  }
  throw new Error(`received invalid type ${typeof word}`);
};

// A map of draftjs block types -> markdown open and close characters
// Both the open and close methods must exist, even if they simply return an empty string.
// They should always return a string.
const StyleItems = {};

// A map of draftjs entity types -> markdown open and close characters
// entities are different from block types because they have additional data attached to them.
// an entity object is passed in to both open and close, in case it's needed for string generation.
//
// Both the open and close methods must exist, even if they simply return an empty string.
// They should always return a string.
const EntityItems = {};

// Bit of a hack - we normally want a double newline after a block,
// but for list items we just want one (unless it's the _last_ list item in a group.)
const SingleNewlineAfterBlock = ['unordered-list-item', 'ordered-list-item'];

function isEmptyBlock(block) {
  return block.text.length === 0 && block.entityRanges.length === 0 && Object.keys(block.data || {}).length === 0;
}

/**
 * Generate markdown for a single block javascript object
 * DraftJS raw object contains an array of blocks, which is the main "structure"
 * of the text. Each block = a new line.
 *
 * @param {Object} block - block to generate markdown for
 * @param {Number} index - index of the block in the blocks array
 * @param {Object} rawDraftObject - entire raw draft object (needed for accessing the entityMap)
 * @param {Object} options - additional options passed in by the user calling this method.
 *
 * @return {String} markdown string
 * */
function renderBlock(block, index, rawDraftObject, options) {
  const openInlineStyles = [];
  let markdownToAdd = [];
  let markdownString = '';
  const customStyleItems = options.styleItems || {};
  const customEntityItems = options.entityItems || {};

  let { type } = block;

  // draft-js emits empty blocks that have type set… don’t style them unless the user wants to preserve new lines
  // (if newlines are preserved each empty line should be "styled" eg in case of blockquote we want to see a blockquote.)
  // but if newlines aren’t preserved then we'd end up having double or triple or etc markdown characters, which is a bug.
  if (isEmptyBlock(block) && !options.preserveNewlines) {
    type = 'unstyled';
  }

  // Render main block wrapping element
  if (customStyleItems[type] || StyleItems[type]) {
    if (type === 'unordered-list-item' || type === 'ordered-list-item') {
      markdownString += ' '.repeat(block.depth * 4);
    }

    if (type === 'ordered-list-item') {
      orderedListNumber[block.depth] = orderedListNumber[block.depth] || 1;
      markdownString += (customStyleItems[type] || StyleItems[type]).open(block, orderedListNumber[block.depth]);
      orderedListNumber[block.depth]++;

      // Have to reset the number for orderedListNumber if we are breaking out of a list so that if
      // there's another nested list at the same level further down, it starts at 1 again.
      // COMPLICATED 😭
      if (previousOrderedListDepth > block.depth) {
        orderedListNumber[previousOrderedListDepth] = 1;
      }

      previousOrderedListDepth = block.depth;
    } else {
      orderedListNumber = {};
      markdownString += (customStyleItems[type] || StyleItems[type]).open(block);
    }
  }

  // Render text within content, along with any inline styles/entities
  Array.from(block.text).some((character, characterIndex) => {
    // Close any entity tags that need closing
    block.entityRanges.forEach((range, rangeIndex) => {
      if (range.offset + range.length === characterIndex) {
        const entity = rawDraftObject.entityMap[range.key];
        if (customEntityItems[entity.type] || EntityItems[entity.type]) {
          if (entity.type === '{mention') {
            markdownString = markdownString.slice(0, -1);
          }
          markdownString += (customEntityItems[entity.type] || EntityItems[entity.type]).close(entity);
        }
      }
    });

    // Close any inline tags that need closing
    openInlineStyles.forEach((style, styleIndex) => {
      if (style.offset + style.length === characterIndex) {
        if (customStyleItems[style.style] || StyleItems[style.style]) {
          var styleIndex = openInlineStyles.indexOf(style);
          // Handle nested case - close any open inline styles before closing the parent
          if (styleIndex > -1 && styleIndex !== openInlineStyles.length - 1) {
            for (var i = openInlineStyles.length - 1; i !== styleIndex; i--) {
              var styleItem = customStyleItems[openInlineStyles[i].style] || StyleItems[openInlineStyles[i].style];
              if (styleItem) {
                var trailingWhitespace = TRAILING_WHITESPACE.exec(markdownString);
                markdownString = markdownString.slice(0, markdownString.length - trailingWhitespace[0].length);
                markdownString += styleItem.close();
                markdownString += trailingWhitespace[0];
              }
            }
          }

          // Close the actual inline style being closed
          // Have to trim whitespace first and then re-add after because markdown can't handle leading/trailing whitespace
          var trailingWhitespace = TRAILING_WHITESPACE.exec(markdownString);
          markdownString = markdownString.slice(0, markdownString.length - trailingWhitespace[0].length);

          markdownString += (customStyleItems[style.style] || StyleItems[style.style]).close();
          markdownString += trailingWhitespace[0];

          // Handle nested case - reopen any inline styles after closing the parent
          if (styleIndex > -1 && styleIndex !== openInlineStyles.length - 1) {
            for (var i = openInlineStyles.length - 1; i !== styleIndex; i--) {
              var styleItem = customStyleItems[openInlineStyles[i].style] || StyleItems[openInlineStyles[i].style];
              if (styleItem && openInlineStyles[i].offset + openInlineStyles[i].length > characterIndex) {
                markdownString += styleItem.open();
              } else {
                openInlineStyles.splice(i, 1);
              }
            }
          }

          openInlineStyles.splice(styleIndex, 1);
        }
      }
    });

    // Open any inline tags that need opening
    block.inlineStyleRanges.forEach((style, styleIndex) => {
      if (style.offset === characterIndex) {
        if (customStyleItems[style.style] || StyleItems[style.style]) {
          const styleToAdd = (customStyleItems[style.style] || StyleItems[style.style]).open();
          markdownToAdd.push({
            type: 'style',
            style,
            value: styleToAdd,
          });
        }
      }
    });

    let skip = false;

    // Open any entity tags that need opening
    block.entityRanges.forEach((range, rangeIndex) => {
      if (range.offset === characterIndex) {
        const entity = rawDraftObject.entityMap[range.key];
        if (customEntityItems[entity.type] || EntityItems[entity.type]) {
          if (entity.type === '{mention') {
            skip = true;
          }
          const entityToAdd = (customEntityItems[entity.type] || EntityItems[entity.type]).open(entity);
          markdownToAdd.push({
            type: 'entity',
            value: entityToAdd,
          });
        }
      }
    });

    // These are all the opening entity and style types being added to the markdown string for this loop
    // we store in an array and add here because if the character is WS character, we want to hang onto it and not apply it until the next non-whitespace
    // character before adding the markdown, since markdown doesn’t play nice with leading whitespace (eg '** bold**' is no  good, whereas ' **bold**' is good.)
    if (character !== ' ' && markdownToAdd.length) {
      markdownString += markdownToAdd.map((item) => item.value).join('');

      markdownToAdd.forEach((item) => {
        if (item.type === 'style') {
          // We hang on to this because we may need to close it early and then re-open if there are nested styles being opened and closed.
          openInlineStyles.push(item.style);
        }
      });

      markdownToAdd = [];
    }

    if (block.type !== 'code-block') {
      const insideInlineCodeStyle = openInlineStyles.find((style) => style.style === 'CODE');

      if (insideInlineCodeStyle) {
        // Todo - The syntax to escape backtics when inside backtic code already is to use MORE backtics wrapping.
        // So we need to see how many backtics in a row we have and then when converting to markdown, use that # + 1
        // EG  ``Test ` Hllo ``
        // OR   ```Test `` Hello```
        // OR ````Test ``` Hello ````
        // Similar work has to be done for codeblocks.
      } else {
        // Escaping inline markdown characters
        if (options.alexa) {
          character = _escape(character);
        }

        // Special escape logic for blockquotes and heading characters
        // if (characterIndex === 0 && character === '#' && block.text[1] && block.text[1] === ' ') {
        //   character = character.replace('#', '\\#');
        // } else if (characterIndex === 0 && character === '>') {
        //   character = character.replace('>', '\\>');
        // }
      }
    }
    if (!skip) {
      markdownString += character;
    }
  });

  // Close any remaining entity tags
  block.entityRanges.forEach((range, rangeIndex) => {
    if (range.offset + range.length === block.text.length) {
      const entity = rawDraftObject.entityMap[range.key];
      if (customEntityItems[entity.type] || EntityItems[entity.type]) {
        if (entity.type === '{mention') {
          markdownString = markdownString.slice(0, -1);
        }
        markdownString += (customEntityItems[entity.type] || EntityItems[entity.type]).close(entity);
      }
    }
  });

  // Close any remaining inline tags (if an inline tag ends at the very last char, we won't catch it inside the loop)
  openInlineStyles.reverse().forEach((style) => {
    const trailingWhitespace = TRAILING_WHITESPACE.exec(markdownString);
    markdownString = markdownString.slice(0, markdownString.length - trailingWhitespace[0].length);
    markdownString += (customStyleItems[style.style] || StyleItems[style.style]).close();
    markdownString += trailingWhitespace[0];
  });

  // Close block level item
  if (customStyleItems[type] || StyleItems[type]) {
    markdownString += (customStyleItems[type] || StyleItems[type]).close(block);
  }

  return markdownString;
}

/**
 * Generate markdown for a raw draftjs object
 * DraftJS raw object contains an array of blocks, which is the main "structure"
 * of the text. Each block = a new line.
 *
 * @param {Object} rawDraftObject - draftjs object to generate markdown for
 * @param {Object} options - optional additional data, see readme for what options can be passed in.
 *
 * @return {String} markdown string
 * */

// TYLER - I JUST COPY AND PASTED THIS ENTIRE LIBRARY
function draftToMarkdown(rawDraftObject, options) {
  options = options || {};
  let markdownString = '';
  if (typeof rawDraftObject === 'object') {
    rawDraftObject.blocks.forEach((block, index) => {
      markdownString += renderBlock(block, index, rawDraftObject, options);
      if (options.newline && index < rawDraftObject.blocks.length - 1) {
        markdownString += '\n';
      }
    });
  }

  orderedListNumber = {}; // See variable definitions at the top of the page to see why we have to do this sad hack.
  return markdownString;
}

module.exports = draftToMarkdown;
