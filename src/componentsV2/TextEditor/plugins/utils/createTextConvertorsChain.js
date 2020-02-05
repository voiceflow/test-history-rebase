const createTextConvertorsChain = (...convertors) => (pluginsProps = {}) => {
  const last = (text) => text;

  const chain = convertors.reverse().reduce((prevConvertor, { type, convertor }) => convertor(pluginsProps[type])(prevConvertor), last);

  return (value, { cursor, entityMap, entityRanges }) => chain(value, { cursor, entityMap, entityRanges });
};

export default createTextConvertorsChain;
