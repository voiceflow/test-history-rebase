import React from 'react';

import { DEPTH_LIMIT } from '../constants';
import FlowButton from './FlowButton';
import FlowLimit from './FlowLimit';
import SubDiagramList from './SubDiagramList';

const FlowButtonStructure = ({ diagram, depth = 0 }) => {
  if (depth > DEPTH_LIMIT) {
    return (
      <>
        <FlowButton diagram={diagram} depth={depth} />
        {diagram.children.length > 0 && (
          <SubDiagramList depth={depth}>
            <FlowLimit />
          </SubDiagramList>
        )}
      </>
    );
  }

  return (
    <>
      <FlowButton diagram={diagram} depth={depth} />
      {diagram.children.length > 0 && (
        <SubDiagramList depth={depth}>
          {diagram.children.map((childDiagram) => (
            <FlowButtonStructure diagram={childDiagram} depth={depth + 1} key={childDiagram.id} />
          ))}
        </SubDiagramList>
      )}
    </>
  );
};

export default FlowButtonStructure;
