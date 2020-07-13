import React from 'react';

import { Permission } from '@/config/permissions';
import { PlanType } from '@/constants';

import MentionEditor from '.';

const getProps = () => ({ members: [], plan: PlanType.TEAM, permissionType: Permission.COMMENTING, onChange: () => null } as any);

export default {
  title: 'Mention Editor',
  component: MentionEditor,
};

export const basic = () => <MentionEditor {...getProps()} />;
