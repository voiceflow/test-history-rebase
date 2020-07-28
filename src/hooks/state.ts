import React from 'react';

export const useConstant = <T>(factory: () => T) => React.useMemo(factory, []);
