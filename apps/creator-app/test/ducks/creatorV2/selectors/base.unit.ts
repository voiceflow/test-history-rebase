import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';
import * as Session from '@/ducks/session';
import * as VersionV2 from '@/ducks/versionV2';

import suite from '../../_suite';
import { DIAGRAM_ID, MOCK_STATE, VERSION_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - base selectors', ({ describeSelectors }) => {
  describeSelectors(({ select }) => {
    describe('activeDiagramIDSelector()', () => {
      it('select the active diagram ID', () => {
        expect(select(CreatorV2.activeDiagramIDSelector)).toBe(DIAGRAM_ID);
      });
    });

    describe('isRootDiagramActiveSelector()', () => {
      it('check if the active diagram is the root diagram of this project', () => {
        const rootState = {
          [VersionV2.STATE_KEY]: normalize([{ id: VERSION_ID, rootDiagramID: DIAGRAM_ID }]),
          [Session.STATE_KEY]: { activeVersionID: VERSION_ID },
        };

        expect(select(CreatorV2.isRootDiagramActiveSelector, rootState)).toBeTruthy();
      });

      it('return false if this is not the root diagram', () => {
        expect(select(CreatorV2.isRootDiagramActiveSelector)).toBeFalsy();
      });
    });
  });
});
