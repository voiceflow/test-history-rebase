import cn from 'classnames';
import React from 'react';

import Dropdown from '@/components/Dropdown';
import IconButton, { IconButtonVariant } from '@/components/IconButton';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import type { NodeData } from '@/models';
import { SidebarContext } from '@/pages/Canvas/components/EditorSidebar/contexts';
import { EDITOR_BREADCRUMBS_CLASSNAME, EDITOR_HEADER_CLASSNAME } from '@/pages/Canvas/constants';
import { EngineContext } from '@/pages/Canvas/contexts';
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

const AnyDropdown = Dropdown as any;

const EditorHeader: React.FC<EditorHeaderProps> = ({ path = [], data, onRename, className, goToPath, hideTitle, renameRevision }) => {
  const sidebar = React.useContext(SidebarContext)!;
  const engine = React.useContext(EngineContext)!;
  const { headerActions } = sidebar.state;

  let fullPath = '';

  return (
    <Container withTitle={!hideTitle && (path.length <= 1 || !!headerActions.length)} className={cn(EDITOR_HEADER_CLASSNAME, className)}>
      {!!path.length && (
        <Breadcrumbs className={EDITOR_BREADCRUMBS_CLASSNAME}>
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

      {!hideTitle && (
        <TitleActionsContainer>
          <Title name={data.name} onChange={onRename} renameRevision={renameRevision} />

          {!!headerActions.length && (
            <AnyDropdown
              placement="bottom-end"
              options={headerActions.map(({ onClick, ...action }) => ({ ...action, onClick: () => onClick({ data, engine }) }))}
            >
              {(ref: React.Ref<HTMLButtonElement>, onOpen: () => void, isOpened: boolean) => (
                <IconButton ref={ref} icon="elipsis" variant={IconButtonVariant.FLAT} onClick={onOpen} active={isOpened} />
              )}
            </AnyDropdown>
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
