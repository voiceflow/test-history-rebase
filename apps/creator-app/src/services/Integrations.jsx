import { Alert } from '@voiceflow/ui';
import axios from 'axios';
import React from 'react';

const MISSING_PARAM_ERR = 'Parameters missing, please ensure all sections are completed';

const customAPICall = async (params) => {
  try {
    const resp = await axios.post('/integrations/custom/make_test_api_call', params);
    return resp.data;
  } catch (e) {
    throw new Error(`${e.message}. ${e.response.data}`);
  }
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

      const resp = await axios.post('/integrations/google_sheets/spreadsheets', {
        query,
        user,
      });
      return resp.data;
    },
    getSpreadsheetSheets: async (spreadsheet, user) => {
      if (!user) throw new Error(MISSING_PARAM_ERR);

      const resp = await axios.post('/integrations/google_sheets/sheets', {
        spreadsheet,
        user,
      });
      return resp.data;
    },
    getSheetHeaders: async (spreadsheet, sheet, user) => {
      if (!user) throw new Error(MISSING_PARAM_ERR);

      const resp = await axios.post('/integrations/google_sheets/sheet_headers', {
        sheet,
        spreadsheet,
        user,
      });
      return resp.data;
    },
    retrieveData: async (params) => {
      const { spreadsheet, sheet, user } = params;

      params.resultsByHeaderName = true;

      if (!(user && spreadsheet != null && sheet != null)) {
        throw new Error(MISSING_PARAM_ERR);
      }

      const resp = await axios.post('/integrations/google_sheets/retrieve_data', params);
      return resp.data;
    },
    createData: async (params) => {
      const { spreadsheet, sheet, row_values, user } = params;

      if (!user && spreadsheet != null && sheet != null && row_values) {
        throw new Error(MISSING_PARAM_ERR);
      }

      const resp = await axios.post('/integrations/google_sheets/create_data', params);
      return resp.data;
    },
    updateData: async (params) => {
      const { spreadsheet, sheet, row_values, user, row_number } = params;

      if (!user && spreadsheet != null && sheet != null && row_values && row_number) {
        throw new Error(MISSING_PARAM_ERR);
      }

      const resp = await axios.post('/integrations/google_sheets/update_data', {
        spreadsheet,
        sheet,
        row_values,
        user,
        row_number,
      });
      return resp.data;
    },
    deleteData: async (params) => {
      const { spreadsheet, sheet, user, start_row, end_row } = params;

      if (!user && spreadsheet != null && sheet != null && start_row && end_row) {
        throw new Error(MISSING_PARAM_ERR);
      }

      const resp = await axios.post('/integrations/google_sheets/delete_data', params);
      return resp.data;
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
      await axios.post('/integrations/zapier/trigger', params);

      return (
        <Alert mb={16} className="text-center">
          Successfully Triggered Zap
        </Alert>
      );
    },
  },
};
