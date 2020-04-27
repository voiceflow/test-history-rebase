import creatorAdapter from '@/client/adapters/creator';
import diagramAdapter from '@/client/adapters/diagram';
import client, { DIAGRAM_PATH, VARIABLES_PATH } from '@/client/diagram';
import { NetworkError, StatusCode } from '@/client/fetch';
import { PlatformType } from '@/constants';
import { generate } from '@/utils/testing';

import suite from './_suite';

suite('Client - Diagram', ({ expect, stubFetch, expectCall }) => {
  const diagramID = generate.id();

  describe('getData()', () => {
    const timestamp = generate.number();
    const diagramData = generate.object();
    const platform = PlatformType.GOOGLE;

    it('should get diagram data by ID', async () => {
      const variables = generate.array();
      const result = {
        diagram: {
          data: JSON.stringify(diagramData),
          variables,
        },
        timestamp,
      };
      const fetch = stubFetch().resolves(result);

      await expectCall(client.getData, diagramID, platform).withAdapter(creatorAdapter, diagramData, platform).toYield({
        data: diagramData,
        variables,
        timestamp,
      });

      expect(fetch).to.be.calledWithExactly(`${DIAGRAM_PATH}/${diagramID}`);
    });

    it('should default to an empty array of variables', async () => {
      const result = {
        diagram: {
          data: JSON.stringify(diagramData),
        },
        timestamp,
      };
      stubFetch().resolves(result);

      await expectCall(client.getData, diagramID, platform).withAdapter(creatorAdapter, diagramData, platform).toYield({
        data: diagramData,
        variables: [],
        timestamp,
      });
    });
  });

  describe('get()', () => {
    it('should get a diagram by ID', async () => {
      const diagram = generate.object();
      const fetch = stubFetch().resolves({ diagram });

      await expectCall(client.get, diagramID).withAdapter(diagramAdapter, diagram).toYield();

      expect(fetch).to.be.calledWithExactly(`${DIAGRAM_PATH}/${diagramID}`);
    });
  });

  describe('create()', () => {
    it('should create a diagram', async () => {
      const diagram: any = generate.object();
      const fetch = stubFetch('post');

      await expectCall(client.create, diagram).toYield();

      expect(fetch).to.be.calledWithExactly(`${DIAGRAM_PATH}?new=1`, diagram);
    });
  });

  describe('copy()', () => {
    it('should copy a diagram', async () => {
      const name = 'some diagram';
      const newDiagramID = generate.id();
      const fetch = stubFetch().resolves(newDiagramID);

      await expectCall(client.copy, diagramID, name).toYield(newDiagramID);

      expect(fetch).to.be.calledWithExactly(`${DIAGRAM_PATH}/copy/${diagramID}?name=some%20diagram`);
    });
  });

  describe('delete()', () => {
    it('should delete a diagram by ID', async () => {
      const fetch = stubFetch('delete');

      await expectCall(client.delete, diagramID).toYield();

      expect(fetch).to.be.calledWithExactly(`${DIAGRAM_PATH}/${diagramID}`);
    });

    it('should throw error if diagram cannot be deleted', async () => {
      stubFetch('delete').rejects(new NetworkError(StatusCode.FORBIDDEN, 'fail'));

      const error = await expectCall(client.delete, diagramID).toThrow<NetworkError<any>>();

      expect(error).to.be.an.instanceOf(NetworkError);
      expect(error.statusCode).to.eq(StatusCode.FORBIDDEN);
      expect(error.message).to.eq('Flow has active users and cannot be deleted at the moment');
    });

    it('should throw a generic error if deletion failed', async () => {
      stubFetch('delete').rejects(new NetworkError(StatusCode.BAD_REQUEST, 'fail'));

      const error = await expectCall(client.delete, diagramID).toThrow<NetworkError<any>>();

      expect(error).to.be.an.instanceOf(NetworkError);
      expect(error.statusCode).to.eq(StatusCode.BAD_REQUEST);
      expect(error.message).to.eq('Error Deleting Flow');
    });

    it('should use a default failure error code', async () => {
      stubFetch('delete').rejects(new Error('fail'));

      const error = await expectCall(client.delete, diagramID).toThrow<NetworkError<any>>();

      expect(error.statusCode).to.eq(StatusCode.SERVER_ERROR);
    });
  });

  describe('rename()', () => {
    it('should rename a diagram', async () => {
      const name = generate.string();
      const fetch = stubFetch('post');

      await expectCall(client.rename, diagramID, name).toYield();

      expect(fetch).to.be.calledWithExactly(`${DIAGRAM_PATH}/${diagramID}/name`, { name });
    });
  });

  describe('update()', () => {
    it('should update a diagram', async () => {
      const diagram: any = generate.object();
      const fetch = stubFetch('post');

      await expectCall(client.update, diagram).toYield();

      expect(fetch).to.be.calledWithExactly(DIAGRAM_PATH, diagram);
    });
  });

  describe('findVariables()', () => {
    it('should get all diagram variables', async () => {
      const variables = generate.array();
      const fetch = stubFetch().resolves(variables);

      await expectCall(client.findVariables, diagramID).toYield(variables);

      expect(fetch).to.be.calledWithExactly(`${DIAGRAM_PATH}/${diagramID}/${VARIABLES_PATH}`);
    });
  });

  describe('updateVariables()', () => {
    it('should update diagram variables', async () => {
      const variables = generate.array();
      const fetch = stubFetch('patch');

      await expectCall(client.updateVariables, diagramID, variables).toYield();

      expect(fetch).to.be.calledWithExactly(`${DIAGRAM_PATH}/${diagramID}/${VARIABLES_PATH}`, { variables });
    });
  });
});
