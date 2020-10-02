import cn from 'classnames';
import React from 'react';

import Dropdown from '@/components/Dropdown';
import IconButton, { IconButtonVariant } from '@/components/IconButton';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import type { NodeData } from '@/models';
import { SidebarContext } from '@/pages/Canvas/components/EditorSidebar/contexts';
import { EDITOR_BREADCRUMBS_CLASSNAME, EDITOR_HEADER_CLASSNAME } from '@/pages/Canvas/constants';
import { EngineContext, ManagerContext } from '@/pages/Canvas/contexts';
import { preventDefault } from '@/utils/dom';

import { ActiveLabel, Breadcrumbs, Container, Divider, Label, Title, TitleActionsContainer } from './components';

type EditorHeaderProps = {
  path?: { label: string }[];
  data: NodeData<unknown>;
  onRename: (value: string) => void;
  goToPath: (index: number) => void;
  className?: string;
  hideTitle?: boolean;
  renameRevision: string;
};

const EditorHeader: React.FC<EditorHeaderProps> = ({ path = [], data, onRename, className, goToPath, hideTitle, renameRevision }) => {
  const sidebar = React.useContext(SidebarContext)!;
  const engine = React.useContext(EngineContext)!;
  const getManager = React.useContext(ManagerContext)!;
  const { headerActions } = sidebar.state;

  const { nameEditable, label } = getManager(data.type);

  let fullPath = '';

  return (
    <Container withTitle={!hideTitle && (path.length <= 1 || !!headerActions.length)} className={cn(EDITOR_HEADER_CLASSNAME, className)}>
      {!!path.length && (
        <Breadcrumbs className={EDITOR_BREADCRUMBS_CLASSNAME}>
          {path.map(({ label: pathLabel }, index) => {
            fullPath += `${pathLabel}-${index}/`;
            return (
              <React.Fragment key={fullPath}>
                {index !== 0 && <Divider>/</Divider>}
                {index === path.length - 1 ? (
                  <ActiveLabel>{pathLabel}</ActiveLabel>
                ) : (
                  <Label onClick={preventDefault(() => goToPath(index))}>{pathLabel}</Label>
                )}
              </React.Fragment>
            );
          })}
        </Breadcrumbs>
      )}

      {!hideTitle && (
        <TitleActionsContainer>
          <Title name={nameEditable ? data.name : label} disabled={!nameEditable} onChange={onRename} renameRevision={renameRevision} />

          {!!headerActions.length && (
            <Dropdown
              placement="bottom-end"
              options={headerActions.map(({ onClick, ...action }) => ({ ...action, onClick: () => onClick({ data, engine }) }))}
            >
              {(ref, onOpen, isOpened) => <IconButton ref={ref} icon="elipsis" variant={IconButtonVariant.FLAT} onClick={onOpen} active={isOpened} />}
            </Dropdown>
          )}
        </TitleActionsContainer>
      )}
    </Container>
  );
};

const mapStateToProps = {
  data: Creator.focusedNodeDataSelector,
};

export default connect(mapStateToProps)(EditorHeader);
