const draftToPlainText = (rawContentState) => rawContentState.blocks.reduce((acc, block) => acc + block.text, '');

export const deepDraftToMarkdown = (object) => {
  const result = object;
  const variables = new Set();
  const regex = /{(\w*)}/g;

  const finder = (str) => {
    let match = regex.exec(str);
    while (match != null) {
      if (/\w{1,24}/.test(match[1])) {
        variables.add(match[1]);
      }
      match = regex.exec(str);
    }
  };

  const recurse = (subCollection, resultToModify) => {
    if (subCollection !== null && typeof subCollection === 'object') {
      Object.keys(subCollection).forEach((key) => {
        let val = subCollection[key];
        if (typeof val === 'object' && val && val.blocks && val.entityMap) {
          val = draftToPlainText(val);
        }
        if (typeof val === 'object' && val && val.value !== undefined && typeof val.value !== 'object') {
          val = val.value;
        }
        resultToModify[key] = val;
        recurse(subCollection[key], resultToModify[key]);
      });
    } else if (typeof subCollection === 'string') {
      finder(subCollection);
    }
  };

  recurse(object, result);

  return {
    result,
    variables: [...variables],
  };
};
