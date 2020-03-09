import client from '@/client';
import * as Creator from '@/ducks/creator';
import * as VariableSet from '@/ducks/variableSet';

import suite from './_suite';

const DIAGRAM_ID = 'abc';
const VARIABLE_SET = ['name', 'phone_number', 'email'];
const VARIABLE = 'birth_date';
const MOCK_STATE = {
  abc: VARIABLE_SET,
  def: ['frequency'],
};

suite(VariableSet, MOCK_STATE)('Ducks - Variable Set', ({ expect, stub, describeReducer, describeSelectors, describeSideEffects }) => {
  const newVariableSet = ['height', 'width'];

  describeReducer(({ expectAction }) => {
    describe('replaceVariableSet()', () => {
      it('should replace all variables sets for all diagrams', () => {
        const newVariableSets = {
          a: ['name'],
          c: newVariableSet,
        };

        expectAction(VariableSet.replaceVariableSet(newVariableSets)).result.to.eq(newVariableSets);
      });
    });

    describe('replaceVariableSetDiagram()', () => {
      it('should replace all variables sets for the given diagram', () => {
        expectAction(VariableSet.replaceVariableSetDiagram(DIAGRAM_ID, newVariableSet)).toModify({ [DIAGRAM_ID]: newVariableSet });
      });

      it('should add variable set for the new diagram', () => {
        expectAction(VariableSet.replaceVariableSetDiagram('ghi', newVariableSet)).toModify({ ghi: newVariableSet });
      });
    });

    describe('addVariableToDiagram()', () => {
      it('should add variable to the given diagram', () => {
        expectAction(VariableSet.addVariableToDiagram(DIAGRAM_ID, VARIABLE)).toModify({ [DIAGRAM_ID]: [...VARIABLE_SET, VARIABLE] });
      });
    });

    describe('removeVariableFromDiagram()', () => {
      it('should remove variable from the given diagram', () => {
        expectAction(VariableSet.removeVariableFromDiagram(DIAGRAM_ID, 'phone_number')).toModify({ [DIAGRAM_ID]: ['name', 'email'] });
      });
    });
  });

  describeSelectors(({ select }) => {
    describe('variableSetSelector()', () => {
      it('should select all variable sets', () => {
        expect(select(VariableSet.variableSetSelector)).to.eq(MOCK_STATE);
      });
    });

    describe('hasVariablesByDiagramIDSelector()', () => {
      it('should select whether diagram has variables', () => {
        expect(select(VariableSet.hasVariablesByDiagramIDSelector)(DIAGRAM_ID)).to.be.true;
        expect(select(VariableSet.hasVariablesByDiagramIDSelector)('d')).to.be.false;
      });
    });

    describe('activeDiagramVariables()', () => {
      it('should select whether active diagram has variables', () => {
        stub(Creator, 'creatorDiagramIDSelector').returns(DIAGRAM_ID);

        expect(
          select(VariableSet.activeDiagramVariables, {
            [Creator.STATE_KEY]: { [Creator.DIAGRAM_STATE_KEY]: { present: { diagramID: DIAGRAM_ID } } },
          })
        );
      });
    });
  });

  describeSideEffects(({ applyEffect, stubEffect }) => {
    describe('saveVariableSet()', () => {
      it('should save the latest variables from the store to the DB if they have changed', async () => {
        const findVariables = stub(client.diagram, 'findVariables').returns(newVariableSet);
        const updateVariables = stub(client.diagram, 'updateVariables');

        await applyEffect(VariableSet.saveVariableSet(DIAGRAM_ID));

        expect(findVariables).to.be.calledWithExactly(DIAGRAM_ID);
        expect(updateVariables).to.be.calledWithExactly(DIAGRAM_ID, VARIABLE_SET);
      });

      it('should do nothing if variables have not changed', async () => {
        const findVariables = stub(client.diagram, 'findVariables').returns(VARIABLE_SET);
        const updateVariables = stub(client.diagram, 'updateVariables');

        await applyEffect(VariableSet.saveVariableSet(DIAGRAM_ID));

        expect(findVariables).to.be.calledWithExactly(DIAGRAM_ID);
        expect(updateVariables).to.not.be.called;
      });
    });

    describe('addVariableToDiagramAndSave()', () => {
      it('should add variable to diagram and save', async () => {
        const [saveVariableSet, saveVariableSetEffect] = stubEffect(VariableSet, 'saveVariableSet');

        const { expectDispatch } = await applyEffect(VariableSet.addVariableToDiagramAndSave(DIAGRAM_ID, VARIABLE));

        expectDispatch(VariableSet.addVariableToDiagram(DIAGRAM_ID, VARIABLE));
        expect(saveVariableSet).to.be.calledWithExactly(DIAGRAM_ID);
        expectDispatch(saveVariableSetEffect);
      });
    });

    describe('loadVariableSetForDiagram()', () => {
      it('should replace variables in store from the DB', async () => {
        const findVariables = stub(client.diagram, 'findVariables').returns(VARIABLE_SET);

        const { expectDispatch } = await applyEffect(VariableSet.loadVariableSetForDiagram(DIAGRAM_ID, VARIABLE));

        expectDispatch(VariableSet.replaceVariableSetDiagram(DIAGRAM_ID, VARIABLE_SET));
        expect(findVariables).to.be.calledWithExactly(DIAGRAM_ID);
      });
    });

    // TODO: create a better side-effect stubbing pattern for side effects declared in-module
    describe.skip('saveActiveDiagramVariables()', () => {
      it('should save all variables of the active diagram to the DB', async () => {
        const creatorDiagramIDSelector = stub(Creator, 'creatorDiagramIDSelector').returns(DIAGRAM_ID);
        const [saveVariableSet, saveVariableSetEffect] = stubEffect(VariableSet, 'saveVariableSet');

        const { expectDispatch } = await applyEffect(VariableSet.saveActiveDiagramVariables(DIAGRAM_ID, VARIABLE));

        expect(creatorDiagramIDSelector).to.be.called;
        expect(saveVariableSet).to.be.calledWithExactly(DIAGRAM_ID);
        expectDispatch(saveVariableSetEffect);
      });

      it('should not save anything if there is no active diagram', async () => {
        const [saveVariableSet] = stubEffect(VariableSet, 'saveVariableSet');
        stub(Creator, 'creatorDiagramIDSelector').returns(null);

        await applyEffect(VariableSet.saveActiveDiagramVariables(DIAGRAM_ID, VARIABLE));

        expect(saveVariableSet).to.not.be.called;
      });
    });
  });
});
