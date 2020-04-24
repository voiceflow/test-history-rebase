import diagramAdapter from '@/client/adapters/diagram';
import displayAdapter from '@/client/adapters/display';
import productAdapter from '@/client/adapters/product';
import client from '@/client/clipboard';
import { DBDisplay } from '@/models';
import { generate } from '@/utils/testing';

import suite from './_suite';

const SKILL_ID = generate.id();

suite('Client - Clipboard', ({ expect, stubFetch, stubAdapter, expectCall }) => {
  describe('copy()', () => {
    it('should find entities', async () => {
      const entitieLookup = generate.object();
      const nodes: any[] = generate.array(3, generate.object);
      const fetch = stubFetch('post').resolves(entitieLookup);

      await expectCall(client.copy, SKILL_ID, nodes).toYield(entitieLookup);

      expect(fetch).to.be.calledWithExactly(`skill/${SKILL_ID}/clipboard/copy`, nodes);
    });
  });

  describe('paste()', () => {
    it('should generate entities', async () => {
      const entities = generate.object();
      const nodes: any[] = generate.array(3, generate.object);
      const products: any[] = generate.array(3, generate.object);
      const displays: any[] = generate.array(3, generate.object);
      const diagrams: any[] = generate.array(3, generate.object);
      const [dbProducts, mapProducts] = stubAdapter(productAdapter, 'mapToDB');
      const [dbDisplays, mapDisplays] = stubAdapter(displayAdapter, 'mapToDB', () => generate.array(3, () => ({ id: generate.id() })));
      const [dbDiagrams, mapDiagrams] = stubAdapter(diagramAdapter, 'mapToDB');
      const fetch = stubFetch('post').resolves(entities);

      await expectCall(client.paste, SKILL_ID, { nodes, products, displays, diagrams }).toYield(entities);

      expect(fetch).to.be.calledWithExactly(`skill/${SKILL_ID}/clipboard/paste`, {
        nodes,
        products: dbProducts,
        displays: dbDisplays.map(({ id }: DBDisplay) => ({ display_id: id })),
        diagrams: dbDiagrams,
      });

      expect(mapProducts).to.be.calledWithExactly(products);
      expect(mapDisplays).to.be.calledWithExactly(displays);
      expect(mapDiagrams).to.be.calledWithExactly(diagrams);
    });
  });
});
