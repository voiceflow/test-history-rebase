import { Utils } from '@voiceflow/common';
import { Menu as UIMenu, stopImmediatePropagation, toast } from '@voiceflow/ui';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import { LimitType } from '@/constants/limits';
import { Permission } from '@/constants/permissions';
import * as Domain from '@/ducks/domain';
import * as Organization from '@/ducks/organization';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { usePermission } from '@/hooks/permission';
import { usePlanLimitedAction } from '@/hooks/planLimitV2';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import * as ModalsV2 from '@/ModalsV2';

import MenuInfoTooltip from './MenuInfoTooltip';
import MenuItem from './MenuItem';
import * as S from './styles';

interface MenuProps {
  onClose: VoidFunction;
}

const Menu: React.FC<MenuProps> = ({ onClose }) => {
  const editModal = ModalsV2.useModal(ModalsV2.Domain.Edit);
  const deleteModal = ModalsV2.useModal(ModalsV2.Domain.Delete);
  const createModal = ModalsV2.useModal(ModalsV2.Domain.Create);
  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);

  const domains = useSelector(Domain.allDomainsSelector);
  const rootDomainID = useSelector(Domain.rootDomainIDSelector);
  const getDomainByID = useSelector(Domain.getDomainByIDSelector);
  const activeDiagramID = useSelector(Session.activeDiagramIDSelector);
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);

  const patchDomain = useDispatch(Domain.patch);
  const duplicateDomain = useDispatch(Domain.duplicate);
  const goToDomainDiagram = useDispatch(Router.goToDomainDiagram);

  const domainEditPermission = usePermission(Permission.DOMAIN_EDIT);

  const [search, setSearch] = React.useState('');

  const filteredDomains = React.useMemo(() => {
    const lowercaseSearch = search.toLowerCase();

    return _sortBy(
      domains.filter(({ name }) => name.toLowerCase().includes(lowercaseSearch)),
      ({ name }) => name
    );
  }, [search, domains]);

  const onCreateAction = () => createModal.openVoid({ name: search });
  const onDuplicateAction = async (id: string) => {
    const domainToDuplicate = getDomainByID({ id });

    await duplicateDomain(id, { navigateToDomain: true });

    if (!domainToDuplicate) return;

    toast.success(`Successfully duplicated "${domainToDuplicate.name}" domain.`);
  };

  const legacyOnCreate = usePlanLimitedAction(LimitType.DOMAINS, {
    value: domains.length,

    onLimit: (config) => upgradeModal.openVoid(config.upgradeModal()),
    onAction: onCreateAction,
  });

  const legacyOnDuplicate = usePlanLimitedAction(LimitType.DOMAINS, {
    value: domains.length,

    onLimit: (config) => upgradeModal.openVoid(config.upgradeModal()),
    onAction: onDuplicateAction,
  });

  // FIXME: remove FF https://voiceflow.atlassian.net/browse/CV3-994 we are not going to limit domains anymore
  const onCreate = subscription ? legacyOnCreate : onCreateAction;
  const onDuplicate = subscription ? legacyOnDuplicate : onDuplicateAction;

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
        renderFooterAction={
          domainEditPermission.allowed
            ? ({ close }) => (
                <UIMenu.Footer>
                  <UIMenu.Footer.Action onClick={Utils.functional.chain(close, onCreate)}>Create New Domain</UIMenu.Footer.Action>
                </UIMenu.Footer>
              )
            : null
        }
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
              withActions={domainEditPermission.allowed}
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
