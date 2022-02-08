import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';

import PageLayout from '@/components/PageLayout';
import * as Account from '@/ducks/accountV2';
import Copy from '@/pages/Copy';
import Coupon from '@/pages/Coupon';
import FinanceBoard from '@/pages/Finance';
import Home from '@/pages/Home';
import LoginForm from '@/pages/Login';
import ProductUpdates from '@/pages/ProductUpdates';
import Referral from '@/pages/Referral';
import Vendors from '@/pages/Vendors';

import LoadingGate from './LoadingGate';

const Router: React.FC = () => {
  const user = useSelector(Account.accountSelector);
  const dispatch = useDispatch();
  const isAuthorized = !!Account.getAuth();

  const getUser = () => {
    if (isAuthorized) {
      dispatch(Account.checkSession());
    }
  };

  const isInitialized = () => {
    if (!isAuthorized) return false;

    return !!user?.id && user.internalAdmin;
  };

  return (
    <div className="body">
      <LoadingGate label="Session" load={getUser} isLoaded={!isAuthorized || !!user?.id}>
        <Routes>
          {isInitialized() ? (
            <>
              <Route path="/" element={<Navigate to="/admin" />} />

              <Route path="/admin" element={<PageLayout />}>
                <Route index element={<Home />} />
                <Route path="copy" element={<Copy />} />
                <Route path="coupon" element={<Coupon />} />
                <Route path="updates" element={<ProductUpdates />} />
                <Route path="referral" element={<Referral />} />

                <Route path="charges">
                  <Route index element={<FinanceBoard />} />
                  <Route path=":creator_id" element={<FinanceBoard />} />
                </Route>

                <Route path="vendors">
                  <Route index element={<Vendors />} />
                  <Route path=":creator_id" element={<Vendors />} />
                </Route>

                <Route path="*" element={<Navigate to="/admin" />} />
              </Route>
            </>
          ) : (
            <>
              <Route path="/login" element={<LoginForm />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </LoadingGate>
    </div>
  );
};

export default Router;
