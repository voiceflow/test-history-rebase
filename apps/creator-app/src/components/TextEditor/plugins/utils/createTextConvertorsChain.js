const createTextConvertorsChain =
  (...convertors) =>
  (pluginsProps = {}) => {
    const last = (text) => text;

    const chain = convertors
      .reverse()
      .reduce((prevConvertor, { type, convertor }) => convertor(pluginsProps[type])(prevConvertor), last);

    return (value, data) => chain(value, data);
  };

export default createTextConvertorsChain;
