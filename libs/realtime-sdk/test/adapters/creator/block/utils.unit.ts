import { syncDynamicPortsLength } from '@realtime-sdk/adapters/creator/block/utils';

describe('Adapters | Creator | Block | Utils', () => {
  describe('syncDynamicPortsLength', () => {
    it('undefined length', () => {
      const ports = { foo: 'bar' } as any;
      expect(syncDynamicPortsLength({ nodeID: 'nodeID', ports, length: undefined as any })).eql(ports);
      expect(syncDynamicPortsLength({ nodeID: 'nodeID', ports, length: null as any })).eql(ports);
      expect(syncDynamicPortsLength({ nodeID: 'nodeID', ports, length: 0.123 as any })).eql(ports);
    });

    it('equal length', () => {
      const ports = { dynamic: [{ id: 'port1' }, { id: 'port2' }], foo: 'bar' } as any;
      expect(syncDynamicPortsLength({ nodeID: 'nodeID', ports, length: 2 })).eql(ports);
    });

    it('shorter length', () => {
      const ports = { dynamic: [{ id: 'port1' }, { id: 'port2' }, { id: 'port3' }], foo: 'bar' } as any;
      expect(syncDynamicPortsLength({ nodeID: 'nodeID', ports, length: 1 })).eql({
        ...ports,
        dynamic: [{ id: 'port1' }],
      });
    });

    it('longer length', () => {
      const ports = { dynamic: [{ id: 'port1' }], foo: 'bar' } as any;
      expect(syncDynamicPortsLength({ nodeID: 'nodeID', ports, length: 3 }).dynamic.length).eql(3);
      expect(syncDynamicPortsLength({ nodeID: 'nodeID', ports, length: 5 }).dynamic.length).eql(5);
      expect(syncDynamicPortsLength({ nodeID: 'nodeID', ports, length: 8 }).dynamic.length).eql(8);
    });
  });
});
