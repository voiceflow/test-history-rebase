import axios from 'axios'
import _ from 'lodash'

export default {
  addIntegrationsUser: async (integration, data) => {
    const {
      user_info,
      skill_id,
      creator_id
    } = data

    if (!(user_info && skill_id && creator_id)) throw new Error('Parameters missing, please ensure all sections are completed')
    return await axios.post('/integrations/add_user', {
      integration,
      ...data
    })
  },
  deleteIntegrationsUser: async (integration, data) => {
    const {
      user,
      skill_id,
      creator_id
    } = data

    if (!(user && skill_id && creator_id)) throw new Error('Parameters missing, please ensure all sections are completed')
    return await axios.post('/integrations/delete_user', {
      integration,
      ...data
    })
  },
  googleSheets: {
    getSpreadsheets: async (query, user) => {
      if (!user) throw new Error('Parameters missing, please ensure all sections are completed')
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/google_sheets/spreadsheets', {
            query,
            user
          })
          resolve(resp.data)
        } catch (e) {
          reject(e)
        }
      })
    },
    getSpreadsheetSheets: async (spreadsheet, user) => {
      if (!user) throw new Error('Parameters missing, please ensure all sections are completed')
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/google_sheets/spreadsheet_sheets', {
            spreadsheet,
            user
          })
          resolve(resp.data)
        } catch (e) {
          reject(e)
        }
      })
    },
    getSheetHeaders: async (spreadsheet, sheet, user) => {
      if (!user) throw new Error('Parameters missing, please ensure all sections are completed')
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/google_sheets/sheet_headers', {
            sheet,
            spreadsheet,
            user
          })
          resolve(resp.data)
        } catch (e) {
          reject(e)
        }
      })
    },
    retrieveData: async (params) => {
      let {
        spreadsheet,
        sheet,
        user
      } = params

      params.resultsByHeaderName = true

      if (!(user && !_.isNil(spreadsheet) && !_.isNil(sheet))) throw new Error('Parameters missing, please ensure all sections are completed')
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/google_sheets/retrieve_data', params)
          resolve(resp.data)
        } catch (e) {
          reject(e)
        }
      })
    },
    createData: async (params) => {
      let {
        spreadsheet,
        sheet,
        row_values,
        user
      } = params

      if (!user && !_.isNil(spreadsheet) && !_.isNil(sheet) && row_values) throw new Error('Parameters missing, please ensure all sections are completed')
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/google_sheets/create_data', params)
          resolve(resp.data)
        } catch (e) {
          reject(e)
        }
      })
    },
    updateData: async (params) => {
      let {
        spreadsheet,
        sheet,
        row_values,
        user,
        row_number
      } = params

      if (!user && !_.isNil(spreadsheet) && !_.isNil(sheet) && row_values && row_number) throw new Error('Parameters missing, please ensure all sections are completed')
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/google_sheets/update_data', {
            spreadsheet,
            sheet,
            row_values,
            user,
            row_number
          })
          resolve(resp.data)
        } catch (e) {
          reject(e)
        }
      })
    },
    deleteData: async (params) => {
      let {
        spreadsheet,
        sheet,
        user,
        start_row,
        end_row
      } = params

      if (!user && !_.isNil(spreadsheet) && !_.isNil(sheet) && start_row && end_row) throw new Error('Parameters missing, please ensure all sections are completed')
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/google_sheets/delete_data', params)
          resolve(resp.data)
        } catch (e) {
          reject(e)
        }
      })
    }
  },
  custom: {
    getRequest: async (params) => {
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/custom/make_test_api_call', params)
          resolve(resp.data)
        } catch (e) {
          reject(e)
        }
      })
    },
    postRequest: async (params) => {
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/custom/make_test_api_call', params)
          resolve(resp.data)
        } catch (e) {
          reject(e)
        }
      })
    },
    patchRequest: async (params) => {
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/custom/make_test_api_call', params)
          resolve(resp.data)
        } catch (e) {
          reject(e)
        }
      })
    },
    putRequest: async (params) => {
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/custom/make_test_api_call', params)
          resolve(resp.data)
        } catch (e) {
          reject(e)
        }
      })
    },
    deleteRequest: async (params) => {
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/custom/make_test_api_call', params)
          resolve(resp.data)
        } catch (e) {
          reject(e)
        }
      })
    },
  },
  zapier: {
    createMessage: async (params) => {
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/zapier/trigger', params)
          resolve(resp.data)
        } catch (e) {
          reject(e)
        }
      })
    },
  }
}