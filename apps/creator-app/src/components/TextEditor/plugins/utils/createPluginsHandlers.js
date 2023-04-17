const createPluginsHandlers = (pluginsInstances) => {
  const handlersMap = pluginsInstances.reduce((obj, { handlers }) => {
    Object.keys(handlers).forEach((key) => {
      if (!obj[key]) {
        obj[key] = [];
      }

      obj[key].push(handlers[key]);
    });

    return obj;
  }, {});

  return Object.keys(handlersMap).reduce((acc, key) => {
    acc[key] = (e, options) => handlersMap[key].reduce((res, handler) => handler(e, { ...res, ...options }), {});

    return acc;
  }, {});
};

export default createPluginsHandlers;
