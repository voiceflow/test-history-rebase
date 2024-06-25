import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { MOCK_STATE, NODE_ID, PORT, PORT_ID } from '../_fixtures';

const NODE_PORTS: Realtime.NodePorts = {
  in: ['inPort'],
  out: {
    byKey: {},
    dynamic: ['dynamicPort'],
    builtIn: {
      [BaseModels.PortType.NEXT]: 'builtInPort',
    },
  },
};

const INITIAL_STATE: CreatorV2.CreatorState = {
  ...MOCK_STATE,
  portsByNodeID: { [NODE_ID]: NODE_PORTS },
};

suite(CreatorV2, INITIAL_STATE)('Ducks | Creator V2 - port selectors', ({ describeSelectors, createState }) => {
  describeSelectors(({ select }) => {
    describe('portByIDSelector()', () => {
      it('select a port by its ID', () => {
        expect(select((state) => CreatorV2.portByIDSelector(state, { id: PORT_ID }))).toBe(PORT);
      });

      it('select null if unrecognized ID', () => {
        expect(select((state) => CreatorV2.portByIDSelector(state, { id: 'foo' }))).toBeNull();
      });
    });

    describe('allPortsByIDsSelector()', () => {
      it('select a list of ports by their IDs', () => {
        const fooPort = { ...PORT, id: 'fooPort' };
        const barPort = { ...PORT, id: 'barPort' };
        const rootState = createState({
          ...INITIAL_STATE,
          ports: normalize([PORT, fooPort, barPort]),
        });

        const ports = select(
          (state) => CreatorV2.allPortsByIDsSelector(state, { ids: [fooPort.id, barPort.id] }),
          rootState
        );

        expect(ports).toEqual([fooPort, barPort]);
      });

      it('select empty array if unrecognized IDs', () => {
        expect(select((state) => CreatorV2.allPortsByIDsSelector(state, { ids: ['foo', 'bar'] }))).toEqual([]);
      });
    });

    describe('portsByNodeIDSelector()', () => {
      it('select ports by a node ID', () => {
        expect(select((state) => CreatorV2.portsByNodeIDSelector(state, { id: NODE_ID }))).toBe(NODE_PORTS);
      });

      it('select empty ports if unrecognized node ID', () => {
        expect(select((state) => CreatorV2.portsByNodeIDSelector(state, { id: 'foo' }))).toEqual(
          Realtime.Utils.port.createEmptyNodePorts()
        );
      });
    });
  });
});
