import projectAdapter from '@/client/adapters/project';
import { NetworkError, StatusCode } from '@/client/fetch';
import client, { PROJECTS_PATH, PROJECT_PATH, TEAM_PATH, VERSION_PATH } from '@/client/project';
import { generate } from '@/utils/testing';

import suite from './_suite';

const PROJECT_ID = generate.id();
const VENDOR_ID = generate.id();

suite('Client - Project', ({ expect, stubFetch, expectCall }) => {
  describe('copyReference()', () => {
    it('should copy a project from a reference', async () => {
      const referenceID = generate.id();
      const teamID = generate.id();
      const project = generate.object();
      const fetch = stubFetch('post').resolves(project);

      await expectCall(client.copyReference, referenceID, teamID).withAdapter(projectAdapter, project).toYield();

      expect(fetch).to.be.calledWithExactly(`${TEAM_PATH}/${teamID}/insert/reference/${referenceID}`);
    });
  });

  describe('copy()', () => {
    it('should copy a project', async () => {
      const versionID = generate.id();
      const teamID = generate.id();
      const project = generate.object();
      const fetch = stubFetch('post').resolves(project);

      await expectCall(client.copy, versionID, teamID).withAdapter(projectAdapter, project).toYield();

      expect(fetch).to.be.calledWithExactly(`${VERSION_PATH}/${versionID}/copy/team/${teamID}`);
    });
  });

  describe('delete()', () => {
    it('should delete a project', async () => {
      const fetch = stubFetch('delete');

      await expectCall(client.delete, PROJECT_ID).toYield();

      expect(fetch).to.be.calledWithExactly(`${PROJECTS_PATH}/${PROJECT_ID}`);
    });

    it('should throw error if project cannot be deleted', async () => {
      stubFetch('delete').rejects(new NetworkError(StatusCode.FORBIDDEN, 'fail'));

      const error = await expectCall(client.delete, PROJECT_ID).toThrow<NetworkError<any>>();

      expect(error).to.be.an.instanceOf(NetworkError);
      expect(error.statusCode).to.eq(StatusCode.FORBIDDEN);
      expect(error.message).to.eq('Project has active users and cannot be deleted at the moment');
    });

    it('should throw a generic error if deletion failed', async () => {
      stubFetch('delete').rejects(new NetworkError(StatusCode.BAD_REQUEST, 'fail'));

      const error = await expectCall(client.delete, PROJECT_ID).toThrow<NetworkError<any>>();

      expect(error).to.be.an.instanceOf(NetworkError);
      expect(error.statusCode).to.eq(StatusCode.BAD_REQUEST);
      expect(error.message).to.eq('Error Deleting Project');
    });

    it('should use a default failure error code', async () => {
      stubFetch('delete').rejects(new Error('fail'));

      const error = await expectCall(client.delete, PROJECT_ID).toThrow<NetworkError<any>>();

      expect(error.statusCode).to.eq(StatusCode.SERVER_ERROR);
    });
  });

  describe('claimReference()', () => {
    it('should get a reference to a project', async () => {
      const projectReference = generate.object();
      const fetch = stubFetch('post').resolves(projectReference);

      await expectCall(client.claimReference, PROJECT_ID).toYield(projectReference);

      expect(fetch).to.be.calledWithExactly(`${PROJECT_PATH}/${PROJECT_ID}/use_reference`);
    });
  });

  describe('updateVendorId()', () => {
    it('should update the vendor ID', async () => {
      const amazonID = generate.id();
      const fetch = stubFetch('post').resolves(amazonID);

      await expectCall(client.updateVendorId, PROJECT_ID, VENDOR_ID).toYield(amazonID);

      expect(fetch).to.be.calledWithExactly(`${PROJECT_PATH}/${PROJECT_ID}/vendor_id`, { vendor_id: VENDOR_ID });
    });
  });

  describe('getLiveVersion()', () => {
    it('should get live version info', async () => {
      const versionInfo = generate.object();
      const fetch = stubFetch().resolves(versionInfo);

      await expectCall(client.getLiveVersion, PROJECT_ID).toYield(versionInfo);

      expect(fetch).to.be.calledWithExactly(`${PROJECT_PATH}/${PROJECT_ID}/live_version`);
    });
  });

  describe('getVersions()', () => {
    it('should get versions', async () => {
      const versions = generate.array(3, generate.object);
      const fetch = stubFetch().resolves(versions);

      await expectCall(client.getVersions, PROJECT_ID).toYield(versions);

      expect(fetch).to.be.calledWithExactly(`${PROJECT_PATH}/${PROJECT_ID}/versions`);
    });
  });

  describe('updateAmznId()', () => {
    it('should update amazon ID', async () => {
      const amazonID = generate.id();
      const returnAmazonID = generate.id();
      const fetch = stubFetch('patch').resolves(returnAmazonID);

      await expectCall(client.updateAmznId, PROJECT_ID, VENDOR_ID, ` ${amazonID} `).toYield(returnAmazonID);

      expect(fetch).to.be.calledWithExactly(`${PROJECT_PATH}/${PROJECT_ID}/amzn_id`, { id: amazonID, vendorID: VENDOR_ID });
    });
  });
});
