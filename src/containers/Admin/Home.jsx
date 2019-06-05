import React from 'react';
import InternalLookup from "./components/InternalLookup/InternalLookup";

const Home = () => {
  return (
    <div className="admin-page-inner">
      <h3>
        <span className={'crossed_out'}>Tyler's</span>
        &nbsp; Will's Lookup Emporium <span className={'admin_highlight'}>New and improved!</span>
      </h3>

      <InternalLookup/>
    </div>
  );
};

export default Home;
