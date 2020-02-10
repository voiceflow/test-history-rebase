import cn from 'classnames';
import _ from 'lodash';
import React from 'react';
import { Alert } from 'reactstrap';

import Dropdown from '@/components/Dropdown';
import Input from '@/components/Input';
import SvgIcon from '@/components/SvgIcon';
import { Members } from '@/components/User';
import { ROOT_DIAGRAM_NAME } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as Modal from '@/ducks/modal';
import * as Router from '@/ducks/router';
import { activeDiagramIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { diagramViewersSelector } from '@/store/selectors';
import { stopPropagation } from '@/utils/dom';

import DiagramBlock from './DiagramBlock';
import DiagramButton from './DiagramButton';
import DiagramEdit from './DiagramEdit';
import MembersWrapper from './MembersWrapper';

function FlowButton({ id, name, isLimit, activeDiagram, goToDiagram, depth = 0, copyFlow, deleteFlow, renameFlow, viewers }) {
  const [state, setState] = React.useState({ edit: false, name: name || '' });

  const onChange = React.useCallback(({ target }) => setState((s) => ({ ...s, name: target.value })), [setState]);
  const onClose = React.useCallback(() => {
    renameFlow(state.name);
    setState((s) => ({ ...s, edit: false }));
  }, [state.name, renameFlow]);

  const isActive = activeDiagram === id;

  return (
    <DiagramBlock>
      <DiagramButton depth={depth} onClick={isActive ? null : goToDiagram} disabled={isLimit} className={cn('diagram-button', { active: isActive })}>
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
                  ...(viewers.length
                    ? []
                    : [
                        {
                          label: 'Delete',
                          onClick: deleteFlow,
                        },
                      ]),
                ]}
                placement="bottom-end"
              >
                {(ref, onToggle, isOpen) => (
                  <DiagramEdit tag="button" onClick={stopPropagation(onToggle)} ref={ref} isOpen={isOpen}>
                    <SvgIcon size={14} icon="cog" />
                  </DiagramEdit>
                )}
              </Dropdown>
            )}
          </>
        )}

        <MembersWrapper>
          <Members members={viewers} />
        </MembersWrapper>
      </DiagramButton>
    </DiagramBlock>
  );
}

const mapStateToProps = {
  activeDiagram: activeDiagramIDSelector,
  viewers: diagramViewersSelector,
};

const mapDispatchToProps = {
  renameDiagram: Diagram.renameDiagram,
  copyDiagram: Diagram.copyDiagram,
  deleteDiagram: Diagram.deleteDiagram,
  goToDiagram: Router.goToDiagram,
  setConfirm: Modal.setConfirm,
  setError: Modal.setError,
};

const mergeProps = ({ viewers: getViewers }, { copyDiagram, deleteDiagram, renameDiagram, goToDiagram, setConfirm, setError }, { id }) => ({
  viewers: getViewers(id),
  copyFlow: () => copyDiagram(id),
  deleteFlow: () =>
    setConfirm({
      warning: true,
      text: (
        <Alert color="danger" className="mb-0">
          Deleting this flow permanently deletes everything inside and can not be recovered
          <br />
          <br />
          Are you sure ?
        </Alert>
      ),
      confirm: () => deleteDiagram(id).catch((err) => setError(err.message)),
    }),
  renameFlow: (name) => renameDiagram(id, name),
  goToDiagram: () => goToDiagram(id),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(FlowButton);
