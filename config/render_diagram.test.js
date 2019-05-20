/* global jest, expect */
/* eslint-disable global-require */
const _ = require('lodash');
const Constants = require('./render_diagram.test.constants');

describe('Render Diagram', () => {
  let mockData = {};
  let renderDiagram;
  let services;

  beforeEach(() => {
    jest.mock('../services');
    services = require('../services');

    services.docClient.get = jest.fn((params) => ({
      promise: () =>
        Promise.resolve({
          Item: mockData[params.Key.id],
        }),
    }));

    services.pool.query = jest.fn((__, _1, callback) => callback(null, { rows: ['row'] }));
    services.writeToLogs.mockImplementation(() => Promise.resolve());
    services.hashids = jest.requireActual('../services').hashids;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Individual Blocks', () => {
    it('Renders basic speak properly on Alexa', async () => {
      mockData = Constants._1_BasicSpeak_Inputs;
      const expectedOutputs = _.cloneDeep(Constants._1_BasicSpeak_Outputs_Alexa);

      services.docClient.put = jest.fn((params, callback) => {
        const diagram = params.Item;

        expect(diagram).toBeTruthy();
        if (diagram.prompt === '') diagram.prompt = null;

        const expectedOutput = _.find(expectedOutputs, { id: diagram.id });
        const expected = _.pick(expectedOutput, ['commands', 'id', 'lines', 'prompt', 'skill_id', 'startId', 'variables']);
        const actual = _.pick(diagram, ['commands', 'id', 'lines', 'prompt', 'skill_id', 'startId', 'variables']);

        expect(actual).toEqual(expected);

        _.remove(expectedOutputs, { id: diagram.id });
        callback(null);
      });

      ({ renderDiagram } = require('./render_diagram'));
      const res = await renderDiagram(1, '03ef7b9a9d2e6681ae7ed9dbc26e648e', 1, _.cloneDeep(Constants._1_BasicSpeak_Options));

      expect(res).toEqual(200);
      expect(expectedOutputs.length).toEqual(0);
    });

    it('Renders basic speak properly on Google', async () => {
      mockData = Constants._1_BasicSpeak_Inputs;
      const expectedOutputs = _.cloneDeep(Constants._1_BasicSpeak_Outputs_Google);

      services.docClient.put = jest.fn((params, callback) => {
        const diagram = params.Item;
        expect(diagram).toBeTruthy();

        if (diagram.prompt === '') diagram.prompt = null;
        const expectedOutput = _.find(expectedOutputs, { id: diagram.id });
        const expected = _.pick(expectedOutput, ['commands', 'id', 'lines', 'prompt', 'skill_id', 'startId', 'variables']);
        const actual = _.pick(diagram, ['commands', 'id', 'lines', 'prompt', 'skill_id', 'startId', 'variables']);

        expect(actual).toEqual(expected);

        _.remove(expectedOutputs, { id: diagram.id });
        callback(null);
      });

      ({ renderDiagram } = require('./render_diagram'));
      const res = await renderDiagram(1, '03ef7b9a9d2e6681ae7ed9dbc26e648e', 1, _.cloneDeep(Constants._1_BasicSpeak_Options), 0, 'google');

      expect(res).toEqual(200);
      expect(expectedOutputs.length).toEqual(0);
    });
  });

  describe('All Blocks', () => {
    it('Renders all blocks properly on Alexa', async () => {
      mockData = Constants._2_AllBlocks_Inputs;
      const expectedOutputs = _.cloneDeep(Constants._2_AllBlocks_Outputs_Alexa);

      services.docClient.put = jest.fn((params, callback) => {
        const diagram = params.Item;

        expect(diagram).toBeTruthy();
        if (diagram.prompt === '') diagram.prompt = null;

        const expectedOutput = _.find(expectedOutputs, { id: diagram.id });
        const expected = _.pick(expectedOutput, ['commands', 'id', 'lines', 'prompt', 'skill_id', 'startId', 'variables']);
        const actual = _.pick(diagram, ['commands', 'id', 'lines', 'prompt', 'skill_id', 'startId', 'variables']);

        expect(actual).toEqual(expected);

        _.remove(expectedOutputs, { id: diagram.id });
        callback(null);
      });

      ({ renderDiagram } = require('./render_diagram'));
      const res = await renderDiagram(1, 'a49cd2fa0daf4379b88e9b17a677c695', 1, _.cloneDeep(Constants._2_AllBlocks_Options));

      expect(res).toEqual(200);
      expect(expectedOutputs.length).toEqual(0);
    });

    it('Renders all blocks properly on Google', async () => {
      mockData = Constants._2_AllBlocks_Inputs;
      const expectedOutputs = _.cloneDeep(Constants._2_AllBlocks_Outputs_Google);

      services.docClient.put = jest.fn((params, callback) => {
        const diagram = params.Item;
        expect(diagram).toBeTruthy();

        if (diagram.prompt === '') diagram.prompt = null;
        const expectedOutput = _.find(expectedOutputs, { id: diagram.id });
        const expected = _.pick(expectedOutput, ['commands', 'id', 'lines', 'prompt', 'skill_id', 'startId', 'variables']);
        const actual = _.pick(diagram, ['commands', 'id', 'lines', 'prompt', 'skill_id', 'startId', 'variables']);

        expect(actual).toEqual(expected);

        _.remove(expectedOutputs, { id: diagram.id });
        callback(null);
      });

      ({ renderDiagram } = require('./render_diagram'));
      const res = await renderDiagram(1, 'a49cd2fa0daf4379b88e9b17a677c695', 1, _.cloneDeep(Constants._2_AllBlocks_Options), 0, 'google');

      expect(res).toEqual(200);
      expect(expectedOutputs.length).toEqual(0);
    });
  });

  describe('Edge Case Blocks', () => {
    it('Renders edge case blocks properly on Alexa', async () => {
      mockData = Constants._3_AdvancedBlocks_Inputs;
      const expectedOutputs = _.cloneDeep(Constants._3_AdvancedBlocks_Outputs_Alexa);

      services.docClient.put = jest.fn((params, callback) => {
        const diagram = params.Item;

        expect(diagram).toBeTruthy();
        if (diagram.prompt === '') diagram.prompt = null;

        const expectedOutput = _.find(expectedOutputs, { id: diagram.id });
        const expected = _.pick(expectedOutput, ['commands', 'id', 'lines', 'prompt', 'skill_id', 'startId', 'variables']);
        const actual = _.pick(diagram, ['commands', 'id', 'lines', 'prompt', 'skill_id', 'startId', 'variables']);

        expect(actual).toEqual(expected);

        _.remove(expectedOutputs, { id: diagram.id });
        callback(null);
      });

      ({ renderDiagram } = require('./render_diagram'));
      const res = await renderDiagram(1, 'a4cd5c7865a951bfa65d24c1e9241e7e', 1, _.cloneDeep(Constants._3_AdvancedBlocks_Options));

      expect(res).toEqual(200);
      expect(expectedOutputs.length).toEqual(0);
    });
  });

  describe('Add Story', () => {
    it('should insert a new diagram', () => {
      services.pool.query = jest.fn((__, _1, callback) => callback(null, { rows: [] }));
      const mockCb = jest.fn();
      const mockStory = {
        id: 1,
        name: 'mockName',
        skill_id: 1,
      };

      const { _addStory } = require('./render_diagram');
      _addStory(mockStory, mockCb);

      expect(mockCb).toHaveBeenCalled();
      expect(services.pool.query).toHaveBeenCalledWith('SELECT 1 FROM diagrams WHERE id = $1 LIMIT 1', [1], expect.any(Function));
      expect(services.pool.query).toHaveBeenCalledWith(
        'INSERT INTO diagrams (id, name, skill_id) VALUES ($1, $2, $3)',
        [1, 'mockName', 1],
        expect.any(Function)
      );
    });

    it('should update an existing diagram', () => {
      services.pool.query = jest.fn((__, _1, callback) => callback(null, { rows: ['mockRow'] }));
      const mockCb = jest.fn();
      const mockStory = {
        id: 1,
        name: 'mockName',
        skill_id: 1,
      };

      const { _addStory } = require('./render_diagram');
      _addStory(mockStory, mockCb);

      expect(mockCb).toHaveBeenCalled();
      expect(services.pool.query).toHaveBeenCalledWith('SELECT 1 FROM diagrams WHERE id = $1 LIMIT 1', [1], expect.any(Function));
      expect(services.pool.query).toHaveBeenCalledWith('UPDATE diagrams SET name = $1 WHERE id = $2', ['mockName', 1], expect.any(Function));
    });
  });
});
