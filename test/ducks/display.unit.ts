import client from '@/client';
import { toast } from '@/components/Toast';
import * as Display from '@/ducks/display';
import { CRUDState } from '@/ducks/utils/crud';
import * as Models from '@/models';
import { generate } from '@/utils/testing';

import suite from './_suite';

const DISPLAY_ID = generate.id();
const SKILL_ID = generate.id();
const DISPLAY = { id: DISPLAY_ID } as Models.Display;
const MOCK_STATE: CRUDState<Models.Display> = {
  byKey: {
    [DISPLAY_ID]: DISPLAY,
  },
  allKeys: [DISPLAY_ID],
};

suite(Display, MOCK_STATE)('Ducks - Display', ({ expect, stub, describeCRUDReducer, describeSideEffects }) => {
  describeCRUDReducer();

  describeSideEffects(({ applyEffect }) => {
    describe('deleteDisplay()', () => {
      it('should delete display by ID', async () => {
        const deleteDisplays = stub(client.display, 'delete');

        const { expectDispatch } = await applyEffect(Display.deleteDisplay(DISPLAY_ID));

        expect(deleteDisplays).to.be.calledWithExactly(DISPLAY_ID);
        expectDispatch(Display.removeDisplay(DISPLAY_ID));
      });
    });

    describe('createDisplay()', () => {
      it('should delete display by ID', async () => {
        const displayID = generate.id();
        const display: any = generate.object();
        const fullDisplay: any = generate.object();
        const createDisplay = stub(client.display, 'create').resolves(displayID);
        const getDisplay = stub(client.display, 'get').resolves(fullDisplay);

        const { expectDispatch, result } = await applyEffect(Display.createDisplay(SKILL_ID, display));

        expect(createDisplay).to.be.calledWithExactly(SKILL_ID, display);
        expect(getDisplay).to.be.calledWithExactly(displayID);
        expectDispatch(Display.addDisplay(displayID, fullDisplay));
        expect(result).to.eq(displayID);
      });

      it('should show toast on error', async () => {
        const display: any = generate.object();
        const toastError = stub(toast, 'error');
        stub(client.display, 'create').rejects();

        const { result } = await applyEffect(Display.createDisplay(SKILL_ID, display));

        expect(toastError).to.be.calledWithExactly('Error');
        expect(result).to.be.null;
      });
    });

    describe('updateDisplayData()', () => {
      it('should update data display by ID', async () => {
        const display: any = generate.object();
        const updateDisplay = stub(client.display, 'update');

        const { expectDispatch } = await applyEffect(Display.updateDisplayData(SKILL_ID, DISPLAY_ID, display));

        expect(updateDisplay).to.be.calledWithExactly(DISPLAY_ID, SKILL_ID, display);
        expectDispatch(Display.updateDisplay(DISPLAY_ID, display, true));
      });

      it('should show toast on error', async () => {
        const display: any = generate.object();
        const toastError = stub(toast, 'error');
        stub(client.display, 'update').rejects();

        await applyEffect(Display.updateDisplayData(SKILL_ID, DISPLAY_ID, display));

        expect(toastError).to.be.calledWithExactly('Error');
      });
    });

    describe('loadDisplaysForSkill()', () => {
      it('should update data display by ID', async () => {
        const displays: any[] = generate.array(3, generate.object);
        const findDisplays = stub(client.skill, 'findDisplays').resolves(displays);

        const { expectDispatch, result } = await applyEffect(Display.loadDisplaysForSkill(SKILL_ID));

        expect(findDisplays).to.be.calledWithExactly(SKILL_ID);
        expectDispatch(Display.replaceDisplays(displays));
        expect(result).to.eq(displays);
      });
    });
  });
});
