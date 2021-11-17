import * as ML from '@voiceflow/ml-sdk';
import { expect } from 'chai';
import sinon from 'sinon';

import SuggestUtteranceControl from '@/actions/utterance/suggest';

describe('Actions | Utterance | Suggest', () => {
  describe('access()', () => {
    it('does not allow access', async () => {
      const clients = {};
      const services = {};

      const control = new SuggestUtteranceControl({ services, clients } as any);

      await expect(control.access()).to.eventually.be.false;
    });
  });

  describe('process()', () => {
    it('registers a reply callback', async () => {
      const control = new SuggestUtteranceControl({ services: {}, clients: {} } as any);

      await control.process({} as any, {} as any, {} as any);

      expect(control.$reply).to.be.calledWithExactly(ML.utterance.suggest, sinon.match.func);
    });

    it('returns an empty array', async () => {
      const control = new SuggestUtteranceControl({ services: {}, clients: {} } as any);

      const projectID = 'project_id';
      const intentID = 'intent_id';
      const actionID = 'action_id';
      const ctx = {};
      const action = ML.utterance.suggest.started({ projectID, intentID }, { actionID });
      const serverMeta = {};

      await control.process(ctx as any, action, serverMeta as any);

      expect(control.$reply.args[0][1](ctx, action)).to.eventually.eql([]);
    });
  });
});
