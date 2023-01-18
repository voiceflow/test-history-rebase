import { Utils } from '@voiceflow/common';
import { Menu as UIMenu, stopImmediatePropagation, toast } from '@voiceflow/ui';
import React from 'react';

import { LimitType } from '@/constants/limits';
import * as Domain from '@/ducks/domain';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch, usePlanLimitedAction, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import MenuInfoTooltip from './MenuInfoTooltip';
import MenuItem from './MenuItem';
import * as S from './styles';

interface MenuProps {
  onClose: VoidFunction;
}

const Menu: React.OldFC<MenuProps> = ({ onClose }) => {
  const editModal = ModalsV2.useModal(ModalsV2.Domain.Edit);
  const deleteModal = ModalsV2.useModal(ModalsV2.Domain.Delete);
  const createModal = ModalsV2.useModal(ModalsV2.Domain.Create);
  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);

  const domains = useSelector(Domain.allDomainsSelector);
  const rootDomainID = useSelector(Domain.rootDomainIDSelector);
  const getDomainByID = useSelector(Domain.getDomainByIDSelector);
  const activeDiagramID = useSelector(Session.activeDiagramIDSelector);

  const patchDomain = useDispatch(Domain.patch);
  const duplicateDomain = useDispatch(Domain.duplicate);
  const goToDomainDiagram = useDispatch(Router.goToDomainDiagram);

  const [search, setSearch] = React.useState('');

  const filteredDomains = React.useMemo(() => {
    const lowercaseSearch = search.toLowerCase();

    return domains.filter(({ name }) => name.toLowerCase().includes(lowercaseSearch));
  }, [search, domains]);

  const onCreate = usePlanLimitedAction(LimitType.DOMAINS, {
    value: domains.length,

    onLimit: (config) => upgradeModal.openVoid(config.upgradeModal()),
    onAction: () => createModal.openVoid({ name: search }),
  });

  const onDuplicate = usePlanLimitedAction(LimitType.DOMAINS, {
    value: domains.length,

    onLimit: (config) => upgradeModal.openVoid(config.upgradeModal()),
    onAction: async (id: string) => {
      const domainToDuplicate = getDomainByID({ id });

      await duplicateDomain(id, { navigateToDomain: true });

      if (!domainToDuplicate) return;

      toast.success(`Successfully duplicated "${domainToDuplicate.name}" domain.`);
    },
  });

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
            <UIMenu.Footer.Action onClick={Utils.functional.chain(close, onCreate)}>Create New Domain</UIMenu.Footer.Action>
          </UIMenu.Footer>
        )}
      >
        {filteredDomains.length ? (
          filteredDomains.map(({ id, name, live, status, rootDiagramID }) => (
            <MenuItem
              key={id}
              live={live}
              name={name}
              isRoot={id === rootDomainID}
              search={search}
              status={status}
              onEdit={Utils.functional.chainVoid(onClose, () => editModal.openVoid({ domainID: id }))}
              onClick={Utils.functional.chainVoid(onClose, () => rootDiagramID !== activeDiagramID && goToDomainDiagram(id, rootDiagramID))}
              onDelete={Utils.functional.chainVoid(onClose, () => deleteModal.openVoid({ domainID: id }))}
              onDuplicate={Utils.functional.chainVoid(onClose, () => onDuplicate(id))}
              onToggleLive={(live) => patchDomain(id, { live })}
              onChangeStatus={(status) => patchDomain(id, { status })}
            />
          ))
        ) : (
          <UIMenu.Item>
            <UIMenu.NotFound>No domains found.</UIMenu.NotFound>
          </UIMenu.Item>
        )}
      </UIMenu>
    </>
  );
};

export default Menu;
