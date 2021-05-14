import React from 'react';

import ContextMenu from '@/components/ContextMenu';
import { InputVariant } from '@/components/Input';
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
import { ConnectedProps, MergeArguments } from '@/types';
import { withEnterPress } from '@/utils/dom';

import ItemContainer from './ItemContainer';
import ItemDeleteConfirm from './ItemDeleteConfirm';
import ItemInput from './ItemInput';

type ItemProps = {
  id: string;
  name: string;
  isActive: boolean;
};

const Item: React.FC<ItemProps & ConnectedItemProps> = ({
  id,
  name,
  isActive,
  viewers,
  setError,
  setConfirm,
  copyDiagram,
  goToDiagram,
  renameDiagram,
  deleteDiagram,
  rootDiagramID,
}) => {
  const [renameEnabled, toggleRenameEnabled] = useToggle(false);
  const [label, setLabel] = React.useState(name || '');

  const menuOptions = React.useMemo(() => {
    const options = [
      { label: 'Duplicate', onClick: () => copyDiagram(id, { openDiagram: true }) },
      {
        label: 'Delete',
        onClick: () => {
          setConfirm({
            text: <ItemDeleteConfirm />,
            warning: true,
            confirm: () => {
              deleteDiagram(id).catch(() => {
                setError("Another user is currently using this flow. Please wait until they're done before deleting");
              });
            },
          });
        },
      },
    ];

    if (id !== rootDiagramID) {
      options.unshift({ label: 'Rename', onClick: () => toggleRenameEnabled() });
    }

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
    <ContextMenu options={menuOptions as any[]}>
      {({ isOpen, onContextMenu }) => (
        <ItemContainer
          className={ClassName.FLOW_MENU_ITEM}
          onClick={isActive ? undefined : () => goToDiagram(id)}
          isActive={isActive}
          onContextMenu={onContextMenu}
          isContextMenuOpen={isOpen}
        >
          {renameEnabled ? (
            <ItemInput
              value={label}
              onBlur={onSaveName}
              variant={InputVariant.INLINE}
              onFocus={({ target }) => target.select()}
              onChange={({ target }) => setLabel(target.value)}
              autoFocus // eslint-disable-line jsx-a11y/no-autofocus
              onKeyPress={withEnterPress(onSaveName)}
            />
          ) : (
            <OverflowText>{label}</OverflowText>
          )}
          <Members max={3} members={viewers as any[]} />
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

const mergeProps = (...[{ getDiagramViewers }, , { id }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps, ItemProps>) => ({
  viewers: getDiagramViewers(id),
});

type ConnectedItemProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Item);
