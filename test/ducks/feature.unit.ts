import client from '@/client';
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

suite(Feature, MOCK_STATE)('Ducks - Feature', ({ expect, stub, mockDate, describeReducer, describeSelectors, describeSideEffects }) => {
  describeReducer(({ expectAction }) => {
    describe('updateFeatureStatus()', () => {
      it('should update the feature status', () => {
        const featureID: any = generate.id();
        const timestamp = TIMESTAMP + 1000;
        mockDate(timestamp);

        expectAction(Feature.updateFeatureStatus(featureID, false)).toModify({
          features: { ...MOCK_STATE.features, [featureID]: { isEnabled: false, lastUpdated: timestamp } },
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

  describeSideEffects(({ applyEffect }) => {
    describe('refreshFeature()', () => {
      it('should not refresh feature if not enough time has passed', async () => {
        const isEnabled = stub(client.feature, 'isEnabled');
        mockDate(TIMESTAMP);

        await applyEffect(Feature.refreshFeature(FEATURE_ID));

        expect(isEnabled).to.not.be.called;
      });

      it('should not refresh feature if remote value has not changed', async () => {
        const isEnabled = stub(client.feature, 'isEnabled').resolves(true);
        mockDate(TIMESTAMP + 1000000);

        const { dispatch } = await applyEffect(Feature.refreshFeature(FEATURE_ID));

        expect(isEnabled).to.be.calledWithExactly(FEATURE_ID);
        expect(dispatch).to.not.be.called;
      });

      it('should refresh feature if remote value has changed', async () => {
        stub(client.feature, 'isEnabled').resolves(false);
        mockDate(TIMESTAMP + 1000000);

        const { dispatch } = await applyEffect(Feature.refreshFeature(FEATURE_ID));

        expect(dispatch).to.be.calledWithExactly(Feature.updateFeatureStatus(FEATURE_ID, false));
      });
    });

    describe.skip('loadFeatures()', () => {
      it('should not refresh feature if not enough time has passed', async () => {
        const features: any[] = ['abc', 'def', 'ghi'];
        const findFeatures = stub(client.feature, 'find').resolves(features);

        const { dispatch } = await applyEffect(Feature.loadFeatures());

        expect(findFeatures).to.be.called;
        features.forEach((featureID) => expect(dispatch).to.be.calledWithExactly(Feature.refreshFeature(featureID)));
      });
    });
  });
});
