import { Dropdown, IconButton } from '@voiceflow/ui';
import React from 'react';

import MenuItemActions from '@/components/DomainActions/components/MenuItemActions';

import type { Domain } from '../types';
import * as S from './styles';

export const ActionRow: React.FC<{ item: Domain }> = ({ item }) => {
  return (
    <Dropdown
      menu={
        <MenuItemActions
          live={item.live}
          onEdit={() => {}}
          status={item.status}
          onDelete={() => {}}
          onDuplicate={() => {}}
          onToggleLive={() => {}}
          onChangeStatus={() => {}}
        />
      }
      offset={{ offset: [-10, 0] }}
      placement="right-start"
      selfDismiss
    >
      {(ref, onToggle) => (
        <S.ActionRow ref={ref} onClick={onToggle}>
          <IconButton size={15} icon="ellipsis" variant={IconButton.Variant.BASIC} />
        </S.ActionRow>
      )}
    </Dropdown>
  );
};
