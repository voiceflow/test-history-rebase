import React from 'react';

import { connect } from '@/hocs';
import { rootFlowStructureSelector, unusedDiagramsSelector } from '@/store/selectors';

import { DEPTH_LIMIT } from '../constants';
import FlowButton from './FlowButton';
import FlowButtonStructure from './FlowButtonStructure';
import SectionTitle from './SectionTitle';

const getOverDepthFlows = (flowTree, overDepthFlows = new Set(), visited = new Set(), depth = 0) =>
  flowTree.children.reduce((acc, childFlowData) => {
    if (visited.has(childFlowData.id)) {
      if (depth <= DEPTH_LIMIT && acc.has(childFlowData)) {
        acc.add(childFlowData);
      }
    } else {
      visited.add(childFlowData.id);

      if (depth > DEPTH_LIMIT) {
        acc.add(childFlowData);
      }

      return getOverDepthFlows(childFlowData, acc, visited, depth + 1);
    }

    return acc;
  }, overDepthFlows);

const FlowStructure = ({ unusedDiagrams, rootFlowStructure }) => {
  const overDepthFlows = getOverDepthFlows(rootFlowStructure);
  const otherFlows = [...unusedDiagrams, ...overDepthFlows];

  return (
    <>
      <SectionTitle className="search-section mt-1">Project Flows</SectionTitle>

      <FlowButtonStructure diagram={rootFlowStructure} />

      {!!otherFlows.length && (
        <>
          <hr className="mb-2 mt-2" />
          <SectionTitle className="search-section mt-3">Other Flows</SectionTitle>
          {otherFlows.map((diagram) => (
            <FlowButton diagram={diagram} key={diagram.id} />
          ))}
        </>
      )}
    </>
  );
};

const mapStateToProps = {
  rootFlowStructure: rootFlowStructureSelector,
  unusedDiagrams: unusedDiagramsSelector,
};

export default connect(mapStateToProps)(FlowStructure);
