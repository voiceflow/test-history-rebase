import { usePersistFunction } from '@voiceflow/ui-next';
import { useAtom } from 'jotai/react';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { COUPON_QUERY_PARAM } from '@/constants';

import * as atoms from './Plans.atoms';

export const useQueryCoupon = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryCoupon = queryParams.get(COUPON_QUERY_PARAM);
  const history = useHistory();

  const clearQueryCoupon = usePersistFunction(() => {
    if (queryParams.has(COUPON_QUERY_PARAM)) {
      queryParams.delete(COUPON_QUERY_PARAM);
      history.replace({
        search: queryParams.toString(),
      });
    }
  });

  return [queryCoupon, clearQueryCoupon] as const;
};

export const useCoupon = () => {
  const [queryCoupon] = useQueryCoupon();

  const [couponID, setCouponID] = useAtom(atoms.couponIDAtom);

  React.useEffect(() => {
    if (queryCoupon) {
      setCouponID(queryCoupon);
    }
  }, [queryCoupon]);

  return [couponID];
};
