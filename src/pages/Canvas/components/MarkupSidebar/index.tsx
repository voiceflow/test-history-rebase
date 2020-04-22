import _noop from 'lodash/noop';
import React from 'react';
import { withTheme } from 'styled-components';

import Drawer from '@/components/Drawer';
import { connect } from '@/hocs';
import { RemoveIntercom } from '@/hocs/removeIntercom';
import { EditPermissionContext } from '@/pages/Canvas/contexts';
import { Theme } from '@/styles/theme';
import { stopImmediatePropagation } from '@/utils/dom';
import { compose } from '@/utils/functional';

type MarkupSidebarProps = {
  theme: Theme;
};

const MarkupSidebar: React.FC<MarkupSidebarProps> = ({ theme }) => {
  const { canEdit: isVisible } = React.useContext(EditPermissionContext)!;

  // TODO: add when managers will be implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, react/display-name
  const getManager = () => (_: { updateData: () => void }) => <div>Manager</div>;
  const updateData = _noop;

  // TODO: update when managers will be implemented
  const isOpen = isVisible;

  const Manager = getManager();

  return (
    <>
      <Drawer
        as="section"
        style={{ overflow: 'hidden' }}
        open={isOpen}
        width={theme.components.markupSidebar.width}
        onPaste={stopImmediatePropagation()}
      >
        <Manager updateData={updateData} />
      </Drawer>
      {isOpen && <RemoveIntercom />}
    </>
  );
};

// TODO: add markup focused node selectors
const mapStateToProps = {};

export default compose<MarkupSidebarProps, {}>(connect(mapStateToProps, null), React.memo, withTheme)(MarkupSidebar);
