import React from 'react';

import Dropdown from '@/components/Dropdown';
import IconButton, { IconButtonVariant } from '@/components/IconButton';
import SvgIcon, { IconVariant } from '@/components/SvgIcon';
import { ROOT_DIAGRAM_NAME } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { ConnectedProps, MergeArguments } from '@/types';
import { stopPropagation } from '@/utils/dom';
import { findAncestors, findChildren } from '@/utils/flow';

import { Container, Section } from './components';

type FlowBarProps = {
  flow: Diagram.StructuredFlow;
};

const FlowBar: React.FC<FlowBarProps & ConnectedFlowBarProps> = ({ goToRootDiagram, flow, parentDiagrams, childDiagrams, goToDiagram }) => (
  <Container>
    <Section flexDirection="start">
      <Dropdown
        options={parentDiagrams.map(({ id, name }) => ({
          value: id,
          label: name === ROOT_DIAGRAM_NAME ? 'Home' : name,
          onClick: () => (name === ROOT_DIAGRAM_NAME ? goToRootDiagram() : goToDiagram(id)),
        }))}
      >
        {(ref, onToggle, isOpen) => (
          <IconButton
            icon="back"
            variant={IconButtonVariant.FLAT}
            active={isOpen}
            onClick={stopPropagation(parentDiagrams.length === 0 ? undefined : onToggle)}
            ref={ref}
            disabled={parentDiagrams.length === 0}
          />
        )}
      </Dropdown>
    </Section>

    <Section>
      <SvgIcon icon="flows" size={12} />
      {flow.name}
    </Section>

    <Section flexDirection="end">
      <Dropdown
        options={childDiagrams.map(({ id, name }) => ({
          value: id,
          label: name,
          onClick: () => goToDiagram(id),
        }))}
      >
        {(ref, onToggle, isOpen) => (
          <IconButton
            icon="next"
            variant={IconButtonVariant.FLAT}
            active={isOpen}
            onClick={stopPropagation(childDiagrams.length === 0 ? undefined : onToggle)}
            ref={ref}
            disabled={childDiagrams.length === 0}
            iconProps={{ variant: IconVariant.STANDARD }}
          />
        )}
      </Dropdown>
    </Section>
  </Container>
);

const mapDispatchToProps = {
  goToDiagram: Router.goToDiagram,
  goToRootDiagram: Router.goToRootDiagram,
};

const mergeProps = (...[, , { flow }]: MergeArguments<{}, typeof mapDispatchToProps, FlowBarProps>) => ({
  parentDiagrams: flow ? findAncestors(flow) : [],
  childDiagrams: flow ? findChildren(flow) : [],
});

type ConnectedFlowBarProps = ConnectedProps<{}, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(null, mapDispatchToProps, mergeProps)(FlowBar) as React.FC<FlowBarProps>;
