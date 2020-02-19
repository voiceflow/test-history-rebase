import React from 'react';

import Dropdown from '@/components/Dropdown';
import IconButton from '@/components/IconButton';
import SvgIcon from '@/components/SvgIcon';
import { ROOT_DIAGRAM_NAME } from '@/constants';
import { goToDiagram, goToRootDiagram } from '@/ducks/router';
import { connect } from '@/hocs';
import { stopPropagation } from '@/utils/dom';
import { findAncestors, findChildren } from '@/utils/flow';

import { Container, Section } from './components';

function FlowBar({ withMenu, withDrawer, goToRootDiagram, flow, parentDiagrams, childDiagrams, goToDiagram }) {
  return (
    <Container withMenu={withMenu} withDrawer={withDrawer}>
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
              variant="flat"
              active={isOpen}
              onClick={stopPropagation(parentDiagrams.length !== 0 && onToggle)}
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
              variant="flat"
              active={isOpen}
              onClick={stopPropagation(childDiagrams.length !== 0 && onToggle)}
              ref={ref}
              disabled={childDiagrams.length === 0}
              iconProps={{ variant: 'standard' }}
            />
          )}
        </Dropdown>
      </Section>
    </Container>
  );
}

const mapDispatchToProps = {
  goToDiagram,
  goToRootDiagram,
};

const mergeProps = (_, __, { flow }) => ({
  parentDiagrams: flow ? findAncestors(flow) : [],
  childDiagrams: flow ? findChildren(flow) : [],
});

export default connect(null, mapDispatchToProps, mergeProps)(FlowBar);
