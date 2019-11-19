import React from 'react';
import { List, WindowScroller } from 'react-virtualized';

import { connect } from '@/hocs';
import { rootFlowStructureSelector, unusedDiagramsSelector } from '@/store/selectors';

import { DEPTH_LIMIT } from '../constants';
import FlowButton from './FlowButton';
import SectionTitle from './SectionTitle';

// eslint-disable-next-line max-params
const getFlatFlowsAndOverDepthFlows = (flow, key = '', depth = 0, flat = [], overDepthFlows = [], visited = new Set()) => {
  const newKey = `${key}/${flow.id}`;

  if (depth <= DEPTH_LIMIT) {
    visited.add(flow.id);

    flat.push({ id: flow.id, key: newKey, name: flow.name, depth });

    if (depth === DEPTH_LIMIT && flow.children.length) {
      flat.push({ id: `${flow.id}/limit`, key: `${newKey}/limit`, name: '...', depth: depth + 1, isLimit: true });
    }

    flow.children.forEach((subFlow) => getFlatFlowsAndOverDepthFlows(subFlow, newKey, depth + 1, flat, overDepthFlows, visited));
  } else if (!visited.has(flow.id)) {
    visited.add(flow.id);

    overDepthFlows.push({ id: flow.id, key: newKey, name: flow.name, depth: 0 });

    flow.children.forEach((subFlow) => getFlatFlowsAndOverDepthFlows(subFlow, newKey, depth + 1, flat, overDepthFlows, visited));
  }

  return [flat, overDepthFlows];
};

const FlowStructure = ({ scrollNode, unusedDiagrams, rootFlowStructure }) => {
  const [flatFlows, overDepthFlows] = React.useMemo(() => getFlatFlowsAndOverDepthFlows(rootFlowStructure), [rootFlowStructure]);
  const otherFlows = React.useMemo(() => [...unusedDiagrams, ...overDepthFlows], [unusedDiagrams, overDepthFlows]);

  const treeRowRenderer = React.useCallback(
    ({ key, index, style }) => (
      <div key={key} style={style}>
        <FlowButton {...flatFlows[index]} />
      </div>
    ),
    [flatFlows]
  );

  const otherFlowRenderer = React.useCallback(
    ({ key, index, style }) => (
      <div key={key} style={style}>
        <FlowButton {...otherFlows[index]} />
      </div>
    ),
    [otherFlows]
  );

  return (
    <>
      <WindowScroller scrollElement={scrollNode}>
        {({ height, isScrolling, registerChild, scrollTop }) =>
          !!height && (
            <>
              <SectionTitle className="search-section mt-1">Project Flows</SectionTitle>

              <div ref={registerChild}>
                <List
                  width={250}
                  height={height}
                  scrollTop={scrollTop}
                  rowCount={flatFlows.length}
                  rowHeight={42}
                  autoHeight
                  rowRenderer={treeRowRenderer}
                  isScrolling={isScrolling}
                />
              </div>
            </>
          )
        }
      </WindowScroller>

      {!!otherFlows.length && (
        <WindowScroller scrollElement={scrollNode}>
          {({ height, isScrolling, registerChild, scrollTop }) =>
            !!height && (
              <>
                <hr className="mb-2 mt-2" />

                <SectionTitle className="search-section mt-3">Other Flows</SectionTitle>

                <div ref={registerChild}>
                  <List
                    width={250}
                    height={height}
                    scrollTop={scrollTop}
                    rowCount={otherFlows.length}
                    rowHeight={42}
                    autoHeight
                    rowRenderer={otherFlowRenderer}
                    isScrolling={isScrolling}
                  />
                </div>
              </>
            )
          }
        </WindowScroller>
      )}
    </>
  );
};

const mapStateToProps = {
  unusedDiagrams: unusedDiagramsSelector,
  rootFlowStructure: rootFlowStructureSelector,
};

export default connect(mapStateToProps)(FlowStructure);
