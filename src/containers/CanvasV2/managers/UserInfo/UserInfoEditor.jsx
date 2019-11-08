import cn from 'classnames';
import React from 'react';
import { Alert } from 'reactstrap';

import Button from '@/componentsV2/Button';
import { PERMISSIONS, PermissionType } from '@/constants';
import { Content, Section } from '@/containers/CanvasV2/components/BlockEditor';
import { isLiveSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useManager } from '@/hooks';

import Permission from './components/Permission';

const permissionFactory = (selectedPermissions) => {
  const nextPermission = PERMISSIONS.find(({ value }) => value === PermissionType.PRODUCT || !selectedPermissions.includes(value));

  return () => ({
    selected: nextPermission.value,
  });
};

function UserInfoEditor({ data, onChange, isLive }) {
  const selectedPermissions = data.permissions.map(({ selected }) => selected);
  const updatePermissions = React.useCallback((permissions) => onChange({ permissions }), [onChange]);
  const { onAdd, mapManaged } = useManager(data.permissions, updatePermissions, {
    factory: permissionFactory(selectedPermissions),
  });

  return (
    <Content className={cn({ 'disabled-overlay': isLive })}>
      {mapManaged((permission, { key, onRemove, onUpdate }) => (
        <Permission permission={permission} onRemove={onRemove} selectedPermissions={selectedPermissions} onUpdate={onUpdate} key={key} />
      ))}
      <Section>
        <Button variant="secondary" icon="plus" onClick={onAdd}>
          Add Permission Request
        </Button>
        <Alert className="mt-3">
          If failing, try prompting the user with the <b>Permission</b> block and a message
        </Alert>
      </Section>
    </Content>
  );
}

const mapStateToProps = {
  isLive: isLiveSelector,
};

export default connect(mapStateToProps)(UserInfoEditor);
