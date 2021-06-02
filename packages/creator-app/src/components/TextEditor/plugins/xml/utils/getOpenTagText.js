export default (tagName, isSingle, attributes) => {
  const attributesStr = Object.keys(attributes || {})
    .map((attrName) => `${attrName}="${attributes[attrName]}"`)
    .join(' ');

  return `<${tagName}${attributesStr ? ` ${attributesStr}` : ''}${isSingle ? ' /' : ''}>`;
};
