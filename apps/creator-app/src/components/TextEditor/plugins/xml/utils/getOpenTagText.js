export default (tagName, isSingle, attributes) => {
  const attributesStr = Object.keys(attributes || {})
    .map((attrName) => `${attrName}="${attributes[attrName]}"`)
    .join(' ');

  // eslint-disable-next-line sonarjs/no-nested-template-literals
  return `<${tagName}${attributesStr ? ` ${attributesStr}` : ''}${isSingle ? ' /' : ''}>`;
};
