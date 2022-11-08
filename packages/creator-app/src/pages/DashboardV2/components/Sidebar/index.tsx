import React from 'react';

import * as S from './styles';

const Sidebar: React.FC = () => {
  const user = {
    name: 'John Doe',
    image: 'https://cm4-production-assets.s3.amazonaws.com/1667444778988-screen-shot-2022-11-03-at-00.06.09.png',
    creator_id: 98226,
  };
  return (
    <S.SidebarWrapper>
      <S.Footer>
        <S.StyledUser user={user} flat />
        <div>Michael Hood</div>
      </S.Footer>
    </S.SidebarWrapper>
  );
};

export default Sidebar;
