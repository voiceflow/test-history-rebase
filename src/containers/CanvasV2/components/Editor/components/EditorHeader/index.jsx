import React from 'react';

import Dropdown from '@/componentsV2/Dropdown';
import IconButton from '@/componentsV2/IconButton';
import { SidebarContext } from '@/containers/CanvasV2/components/EditSidebar/contexts';
import { EngineContext } from '@/containers/CanvasV2/contexts';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { preventDefault } from '@/utils/dom';

import Title from './components/Title';
import { ActiveLabel, Breadcrumbs, Divider, Label, TitleActionsWrapper, Wrapper } from './components/styled';

function EditorHeader({ path = [], data, onRename, className, goToPath, renameRevision }) {
  const sidebar = React.useContext(SidebarContext);
  const engine = React.useContext(EngineContext);
  const { headerActions } = sidebar.state;

  let fullPath = '';

  return (
    <Wrapper withTitle={path.length <= 1 || !!headerActions.length} className={className}>
      {!!path.length && (
        <Breadcrumbs>
          {path.map(({ label }, index) => {
            fullPath += `${label}-${index}/`;
            return (
              <React.Fragment key={fullPath}>
                {index !== 0 && <Divider>/</Divider>}
                {index === path.length - 1 ? (
                  <ActiveLabel>{label}</ActiveLabel>
                ) : (
                  <Label onClick={preventDefault(() => goToPath(index))}>{label}</Label>
                )}
              </React.Fragment>
            );
          })}
        </Breadcrumbs>
      )}

      <TitleActionsWrapper>
        <Title name={data.name} onChange={onRename} renameRevision={renameRevision} />
        {!!headerActions.length && (
          <Dropdown
            placement="bottom-end"
            options={headerActions.map(({ onClick, ...action }) => ({ ...action, onClick: (...args) => onClick({ data, engine }, ...args) }))}
          >
            {(ref, onOpen, isOpened) => <IconButton ref={ref} icon="elipsis" variant="flat" onClick={onOpen} active={isOpened} />}
          </Dropdown>
        )}
      </TitleActionsWrapper>
    </Wrapper>
  );
}

const mapStateToProps = {
  data: Creator.focusedNodeDataSelector,
};

export default connect(mapStateToProps)(EditorHeader);
