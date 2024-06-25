import { Utils } from '@voiceflow/common';
import queryString from 'query-string';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { FilterTag } from '@/pages/Conversations/constants';
import { isString } from '@/utils/string';

export const useFilters = () => {
  const location = useLocation();

  const query = React.useMemo(() => queryString.extract(location.search), [location.search]);
  const queryParams = React.useMemo(() => queryString.parse(location.search), [location.search]);

  const queryTag = queryParams[FilterTag.TAG];
  const queryPersona = queryParams[FilterTag.PERSONA];
  const queryRange = queryParams[FilterTag.RANGE];
  const queryEndDate = queryParams[FilterTag.END_DATE];
  const queryStartDate = queryParams[FilterTag.START_DATE];

  const tags = React.useMemo(
    // eslint-disable-next-line no-nested-ternary
    () => (Array.isArray(queryTag) ? queryTag : queryTag ? [queryTag] : []).filter(Utils.array.isNotNullish),
    [queryTag]
  );
  const personas = React.useMemo(
    () =>
      // eslint-disable-next-line no-nested-ternary
      (Array.isArray(queryPersona) ? queryPersona : queryPersona ? [queryPersona] : []).filter(
        Utils.array.isNotNullish
      ),
    [queryPersona]
  );
  const range = isString(queryRange) ? queryRange : '';
  const endDate = isString(queryEndDate) ? queryEndDate : '';
  const startDate = isString(queryStartDate) ? queryStartDate : '';

  return {
    personas,
    tags,
    range,
    query,
    endDate,
    startDate,
    queryParams,
  };
};
