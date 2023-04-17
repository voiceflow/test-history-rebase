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
  const queryRange = queryParams[FilterTag.RANGE];
  const queryEndDate = queryParams[FilterTag.END_DATE];
  const queryStartDate = queryParams[FilterTag.START_DATE];

  // eslint-disable-next-line no-nested-ternary
  const tags = React.useMemo(() => (Array.isArray(queryTag) ? queryTag : queryTag ? [queryTag] : []).filter(Utils.array.isNotNullish), [queryTag]);
  const range = isString(queryRange) ? queryRange : '';
  const endDate = isString(queryEndDate) ? queryEndDate : '';
  const startDate = isString(queryStartDate) ? queryStartDate : '';

  return {
    tags,
    range,
    query,
    endDate,
    startDate,
    queryParams,
  };
};
