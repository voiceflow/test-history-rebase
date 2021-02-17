import * as Feature from '@/ducks/feature';
import { generate } from '@/utils/testing';

import suite from './_suite';

const FEATURE_ID: any = generate.id();
const TIMESTAMP = 1234500000;
const FEATURE = { isEnabled: true, lastUpdated: TIMESTAMP };
const MOCK_STATE: Feature.FeatureState = {
  isLoaded: true,
  features: {
    [FEATURE_ID]: FEATURE,
    ghi: { isEnabled: false },
  } as any,
};

suite(Feature, MOCK_STATE)('Ducks - Feature', ({ expect, mockDate, describeReducer, describeSelectors }) => {
  describeReducer(({ expectAction }) => {
    describe('updateAllStatuses()', () => {
      it('should update all feature statuses', () => {
        const featureID: any = generate.id();
        const timestamp = TIMESTAMP + 1000;
        mockDate(timestamp);

        expectAction(Feature.updateAllStatuses({ [featureID]: { isEnabled: true } })).toModify({
          features: { [featureID]: { isEnabled: true } },
        });
      });
    });

    describe('setFeaturesLoaded()', () => {
      it('should mark the features as loaded', () => {
        expectAction(Feature.setFeaturesLoaded())
          .withState({ isLoaded: false } as Feature.FeatureState)
          .toModify({ isLoaded: true });
      });
    });
  });

  describeSelectors(({ select }) => {
    describe('featureSelector()', () => {
      it('should select feature', () => {
        expect(select(Feature.featureSelector)(FEATURE_ID)).to.eq(FEATURE);
      });
    });

    describe('isFeatureEnabledSelector()', () => {
      it('should select that feature is enabled', () => {
        expect(select(Feature.isFeatureEnabledSelector)(FEATURE_ID)).to.be.true;
      });

      it('should select that feature is not enabled', () => {
        expect(select(Feature.isFeatureEnabledSelector)('ghi' as any)).to.be.false;
      });

      it('should select that feature is not registered', () => {
        expect(select(Feature.isFeatureEnabledSelector)('xyz' as any)).to.be.null;
      });
    });

    describe('isLoadedSelector()', () => {
      it('should select whether features are loaded', () => {
        expect(select(Feature.isLoadedSelector)).to.be.true;
      });
    });
  });
});
