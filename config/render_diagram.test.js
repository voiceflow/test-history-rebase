const Constants = require('./render_diagram.test.constants')
const _ = require('lodash')

describe('Render Diagram', () => {

  let mockData = {}
  let renderDiagram, services

  beforeAll(() => {
    jest.mock('../services')
    services = require('../services')

    services.docClient.get = jest.fn((params, callback) => callback(null, {
      Item: mockData[params.Key.id]
    }))

    services.pool.query = jest.fn((_, _1, callback) => callback(null, { rows: ['row'] }))
    services.writeToLogs.mockImplementation(() => Promise.resolve()) 
    services.hashids = jest.requireActual('../services').hashids
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('Individual Blocks', () => {
    it('Renders basic speak properly on Alexa', async () => {
      mockData = Constants._1_BasicSpeak_Inputs
      const expectedOutputs = _.cloneDeep(Constants._1_BasicSpeak_Outputs_Alexa)

      services.docClient.put = jest.fn((params, callback) => {
        const diagram = params.Item

        expect(diagram).toBeTruthy()
        if (diagram.prompt === '') diagram.prompt = null

        const expectedOutput = _.find(expectedOutputs, { id: diagram.id })
        const expected = _.pick(expectedOutput, ['commands', 'id', 'lines', 'prompt', 'skill_id', 'startId', 'variables'])
        const actual = _.pick(diagram, ['commands', 'id', 'lines', 'prompt', 'skill_id', 'startId', 'variables'])

        expect(actual).toEqual(expected)

        _.remove(expectedOutputs, { id: diagram.id })
        callback(null)
      })

      renderDiagram = require('./render_diagram').renderDiagram
      const res = await renderDiagram(1, '03ef7b9a9d2e6681ae7ed9dbc26e648e', 1, _.cloneDeep(Constants._1_BasicSpeak_Options))

      expect(res).toEqual(200)
      expect(expectedOutputs.length).toEqual(0)
    })

    it('Renders basic speak properly on Google', async () => {
      mockData = Constants._1_BasicSpeak_Inputs
      const expectedOutputs = _.cloneDeep(Constants._1_BasicSpeak_Outputs_Google)

      services.docClient.put = jest.fn((params, callback) => {
        const diagram = params.Item
        expect(diagram).toBeTruthy()

        if (diagram.prompt === '') diagram.prompt = null
        const expectedOutput = _.find(expectedOutputs, { id: diagram.id })
        const expected = _.pick(expectedOutput, ['commands', 'id', 'lines', 'prompt', 'skill_id', 'startId', 'variables'])
        const actual = _.pick(diagram, ['commands', 'id', 'lines', 'prompt', 'skill_id', 'startId', 'variables'])

        expect(actual).toEqual(expected)

        _.remove(expectedOutputs, { id: diagram.id })
        callback(null)
      })

      renderDiagram = require('./render_diagram').renderDiagram
      const res = await renderDiagram(1, '03ef7b9a9d2e6681ae7ed9dbc26e648e', 1, _.cloneDeep(Constants._1_BasicSpeak_Options), 0, 'google')

      expect(res).toEqual(200)
      expect(expectedOutputs.length).toEqual(0)
    })
  })

  describe('All Blocks', () => {
    it('Renders all blocks properly on Alexa', async () => {
      mockData = Constants._2_AllBlocks_Inputs
      const expectedOutputs = _.cloneDeep(Constants._2_AllBlocks_Outputs_Alexa)

      services.docClient.put = jest.fn((params, callback) => {
        const diagram = params.Item

        expect(diagram).toBeTruthy()
        if (diagram.prompt === '') diagram.prompt = null

        const expectedOutput = _.find(expectedOutputs, { id: diagram.id })
        const expected = _.pick(expectedOutput, ['commands', 'id', 'lines', 'prompt', 'skill_id', 'startId', 'variables'])
        const actual = _.pick(diagram, ['commands', 'id', 'lines', 'prompt', 'skill_id', 'startId', 'variables'])

        expect(actual).toEqual(expected)

        _.remove(expectedOutputs, { id: diagram.id })
        callback(null)
      })

      renderDiagram = require('./render_diagram').renderDiagram
      const res = await renderDiagram(1, 'a49cd2fa0daf4379b88e9b17a677c695', 1, _.cloneDeep(Constants._2_AllBlocks_Options))

      expect(res).toEqual(200)
      expect(expectedOutputs.length).toEqual(0)
    })

    it('Renders all blocks properly on Google', async () => {
      mockData = Constants._2_AllBlocks_Inputs
      const expectedOutputs = _.cloneDeep(Constants._2_AllBlocks_Outputs_Google)

      services.docClient.put = jest.fn((params, callback) => {
        const diagram = params.Item
        expect(diagram).toBeTruthy()

        if (diagram.prompt === '') diagram.prompt = null
        const expectedOutput = _.find(expectedOutputs, { id: diagram.id })
        const expected = _.pick(expectedOutput, ['commands', 'id', 'lines', 'prompt', 'skill_id', 'startId', 'variables'])
        const actual = _.pick(diagram, ['commands', 'id', 'lines', 'prompt', 'skill_id', 'startId', 'variables'])

        expect(actual).toEqual(expected)

        _.remove(expectedOutputs, { id: diagram.id })
        callback(null)
      })

      renderDiagram = require('./render_diagram').renderDiagram
      const res = await renderDiagram(1, 'a49cd2fa0daf4379b88e9b17a677c695', 1, _.cloneDeep(Constants._2_AllBlocks_Options), 0, 'google')

      expect(res).toEqual(200)
      expect(expectedOutputs.length).toEqual(0)
    })
  })
})