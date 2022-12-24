import { Dropdown, IconButton, IconButtonVariant, preventDefault } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs/connect';
import { SidebarContext } from '@/pages/Canvas/components/EditorSidebar/contexts';
import { EDITOR_BREADCRUMBS_CLASSNAME, EDITOR_HEADER_CLASSNAME } from '@/pages/Canvas/constants';
import { EngineContext } from '@/pages/Canvas/contexts';
import { ConnectedProps } from '@/types';

import { ActiveLabel, Breadcrumbs, Container, Divider, Label } from './components';

export interface HeaderProps {
  path?: { label: string }[];
  onRename: (value: string) => void;
  goToPath: (index: number) => void;
  className?: string;
}

const EditorHeader: React.FC<ConnectedHeaderProps & HeaderProps> = ({ path = [], data, className, goToPath }) => {
  const sidebar = React.useContext(SidebarContext)!;
  const engine = React.useContext(EngineContext)!;
  const { headerActions } = sidebar.state;

  let fullPath = '';

  return (
    <Container className={cn(EDITOR_HEADER_CLASSNAME, className)}>
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

      {!!headerActions.length && (
        <Dropdown
          options={headerActions.map(({ onClick, ...action }) => ({ ...action, onClick: () => onClick({ data: data!, engine }) }))}
          placement="bottom-end"
        >
          {(ref, onOpen, isOpened) => (
            <div>
              <IconButton ref={ref} icon="ellipsis" variant={IconButtonVariant.BASIC} onClick={onOpen} activeClick={isOpened} />
            </div>
          )}
        </Dropdown>
      )}
    </Container>
  );
};

const mapStateToProps = {
  data: Creator.focusedNodeDataSelector,
};

type ConnectedHeaderProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(EditorHeader) as React.FC<HeaderProps>;
