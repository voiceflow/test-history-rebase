import { Dropdown, IconButton, IconButtonVariant, preventDefault } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { SidebarContext } from '@/pages/Canvas/components/EditorSidebar/contexts';
import { EDITOR_BREADCRUMBS_CLASSNAME, EDITOR_HEADER_CLASSNAME } from '@/pages/Canvas/constants';
import { EngineContext, ManagerContext } from '@/pages/Canvas/contexts';
import { ConnectedProps, Nullable } from '@/types';

import { ActiveLabel, Breadcrumbs, Container, Divider, Label, Title, TitleActionsContainer } from './components';

export interface HeaderProps {
  path?: { label: string }[];
  onRename: (value: string) => void;
  goToPath: (index: number) => void;
  className?: string;
  hideTitle?: boolean;
  renameRevision?: Nullable<string>;
}

const EditorHeader: React.FC<ConnectedHeaderProps & HeaderProps> = ({
  path = [],
  data,
  onRename,
  className,
  goToPath,
  hideTitle,
  renameRevision,
}) => {
  const sidebar = React.useContext(SidebarContext)!;
  const engine = React.useContext(EngineContext)!;
  const getManager = React.useContext(ManagerContext)!;
  const { headerActions } = sidebar.state;

  const { label, nameEditable } = getManager(data!.type);

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
          <Title name={nameEditable ? data!.name : label} disabled={!nameEditable} onChange={onRename} renameRevision={renameRevision} />

          {!!headerActions.length && (
            <Dropdown
              options={headerActions.map(({ onClick, ...action }) => ({ ...action, onClick: () => onClick({ data: data!, engine }) }))}
              placement="bottom-end"
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

type ConnectedHeaderProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(EditorHeader) as React.FC<HeaderProps>;
