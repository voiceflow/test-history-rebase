import cuid from 'cuid';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { composeDecorators, withRedux } from '@/../.storybook';
import * as Creator from '@/ducks/creator';
import { EngineProvider } from '@/pages/Canvas/contexts';

import IfEditor from './IfEditor';

const NODE_ID = 1;

const withDecorators = composeDecorators(
  withRedux({
    creator: {
      focus: {
        target: NODE_ID,
        isActive: true,
      },
      diagram: {
        past: [],
        present: {
          ports: {
            allKeys: [1],
            byKey: {
              1: {},
            },
          },
          data: {
            [NODE_ID]: {
              name: 'name',
              expressions: [
                {
                  type: 'equals',
                  depth: 0,
                  value: [
                    {
                      type: 'variable',
                      value: 'timestamp',
                      depth: 1,
                    },
                    {
                      type: 'value',
                      value: '212',
                      depth: 1,
                    },
                  ],
                },
              ],
            },
          },
          nodes: {
            allKeys: [NODE_ID],
            byKey: {
              [NODE_ID]: {
                id: [NODE_ID],
                ports: {
                  in: [],
                  out: [],
                },
              },
            },
          },
        },
        future: [],
      },
    },
  })
);

const getProps = () => {
  const dispatch = useDispatch();
  const data = useSelector(Creator.dataByNodeIDSelector)(NODE_ID);
  const onChange = React.useCallback((newData) => dispatch(Creator.updateNodeData(NODE_ID, newData)));

  return {
    data,
    onChange,
  };
};

export default {
  title: 'Creator/Editors/If Editor',
  component: IfEditor,
  includeStories: [],
};

export const normal = withDecorators(() => {
  const dispatch = useDispatch();
  const engine = React.useRef({
    port: {
      add: (_, port) => dispatch(Creator.addPort(NODE_ID, cuid(), port)),
      remove: (portID) => dispatch(Creator.removePort(portID)),
    },
  });

  return (
    <>
      <EngineProvider value={engine.current}>
        <div style={{ width: '480px', maxHeight: '400px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
          <IfEditor {...getProps()} />
        </div>
      </EngineProvider>
    </>
  );
});
