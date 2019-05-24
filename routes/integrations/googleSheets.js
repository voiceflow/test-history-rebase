const axios = require('axios');


const getSpreadsheets = async (req, res) => {
  try {
    const resp = await axios.post(`${process.env.INTEGRATIONS_LAMBDA_ENDPOINT}/google_sheets/spreadsheets`, req.body);
    res.send(resp.data);
  } catch (e) {
    res.status(400).send(e.message || e.data.error || e);
  }
};

const getSpreadsheetSheets = async (req, res) => {
  try {
    const resp = await axios.post(`${process.env.INTEGRATIONS_LAMBDA_ENDPOINT}/google_sheets/sheets`, req.body);
    res.send(resp.data);
  } catch (e) {
    res.status(400).send(e.message || e.data.error || e);
  }
};

const getSheetHeaders = async (req, res) => {
  try {
    const resp = await axios.post(`${process.env.INTEGRATIONS_LAMBDA_ENDPOINT}/google_sheets/sheet_headers`, req.body);
    res.send(resp.data);
  } catch (e) {
    res.status(400).send(e.message || e.data.error || e);
  }
};

const retrieveData = async (req, res) => {
  try {
    const resp = await axios.post(`${process.env.INTEGRATIONS_LAMBDA_ENDPOINT}/google_sheets/retrieve_data`, req.body);
    res.send(resp.data);
  } catch (e) {
    res.status(400).send(e.message || e.data.error || e);
  }
};

const createData = async (req, res) => {
  try {
    const resp = await axios.post(`${process.env.INTEGRATIONS_LAMBDA_ENDPOINT}/google_sheets/create_data`, req.body);
    res.send(resp.data);
  } catch (e) {
    res.status(400).send(e.message || e.data.error || e);
  }
};

const updateData = async (req, res) => {
  try {
    const resp = await axios.post(`${process.env.INTEGRATIONS_LAMBDA_ENDPOINT}/google_sheets/update_data`, req.body);
    res.send(resp.data);
  } catch (e) {
    res.status(400).send(e.message || e.data.error || e);
  }
};

const deleteData = async (req, res) => {
  try {
    const resp = await axios.post(`${process.env.INTEGRATIONS_LAMBDA_ENDPOINT}/google_sheets/delete_data`, req.body);
    res.send(resp.data);
  } catch (e) {
    res.status(400).send(e.message || e.data.error || e);
  }
};

module.exports = {
  getSpreadsheets,
  getSpreadsheetSheets,
  getSheetHeaders,
  retrieveData,
  createData,
  updateData,
  deleteData,
};
