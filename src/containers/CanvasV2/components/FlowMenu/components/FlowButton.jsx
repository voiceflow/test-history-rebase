import cn from 'classnames';
import _ from 'lodash';
import React from 'react';
import { Alert } from 'reactstrap';

import Dropdown from '@/componentsV2/Dropdown';
import Input from '@/componentsV2/Input';
import { ROOT_DIAGRAM_NAME } from '@/constants';
import { copyDiagram, deleteDiagram, renameDiagram } from '@/ducks/diagram';
import { setConfirm } from '@/ducks/modal';
import { goToDiagram } from '@/ducks/router';
import { activeDiagramIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { stopPropagation } from '@/utils/dom';

import DiagramBlock from './DiagramBlock';
import DiagramButton from './DiagramButton';
import DiagramEdit from './DiagramEdit';

function FlowButton({ id, name, isLimit, activeDiagram, goToDiagram, depth = 0, copyFlow, deleteFlow, renameFlow }) {
  const [state, setState] = React.useState({ edit: false, name: name || '' });

  const onChange = React.useCallback(({ target }) => setState((s) => ({ ...s, name: target.value })), [setState]);
  const onClose = React.useCallback(() => {
    renameFlow(state.name);
    setState((s) => ({ ...s, edit: false }));
  }, [state.name, renameFlow]);

  const isActive = activeDiagram === id;

  return (
    <DiagramBlock>
      <DiagramButton
        depth={depth}
        onClick={isActive ? null : () => goToDiagram(id)}
        disabled={isLimit}
        className={cn('diagram-button', { active: isActive })}
      >
        {isLimit ? (
          <span className="diagram-text">{name}</span>
        ) : (
          <>
            {' '}
            {state.edit ? (
              <Input
                variant="inline"
                name="name"
                className="diagram-text"
                value={state.name}
                onChange={onChange}
                onKeyPress={(target) => (target.charCode === 13 ? onClose() : null)}
                onBlur={onClose}
                onFocus={(event) => event.target.select()}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
            ) : (
              <span className="diagram-text">
                {/* eslint-disable no-nested-ternary */}
                {name === ROOT_DIAGRAM_NAME ? 'Home' : _.trim(name) || 'Flow'}
                {/* eslint-enable no-nested-ternary */}
              </span>
            )}
            {!isLimit && name !== ROOT_DIAGRAM_NAME && !state.edit && (
              <Dropdown
                options={[
                  {
                    label: 'Edit Name',
                    onClick: () => setState({ edit: true, name }),
                  },
                  {
                    label: 'Copy',
                    onClick: copyFlow,
                  },
                  {
                    label: 'Delete',
                    onClick: deleteFlow,
                  },
                ]}
                placement="bottom-end"
              >
                {(ref, onToggle) => (
                  <DiagramEdit tag="button" onClick={stopPropagation(onToggle)} ref={ref}>
                    <i className="fas fa-cog" />
                  </DiagramEdit>
                )}
              </Dropdown>
            )}
          </>
        )}
      </DiagramButton>
    </DiagramBlock>
  );
}

const mapStateToProps = {
  activeDiagram: activeDiagramIDSelector,
};

const mapDispatchToProps = {
  renameDiagram,
  copyDiagram,
  deleteDiagram,
  goToDiagram,
  setConfirm,
};

const mergeProps = (_, { copyDiagram, deleteDiagram, renameDiagram, setConfirm }, { id }) => ({
  copyFlow: () => copyDiagram(id),
  deleteFlow: () =>
    setConfirm({
      warning: true,
      text: (
        <Alert color="danger" className="mb-0">
          <i className="fas fa-exclamation-triangle fa-2x" />
          <br />
          Deleting this flow permanently deletes everything inside and can not be recovered
          <br />
          <br />
          Are you sure ?
        </Alert>
      ),
      confirm: () => deleteDiagram(id),
    }),
  renameFlow: (name) => renameDiagram(id, name),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(FlowButton);
