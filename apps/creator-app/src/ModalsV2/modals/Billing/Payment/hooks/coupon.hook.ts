import { usePersistFunction } from '@voiceflow/ui-next';
import { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { COUPON_QUERY_PARAM } from '@/constants';

export const useQueryCoupon = () => {
  const location = useLocation();
  const queryCoupon = useMemo(() => new URLSearchParams(location.search).get(COUPON_QUERY_PARAM), [location.search]);
  const history = useHistory();

  const clearQueryCoupon = usePersistFunction(() => {
    const queryParams = new URLSearchParams(location.search);

    if (queryParams.has(COUPON_QUERY_PARAM)) {
      queryParams.delete(COUPON_QUERY_PARAM);
      history.replace({
        search: queryParams.toString(),
      });
    }
  });

  return [queryCoupon, clearQueryCoupon] as const;
};
