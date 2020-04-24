import templateAdapter from '@/client/adapters/template';
import client, { TEMPLATE_PATH } from '@/client/template';
import { generate } from '@/utils/testing';

import suite from './_suite';

suite('Client - Template', ({ expect, stubFetch, expectCall }) => {
  describe('find()', () => {
    it('should find all templates', async () => {
      const templates: any[] = generate.array(3, generate.object);
      const fetch = stubFetch().resolves(templates);

      await expectCall(client.find).withListAdapter(templateAdapter, templates).toYield();

      expect(fetch).to.be.calledWithExactly(`${TEMPLATE_PATH}/all`);
    });
  });
});
