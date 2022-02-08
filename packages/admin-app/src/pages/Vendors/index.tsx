import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { PageTitle } from '@/components/PageLayout';
import SearchInput from '@/components/SearchInput';
import * as Admin from '@/ducks/adminV2';

import VendorList from './components/VendorList/VendorList';

const Vendors: React.FC = () => {
  const params = useParams<'creator_id'>();
  const user = useSelector(Admin.creatorSelector);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = React.useState(params.creator_id || '');

  React.useEffect(() => {
    if (!params.creator_id) {
      return;
    }

    setSearchTerm(params.creator_id);

    dispatch(Admin.getVendors(params.creator_id));

    if (String(user.creator_id) !== params.creator_id) {
      dispatch(Admin.findCreator(params.creator_id));
    }
  }, [params.creator_id]);

  return (
    <>
      <PageTitle>Vendors</PageTitle>

      <hr />

      <div className="fb_search">
        <div>
          <div className="row">
            <div className="col-sm-8">
              <SearchInput
                type="text"
                value={searchTerm}
                onChange={({ currentTarget }) => setSearchTerm(currentTarget.value)}
                className="form-control-2"
                placeholder="Find creator by id or email"
                onKeyPress={(event) => event.key === 'Enter' && dispatch(Admin.getVendors(searchTerm))}
              />
            </div>

            <div className="col-sm-4">
              <Button className="fb_search_button" variant={ButtonVariant.PRIMARY} onClick={() => dispatch(Admin.getVendors(searchTerm))}>
                Search
              </Button>
            </div>
          </div>

          <div className="fb_refresh_wrapper">
            <span className="fb_refresh" onClick={() => dispatch(Admin.getVendors(searchTerm))}>
              Refresh <i className="fas fa-sync" />
            </span>
          </div>
        </div>
        <VendorList />
      </div>
    </>
  );
};

export default Vendors;
