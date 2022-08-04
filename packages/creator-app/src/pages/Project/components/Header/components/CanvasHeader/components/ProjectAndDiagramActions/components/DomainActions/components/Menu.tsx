import { Utils } from '@voiceflow/common';
import { Menu as UIMenu, stopImmediatePropagation } from '@voiceflow/ui';
import React from 'react';

import * as Modals from '@/ModalsV2';

import MenuInfoTooltip from './MenuInfoTooltip';
import MenuItem from './MenuItem';
import * as S from './styles';

interface MenuProps {
  onClose: VoidFunction;
}

const DOMAINS = [
  {
    id: '1',
    name: 'Home',
    isLive: true,
  },
  {
    id: '2',
    name: 'Domain',
    isLive: true,
  },
  {
    id: '3',
    name: 'Suuuuuper long domain name should be trimmed',
    isLive: false,
  },
];

const Menu: React.FC<MenuProps> = ({ onClose }) => {
  const [search, setSearch] = React.useState('');

  const createModal = Modals.useModal(Modals.Domain.Create);

  const filteredDomains = React.useMemo(() => {
    const lowercaseSearch = search.toLowerCase();

    return DOMAINS.filter(({ name }) => name.toLowerCase().includes(lowercaseSearch));
  }, [search]);

  return (
    <>
      <UIMenu
        width={275}
        onHide={onClose}
        swallowMouseDownEvent={false}
        searchable={
          <S.MenuSearchInput
            onMouseDown={stopImmediatePropagation()}
            placeholder="Search "
            rightAction={<MenuInfoTooltip />}
            onChangeText={setSearch}
          />
        }
        renderFooterAction={({ close }) => (
          <UIMenu.Footer>
            <UIMenu.Footer.Action onClick={Utils.functional.chain(close, () => createModal.openVoid({ name: search }))}>
              Create New Domain
            </UIMenu.Footer.Action>
          </UIMenu.Footer>
        )}
      >
        {filteredDomains.length ? (
          filteredDomains.map(({ id, name }) => <MenuItem key={id} id={id} name={name} isHome={id === '1'} search={search} />)
        ) : (
          <UIMenu.NotFound>No domains found.</UIMenu.NotFound>
        )}
      </UIMenu>
    </>
  );
};

export default Menu;
