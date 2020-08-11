import React from 'react';

import Box from '@/components/Box';
import { Permission } from '@/config/permissions';
import { PlanType, UserRole } from '@/constants';

import { MentionEditor } from '.';

const MEMBERS = [
  {
    creator_id: 2,
    name: 'Michael Scott',
    email: 'michael.scott@dundermifflin.com',
    role: UserRole.EDITOR,
    image: '5894FB|EFF5FF',
  },
  {
    creator_id: 3,
    name: 'Jim Halpert',
    email: 'jim.halpert@dundermifflin.com',
    role: UserRole.EDITOR,
    image: '5831FB|EFF5FF',
  },
  {
    creator_id: 4,
    name: 'Dwight Schrute',
    email: 'dwight.schrute@dundermifflin.com',
    role: UserRole.VIEWER,
    image: '5791FB|EFF5FF',
  },
];

const getProps: any = () => ({ permissionType: Permission.COMMENTING, placeholder: 'Comment or @mention', members: MEMBERS, plan: PlanType.PRO });

export default {
  title: 'Mention Editor',
  component: MentionEditor,
};

export const basic = () => {
  const [value, onValueChange] = React.useState<string>('');
  const [mentions, onMentionChange] = React.useState<number[]>([]);

  const onChange = (text: string, users: number[]) => {
    onValueChange(text);
    onMentionChange(users);
  };

  return (
    <Box m={20}>
      <Box>
        <MentionEditor {...getProps()} value={value} onChange={onChange} />
      </Box>

      <Box mt={20}>
        User IDs of mentioned users:
        {mentions.map((mention: number) => (
          <Box key={mention}>UserID: {mention}</Box>
        ))}
      </Box>
    </Box>
  );
};
