import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { LINK, LINK_ID, MOCK_STATE, NODE_ID, PORT_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - link selectors', ({ describeSelectors, createState }) => {
  describeSelectors(({ select }) => {
    describe('allLinkIDsSelector()', () => {
      it('select all link IDs', () => {
        expect(select(CreatorV2.allLinkIDsSelector)).toEqual([LINK_ID]);
      });
    });

    describe('allLinksSelector()', () => {
      it('select all links', () => {
        expect(select(CreatorV2.allLinksSelector)).toEqual([LINK]);
      });
    });

    describe('linkByIDSelector()', () => {
      it('select a link by its ID', () => {
        expect(select((state) => CreatorV2.linkByIDSelector(state, { id: LINK_ID }))).toBe(LINK);
      });

      it('select null if unrecognized ID', () => {
        expect(select((state) => CreatorV2.linkByIDSelector(state, { id: 'foo' }))).toBeNull();
      });
    });

    describe('linkIDsByNodeIDSelector()', () => {
      const fooLink = { ...LINK, id: 'fooLink' };
      const rootState = createState({
        ...MOCK_STATE,
        links: normalize([LINK, fooLink]),
        linkIDsByNodeID: { [NODE_ID]: [LINK_ID, fooLink.id] },
      });

      it('select link IDs by connected node ID', () => {
        expect(select((state) => CreatorV2.linkIDsByNodeIDSelector(state, { id: NODE_ID }), rootState)).toEqual([LINK_ID, fooLink.id]);
      });

      it('select empty array if unrecognized ID', () => {
        expect(select((state) => CreatorV2.linkIDsByNodeIDSelector(state, { id: 'foo' }), rootState)).toEqual([]);
      });
    });

    describe('hasLinksByNodeIDSelector()', () => {
      const rootState = createState({
        ...MOCK_STATE,
        linkIDsByNodeID: { [NODE_ID]: [LINK_ID] },
      });

      it('check if a node has connected links', () => {
        expect(select((state) => CreatorV2.hasLinksByNodeIDSelector(state, { id: NODE_ID }), rootState)).toBeTruthy();
      });
    });

    describe('linksByNodeIDSelector()', () => {
      const fooLink = { ...LINK, id: 'fooLink' };
      const rootState = createState({
        ...MOCK_STATE,
        links: normalize([LINK, fooLink]),
        linkIDsByNodeID: { [NODE_ID]: [LINK_ID, fooLink.id] },
      });

      it('select link IDs by connected node ID', () => {
        expect(select((state) => CreatorV2.linksByNodeIDSelector(state, { id: NODE_ID }), rootState)).toEqual([LINK, fooLink]);
      });

      it('select empty array if unrecognized node ID', () => {
        expect(select((state) => CreatorV2.linksByNodeIDSelector(state, { id: 'foo' }), rootState)).toEqual([]);
      });
    });

    describe('linkIDsByPortIDSelector()', () => {
      const fooLink = { ...LINK, id: 'fooLink' };
      const rootState = createState({
        ...MOCK_STATE,
        links: normalize([LINK, fooLink]),
        linkIDsByPortID: { [PORT_ID]: [LINK_ID, fooLink.id] },
      });

      it('select link IDs by connected port ID', () => {
        expect(select((state) => CreatorV2.linkIDsByPortIDSelector(state, { id: PORT_ID }), rootState)).toEqual([LINK_ID, fooLink.id]);
      });

      it('select empty array if unrecognized link ID', () => {
        expect(select((state) => CreatorV2.linkIDsByPortIDSelector(state, { id: 'foo' }), rootState)).toEqual([]);
      });
    });

    describe('hasLinksByPortIDSelector()', () => {
      const rootState = createState({
        ...MOCK_STATE,
        linkIDsByPortID: { [PORT_ID]: [LINK_ID] },
      });

      it('check if a node has connected links', () => {
        expect(select((state) => CreatorV2.hasLinksByPortIDSelector(state, { id: PORT_ID }), rootState)).toBeTruthy();
      });
    });

    describe('linksByPortIDSelector()', () => {
      const fooLink = { ...LINK, id: 'fooLink' };
      const rootState = createState({
        ...MOCK_STATE,
        links: normalize([LINK, fooLink]),
        linkIDsByPortID: { [PORT_ID]: [LINK_ID, fooLink.id] },
      });

      it('select link IDs by connected port ID', () => {
        expect(select((state) => CreatorV2.linksByPortIDSelector(state, { id: PORT_ID }), rootState)).toEqual([LINK, fooLink]);
      });

      it('select empty array if unrecognized link ID', () => {
        expect(select((state) => CreatorV2.linksByPortIDSelector(state, { id: 'foo' }), rootState)).toEqual([]);
      });
    });

    describe('joiningLinkIDsSelector()', () => {
      const sourceNodeID = 'sourceNodeID';
      const targetNodeID = 'targetNodeID';
      const fooLink = { ...LINK, id: 'fooLink', source: { nodeID: sourceNodeID, portID: '' }, target: { nodeID: targetNodeID, portID: '' } };
      const barLink = { ...LINK, id: 'barLink', source: { nodeID: targetNodeID, portID: '' }, target: { nodeID: sourceNodeID, portID: '' } };
      const rootState = createState({
        ...MOCK_STATE,
        links: normalize([LINK, fooLink, barLink]),
        linkIDsByNodeID: {
          [sourceNodeID]: [barLink.id, 'fizzLink', fooLink.id],
          [targetNodeID]: [barLink.id, fooLink.id, 'buzzLink'],
        },
      });

      it('select the IDs of links between the source and target nodes, ignoring the link direction', () => {
        const result = select((state) => CreatorV2.joiningLinkIDsSelector(state, { sourceNodeID, targetNodeID }), rootState);

        expect(result).toEqual([barLink.id, fooLink.id]);
      });

      it('select the IDs of links between the source and target nodes, respecting the link direction', () => {
        const result = select((state) => CreatorV2.joiningLinkIDsSelector(state, { sourceNodeID, targetNodeID, directional: true }), rootState);

        expect(result).toEqual([fooLink.id]);
      });

      it('select empty array if unrecognized source node ID', () => {
        expect(select((state) => CreatorV2.joiningLinkIDsSelector(state, { sourceNodeID: 'foo', targetNodeID }), rootState)).toEqual([]);
      });

      it('select empty array if unrecognized target node ID', () => {
        expect(select((state) => CreatorV2.joiningLinkIDsSelector(state, { targetNodeID: 'foo', sourceNodeID }), rootState)).toEqual([]);
      });
    });
  });
});
