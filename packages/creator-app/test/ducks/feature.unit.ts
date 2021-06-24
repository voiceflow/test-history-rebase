import { generate } from '@voiceflow/ui';

import * as Feature from '@/ducks/feature';

import suite from './_suite';

const FEATURE_ID: any = generate.id();
const TIMESTAMP = 1234500000;
const FEATURE = { isEnabled: true, lastUpdated: TIMESTAMP };
const MOCK_STATE: Feature.FeatureState = {
  isLoaded: true,
  isWorkspaceLoaded: true,
  features: {
    [FEATURE_ID]: FEATURE,
    ghi: { isEnabled: false },
  } as any,
};

suite(Feature, MOCK_STATE)('Ducks - Feature', ({ expect, mockDate, describeReducer, describeSelectors }) => {
  describeReducer(({ expectAction }) => {
    describe('setFeaturesLoaded()', () => {
      it('should mark the features as loaded', () => {
        const featureID: any = generate.id();
        const timestamp = TIMESTAMP + 1000;
        mockDate(timestamp);

        expectAction(Feature.setFeaturesLoaded({ [featureID]: { isEnabled: true } }))
          .withState({ isLoaded: false } as Feature.FeatureState)
          .toModify({ isLoaded: true, features: { [featureID]: { isEnabled: true } } });
      });
    });

    describe('setWorkspaceFeaturesLoaded()', () => {
      it('should mark the workspace features as loaded', () => {
        const featureID: any = generate.id();
        const timestamp = TIMESTAMP + 1000;
        mockDate(timestamp);

        expectAction(Feature.setWorkspaceFeaturesLoaded({ [featureID]: { isEnabled: true } }))
          .withState({ isWorkspaceLoaded: false } as Feature.FeatureState)
          .toModify({ isWorkspaceLoaded: true, features: { [featureID]: { isEnabled: true } } });
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

    describe('isWorkspaceLoadedSelector()', () => {
      it('should select whether workspace features are loaded', () => {
        expect(select(Feature.isWorkspaceLoadedSelector)).to.be.true;
      });
    });
  });
});
