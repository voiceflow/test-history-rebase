import axios from 'axios';
import _ from 'lodash';
import React from 'react';
import { Alert } from 'reactstrap';

const MISSING_PARAM_ERR = 'Parameters missing, please ensure all sections are completed';

const customAPICall = async (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await axios.post('/integrations/custom/make_test_api_call', params);
      resolve(resp.data);
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  addIntegrationsUser: async (integration, data) => {
    const { user_info, skill_id, creator_id } = data;

    if (!(user_info && skill_id && creator_id)) throw new Error(MISSING_PARAM_ERR);

    return axios.post('/integrations/add_user', {
      integration,
      ...data,
    });
  },
  deleteIntegrationsUser: async (integration, data) => {
    const { user, skill_id, creator_id } = data;

    if (!(user && skill_id && creator_id)) throw new Error(MISSING_PARAM_ERR);

    return axios.post('/integrations/delete_user', {
      integration,
      ...data,
    });
  },
  googleSheets: {
    getSpreadsheets: async (query, user) => {
      if (!user) throw new Error(MISSING_PARAM_ERR);
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/google_sheets/spreadsheets', {
            query,
            user,
          });
          resolve(resp.data);
        } catch (e) {
          reject(e);
        }
      });
    },
    getSpreadsheetSheets: async (spreadsheet, user) => {
      if (!user) throw new Error(MISSING_PARAM_ERR);
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/google_sheets/sheets', {
            spreadsheet,
            user,
          });
          resolve(resp.data);
        } catch (e) {
          reject(e);
        }
      });
    },
    getSheetHeaders: async (spreadsheet, sheet, user) => {
      if (!user) throw new Error(MISSING_PARAM_ERR);
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/google_sheets/sheet_headers', {
            sheet,
            spreadsheet,
            user,
          });
          resolve(resp.data);
        } catch (e) {
          reject(e);
        }
      });
    },
    retrieveData: async (params) => {
      const { spreadsheet, sheet, user } = params;

      params.resultsByHeaderName = true;

      if (!(user && !_.isNil(spreadsheet) && !_.isNil(sheet))) throw new Error(MISSING_PARAM_ERR);
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/google_sheets/retrieve_data', params);
          resolve(resp.data);
        } catch (e) {
          reject(e);
        }
      });
    },
    createData: async (params) => {
      const { spreadsheet, sheet, row_values, user } = params;

      if (!user && !_.isNil(spreadsheet) && !_.isNil(sheet) && row_values) throw new Error(MISSING_PARAM_ERR);
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/google_sheets/create_data', params);
          resolve(resp.data);
        } catch (e) {
          reject(e);
        }
      });
    },
    updateData: async (params) => {
      const { spreadsheet, sheet, row_values, user, row_number } = params;

      if (!user && !_.isNil(spreadsheet) && !_.isNil(sheet) && row_values && row_number) throw new Error(MISSING_PARAM_ERR);
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/google_sheets/update_data', {
            spreadsheet,
            sheet,
            row_values,
            user,
            row_number,
          });
          resolve(resp.data);
        } catch (e) {
          reject(e);
        }
      });
    },
    deleteData: async (params) => {
      const { spreadsheet, sheet, user, start_row, end_row } = params;

      if (!user && !_.isNil(spreadsheet) && !_.isNil(sheet) && start_row && end_row) throw new Error(MISSING_PARAM_ERR);
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await axios.post('/integrations/google_sheets/delete_data', params);
          resolve(resp.data);
        } catch (e) {
          reject(e);
        }
      });
    },
  },
  custom: {
    getRequest: customAPICall,
    postRequest: customAPICall,
    patchRequest: customAPICall,
    putRequest: customAPICall,
    deleteRequest: customAPICall,
  },
  zapier: {
    createMessage: async (params) => {
      return new Promise(async (resolve, reject) => {
        try {
          await axios.post('/integrations/zapier/trigger', params);
          resolve(<Alert className="text-center">Successfully Triggered Zap</Alert>);
        } catch (e) {
          reject(e);
        }
      });
    },
  },
};
