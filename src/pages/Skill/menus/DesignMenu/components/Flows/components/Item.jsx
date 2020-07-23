import React from 'react';

import ContextMenu from '@/components/ContextMenu';
import { OverflowText } from '@/components/Text';
import { Members } from '@/components/User';
import * as Diagram from '@/ducks/diagram';
import * as Modal from '@/ducks/modal';
import * as Router from '@/ducks/router';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useToggle } from '@/hooks';
import { diagramViewersSelector } from '@/store/selectors';
import { ClassName } from '@/styles/constants';
import { withEnterPress } from '@/utils/dom';

import ItemContainer from './ItemContainer';
import ItemDeleteConfirm from './ItemDeleteConfirm';
import ItemInput from './ItemInput';

const Item = ({ id, name, isActive, viewers, setError, setConfirm, copyDiagram, goToDiagram, renameDiagram, deleteDiagram, rootDiagramID }) => {
  const [renameEnabled, toggleRenameEnabled] = useToggle(false);
  const [label, setLabel] = React.useState(name || '');

  const menuOptions = React.useMemo(() => {
    const options = [
      { label: 'Duplicate', onClick: () => copyDiagram(id) },
      {
        label: 'Delete',
        onClick: () =>
          setConfirm({
            text: <ItemDeleteConfirm />,
            warning: true,
            confirm: () => deleteDiagram(id).catch((err) => setError(err.message)),
          }),
      },
    ];
    if (id !== rootDiagramID) options.unshift({ label: 'Rename', onClick: toggleRenameEnabled });

    return options;
  }, [id, setError, setConfirm, copyDiagram, deleteDiagram, toggleRenameEnabled, rootDiagramID]);

  const onSaveName = () => {
    renameDiagram(id, label);
    toggleRenameEnabled(false);
  };

  React.useEffect(() => {
    if (name !== label) {
      setLabel(name);
    }
  }, [name]);

  return (
    <ContextMenu options={menuOptions}>
      {({ isOpen, onContextMenu }) => (
        <ItemContainer
          className={ClassName.FLOW_MENU_ITEM}
          onClick={isActive ? null : () => goToDiagram(id)}
          isActive={isActive}
          onContextMenu={onContextMenu}
          isContextMenuOpen={isOpen}
        >
          {renameEnabled ? (
            <ItemInput
              value={label}
              onBlur={onSaveName}
              variant="inline"
              onFocus={({ target }) => target.select()}
              onChange={({ target }) => setLabel(target.value)}
              autoFocus // eslint-disable-line jsx-a11y/no-autofocus
              onKeyPress={withEnterPress(onSaveName)}
            />
          ) : (
            <OverflowText>{label}</OverflowText>
          )}
          <Members max={3} members={viewers} />
        </ItemContainer>
      )}
    </ContextMenu>
  );
};

const mapStateToProps = {
  getDiagramViewers: diagramViewersSelector,
  rootDiagramID: Skill.rootDiagramIDSelector,
};

const mapDispatchToProps = {
  setError: Modal.setError,
  setConfirm: Modal.setConfirm,
  copyDiagram: Diagram.copyDiagram,
  goToDiagram: Router.goToDiagram,
  deleteDiagram: Diagram.deleteDiagram,
  renameDiagram: Diagram.renameDiagram,
};

const mergeProps = ({ getDiagramViewers }, _, { id }) => ({
  viewers: getDiagramViewers(id),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Item);
