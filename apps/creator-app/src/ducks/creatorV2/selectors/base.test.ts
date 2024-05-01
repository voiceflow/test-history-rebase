import { normalize } from 'normal-store';
import { describe, expect, it } from 'vitest';

import * as CreatorV2 from '@/ducks/creatorV2';
import * as Domain from '@/ducks/domain';
import * as Session from '@/ducks/session';
import * as VersionV2 from '@/ducks/versionV2';

import { createDuckTools } from '../../_suite';
import { DIAGRAM_ID, DOMAIN_ID, MOCK_STATE, VERSION_ID } from '../creator.fixture';

const { describeSelectors } = createDuckTools(CreatorV2, MOCK_STATE);

describe('Ducks | Creator V2 - base selectors', () => {
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
          [Session.STATE_KEY]: { activeVersionID: VERSION_ID, activeDomainID: DOMAIN_ID },
          [Domain.STATE_KEY]: normalize([{ id: DOMAIN_ID, rootDiagramID: DIAGRAM_ID }]),
        };

        expect(select(CreatorV2.isRootDiagramActiveSelector, rootState)).toBeTruthy();
      });

      it('return false if this is not the root diagram', () => {
        expect(select(CreatorV2.isRootDiagramActiveSelector)).toBeFalsy();
      });
    });
  });
});
