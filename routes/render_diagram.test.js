const Constants = require('./render_diagram.test.constants')

describe('Render Diagram', () => {

  let mockData = {}
  let renderDiagram, services

  beforeEach(() => {
    jest.mock('../services')
    services = require('../services')

    services.docClient.get = jest.fn((_, callback) => callback(null, mockData))

    services.pool.query = jest.fn((_, _1, callback) => callback(null, { rows: ['row'] }))
    services.writeToLogs.mockImplementation(() => Promise.resolve()) 

    // jest.mock('../services', () => {
    //   return {
    //     docClient: {
    //       put: jest.fn((_, callback) => callback(null, mockData)),
    //       get: jest.fn((_, callback) => callback(null, mockData))
    //     },
    //     pool: {
    //       query: jest.fn((_, _1, callback) => callback(null, { rows: ['row'] }))
    //     },
    //     writeToLogs: () => Promise.resolve(),
    //     hashids: 
    //   }
    // })
  })

  afterEach(() => {
    
  })

  describe('Individual Blocks', () => {
    it('Renders basic speak properly', async () => {
      mockData = {
        Item: Constants.TrimmedBasicInput1
      }

      services.docClient.put = jest.fn((params, callback) => {

        expect(params).toBeTruthy()

        callback(null, mockData)
      })

      renderDiagram = require('./render_diagram').renderDiagram
      const res = await renderDiagram(1, 'TrimmedBasicInput1', 1, {})
      console.log("RES", res)
    })
  })

  it('is test', () => {
    expect(Constants).toBeTruthy()
  })


  
})