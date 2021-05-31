import { composeDecorators, withRedux } from '_storybook';
import { ConditionsLogicInterface, ExpressionTypeV2 } from '@voiceflow/general-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Creator from '@/ducks/creator';
import { EngineProvider } from '@/pages/Canvas/contexts';
import { objectID } from '@/utils';

import IfEditor from './IfEditorV2';

const NODE_ID = '1';

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
            allKeys: ['1'],
            byKey: {
              1: {},
            },
          },
          data: {
            [NODE_ID]: {
              name: 'name',
              expressions: [
                {
                  id: 'id_1',
                  type: null,
                  name: 'first logic',
                  value: [
                    {
                      id: 'logic details',
                      type: ExpressionTypeV2.NOT_EQUAL,
                      logicInterface: ConditionsLogicInterface.VARIABLE,
                      value: [
                        {
                          type: ExpressionTypeV2.VARIABLE,
                          value: 'platform',
                        },
                        {
                          type: ExpressionTypeV2.VALUE,
                          value: 'google',
                        },
                      ],
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
  const onChange = React.useCallback((newData) => dispatch(Creator.updateNodeData(NODE_ID, newData)), []);

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
      add: (_, port: any) => dispatch(Creator.addPort(NODE_ID, objectID(), port)),
      remove: (portID: any) => dispatch(Creator.removePort(portID)),
    },
  });

  return (
    <>
      <EngineProvider value={engine.current as any}>
        <div style={{ width: '480px', maxHeight: '400px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
          <IfEditor {...getProps()} />
        </div>
      </EngineProvider>
    </>
  );
});
