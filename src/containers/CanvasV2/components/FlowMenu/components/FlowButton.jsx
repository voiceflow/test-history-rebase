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

import DiagramBlock from './DiagramBlock';
import DiagramButton from './DiagramButton';
import DiagramEdit from './DiagramEdit';

class FlowButton extends React.PureComponent {
  state = {
    edit: false,
    name: this.props.diagram.name || '',
  };

  handleChange = (event) =>
    this.setState({
      [event.target.name]: event.target.value,
    });

  close = async () => {
    const { renameFlow } = this.props;
    const { name } = this.state;

    renameFlow(name);
    this.setState({ edit: false });
  };

  render() {
    const { diagram, activeDiagram, goToDiagram, depth = 0, copyFlow, deleteFlow } = this.props;
    const { edit, name } = this.state;

    const isActive = activeDiagram === diagram.id;

    return (
      <DiagramBlock className={cn({ active: isActive })}>
        <DiagramButton className="diagram-button" onClick={isActive ? null : () => goToDiagram(diagram.id)} depth={depth}>
          {edit ? (
            <Input
              variant="inline"
              name="name"
              className="diagram-text"
              value={name}
              onChange={this.handleChange}
              onKeyPress={(target) => (target.charCode === 13 ? this.close() : null)}
              onBlur={this.close}
              onFocus={(event) => event.target.select()}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          ) : (
            <span className="diagram-text">
              {/* eslint-disable no-nested-ternary */}
              {diagram.name === ROOT_DIAGRAM_NAME
                ? 'Home'
                : _.trim(diagram.name)
                ? diagram.name.length > 15
                  ? `${diagram.name.substring(0, 15)}...`
                  : diagram.name
                : 'Flow'}
              {/* eslint-enable no-nested-ternary */}
            </span>
          )}
        </DiagramButton>

        {diagram.name !== ROOT_DIAGRAM_NAME && !edit && (
          <Dropdown
            options={[
              {
                label: 'Edit Name',
                onClick: () => this.setState({ edit: true, name: diagram.name }),
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
              <DiagramEdit tag="button" onClick={onToggle} ref={ref}>
                <i className="fas fa-cog" />
              </DiagramEdit>
            )}
          </Dropdown>
        )}
      </DiagramBlock>
    );
  }
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

const mergeProps = (_, { copyDiagram, deleteDiagram, renameDiagram, setConfirm }, { diagram }) => ({
  copyFlow: () => copyDiagram(diagram.id),
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
      confirm: () => deleteDiagram(diagram.id),
    }),
  renameFlow: (name) => renameDiagram(diagram.id, name),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(FlowButton);
