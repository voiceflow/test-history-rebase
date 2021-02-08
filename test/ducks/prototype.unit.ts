import * as Prototype from '@/ducks/prototype';
import { generate } from '@/utils/testing';

import suite from './_suite';

const MOCK_PROJECT_ID = generate.id();
const MOCK_STATE = {
  ID: null,
  mode: {
    [MOCK_PROJECT_ID]: Prototype.PrototypeMode.DISPLAY,
  },
  visual: {
    device: null,
    sourceID: null,
  },
  muted: false,
  showChips: true,
  status: Prototype.PrototypeStatus.ENDED,
  flowIDHistory: [],
  autoplay: true,
  activePathBlockIDs: [],
  activePathLinkIDs: [],
  inputMode: Prototype.InputMode.TEXT,
  startTime: 1,
  contextStep: 2,
  contextHistory: [],
  visualDataHistory: [],
  context: {} as any,
  webhook: {} as any,
  _persist: { version: 1, rehydrated: false },
};

suite(Prototype, MOCK_STATE)('Ducks - Prototype', ({ expect, describeReducer, describeSelectors, describeSideEffects }) => {
  describeReducer(({ expectAction }) => {
    describe('updatePrototypeMode()', () => {
      it('should replace the prototype mode for the specified project', () => {
        const projectID = generate.id();
        const mode = Prototype.PrototypeMode.DEVELOPER;

        expectAction(Prototype.updatePrototypeMode(projectID, mode)).toModify({ mode: { ...MOCK_STATE.mode, [projectID]: mode } });
      });
    });
  });

  describeSelectors(({ select }) => {
    describe('prototypeModeSelector()', () => {
      it('should select the map of all prototype modes', () => {
        expect(select(Prototype.prototypeModeSelector)).to.eq(MOCK_STATE.mode);
      });
    });

    describe('activePrototypeModeSelector()', () => {
      it('should select the mode of the active project', () => {
        expect(select(Prototype.activePrototypeModeSelector, { skill: { projectID: MOCK_PROJECT_ID } })).to.eq(Prototype.PrototypeMode.DISPLAY);
      });

      it('should select the default mode if not found', () => {
        expect(select(Prototype.activePrototypeModeSelector, { skill: { projectID: generate.id() } })).to.eq(Prototype.PrototypeMode.CANVAS);
      });
    });
  });

  describeSideEffects(({ applyEffect }) => {
    describe('updateActivePrototypeMode()', () => {
      it('should update the mode of the active project', async () => {
        const mode = Prototype.PrototypeMode.SETTINGS;

        const { expectDispatch } = await applyEffect(Prototype.updateActivePrototypeMode(mode), { skill: { projectID: MOCK_PROJECT_ID } });

        expectDispatch(Prototype.updatePrototypeMode(MOCK_PROJECT_ID, mode));
      });
    });
  });
});
