const _escape = function (word) {
    if (typeof(word) === "string") {
        // word = word.replace(/</g, '&lt;');
        // word = word.replace(/>/g, '&gt;');
        // .replace(/"/g, '\"')
        word = word.replace(/'/g, '\'').replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/&/g, 'ampersand')
        return word;
    }
    if (typeof(word) === "number") {
        return word;
    }
    if (typeof(word) === "boolean") {
        return word;
    }
    throw new Error('received invalid type ' + typeof(word));
}

function renderBlock(block, index, rawDraftObject, options) {
  var markdownString = ''

  // Render text within content, along with any inline styles/entities
  Array.from(block.text).some(function (character, characterIndex) {
    if (options.alexa) {
      character = _escape(character)
    }

    markdownString += character
    return null
  })

  return markdownString;
}

// TYLER - I JUST COPY AND PASTED THIS ENTIRE LIBRARY
function draftToMarkdown(rawDraftObject, options) {
  options = options || {};
  var markdownString = '';
  rawDraftObject.blocks.forEach(function (block, index) {
    markdownString += renderBlock(block, index, rawDraftObject, options)
    if(options.newline){
      markdownString += '\n'
    }
  })
  return markdownString;
}

module.exports = draftToMarkdown