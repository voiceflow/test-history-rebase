import { Menu } from '@voiceflow/ui';
import React from 'react';

import { Container, Sticker } from './components';
import { STICKERS } from './constants';

const StickersDropdown: React.FC = () => {
  return (
    <Menu noTopPadding noBottomPadding>
      <div style={{ padding: '20px' }}>
        <h6>Recents</h6>
        <Container>
          {STICKERS.map(({ order, url }) => (
            <Sticker key={order} url={url} />
          ))}
        </Container>
      </div>
    </Menu>
  );
};

export default StickersDropdown;
