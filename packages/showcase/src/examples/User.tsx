import { User } from '@voiceflow/ui';
import React from 'react';

import { withBox } from './hocs';
import { createExample, createSection } from './utils';

const wrapContainerSizes = withBox({
  width: 130,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});
const wrapContainer = withBox({ display: 'flex', padding: 30, backgroundColor: '#e3e3e3' });

const noPicture = createExample(
  'noPicture',
  wrapContainer(() => (
    <User
      user={{
        name: 'Filipe Merker',
        image: 'E760D4|FCEFFB',
        creator_id: 85363,
      }}
    />
  ))
);

const withPicture = createExample(
  'withPicture',
  wrapContainer(() => (
    <User
      user={{
        name: 'John Doe',
        image: 'https://cm4-production-assets.s3.amazonaws.com/1667444778988-screen-shot-2022-11-03-at-00.06.09.png',
        creator_id: 98226,
      }}
    />
  ))
);

const flat = createExample(
  'flat',
  wrapContainer(() => (
    <User
      flat
      user={{
        name: 'John Doe',
        image: 'https://cm4-production-assets.s3.amazonaws.com/1667444778988-screen-shot-2022-11-03-at-00.06.09.png',
        creator_id: 98226,
      }}
    />
  ))
);

const sizes = createExample(
  'small, medium, large',
  wrapContainerSizes(() => (
    <>
      <User
        small
        user={{
          name: 'John Doe',
          image: 'https://cm4-production-assets.s3.amazonaws.com/1667444778988-screen-shot-2022-11-03-at-00.06.09.png',
          creator_id: 98226,
        }}
      />
      <User
        medium
        user={{
          name: 'John Doe',
          image: 'https://cm4-production-assets.s3.amazonaws.com/1667444778988-screen-shot-2022-11-03-at-00.06.09.png',
          creator_id: 98222,
        }}
      />
      <User
        large
        user={{
          name: 'John Doe',
          image: 'https://cm4-production-assets.s3.amazonaws.com/1667444778988-screen-shot-2022-11-03-at-00.06.09.png',
          creator_id: 98221,
        }}
      />
    </>
  ))
);

export default createSection('User', 'src/components/User/index.tsx', [noPicture, withPicture, flat, sizes]);
