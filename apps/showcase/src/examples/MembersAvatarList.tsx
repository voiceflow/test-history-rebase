import { Members } from '@voiceflow/ui';
import React from 'react';

import { withBox } from './hocs';
import { createExample, createSection } from './utils';

const wrapContainer = withBox({ display: 'flex', padding: 30, backgroundColor: '#e3e3e3' });

const members = [
  {
    name: 'Mark Doe',
    image: '697986|EEF0F1',
    creator_id: 853632,
  },
  {
    name: 'John Doe',
    image: 'https://cm4-production-assets.s3.amazonaws.com/1667444778988-screen-shot-2022-11-03-at-00.06.09.png',
    creator_id: 98226,
  },
  {
    name: 'Ronny Doe',
    image: '5891FB|EFF5FF',
    creator_id: 85362,
  },
  {
    name: 'Filipe Merker',
    image: 'https://avatars.githubusercontent.com/u/9748039?s=400&u=ce4d00fa41942fdd0b3fd4cf6fd711efb8238b89&v=4',
    creator_id: 85363,
  },
];

const normal = createExample(
  'normal',
  wrapContainer(() => <Members.AvatarList members={members} />)
);

const flat = createExample(
  'flat',
  wrapContainer(() => <Members.AvatarList members={members} />)
);

const small = createExample(
  'small',
  wrapContainer(() => <Members.AvatarList members={members} small />)
);

const withButton = createExample(
  'withButton',
  wrapContainer(() => <Members.AvatarList members={members} onAdd={() => {}} />)
);

export default createSection('MembersAvatarList', 'src/components/Members/index.tsx', [normal, flat, small, withButton]);
