import { BaseNode } from '@voiceflow/base-types';
import _isEmpty from 'lodash/isEmpty';
import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';

import * as Session from '@/ducks/session';
import * as VersionV2 from '@/ducks/versionV2';
import * as ModalsV2 from '@/ModalsV2';
import { Content } from '@/pages/Canvas/components/Editor';
import IntegrationsService from '@/services/Integrations';

import TestDropdown from '../Steps/components/TestDropdown';
import GoogleRequestType from '../Steps/GoogleSheets/ActionSelect/GoogleRequestTypeDropdown';
import WithValues from '../Steps/GoogleSheets/CreateUpdateRows/WithValuesDropdown';
import DeleteSettings from '../Steps/GoogleSheets/DeleteRows/DeleteSettingsDropdown';
import SheetsOutputMapping from '../Steps/GoogleSheets/Mapping/MappingOutputDropdown';
import RetrieveSettings from '../Steps/GoogleSheets/RetrieveRows/RetrieveSettingsDropdown';
import UsingGoogleSheet from '../Steps/GoogleSheets/SelectSheet/UsingGoogleSheetDropdown';
import GoogleUsers from '../Steps/GoogleSheets/Users/GoogleUser';
import DropdownStepEditor from './components/DropdownStepEditor';

const Step = {
  SELECT_ACTION: 'select action',
  SELECT_USER: 'select user',
  SELECT_SHEET: 'select sheet',
  RETRIEVE_SETTINGS: 'retrieve settings',
  MAPPING: 'variable mapping',
  CREATE_UPDATE_SETTINGS: 'create update settings',
  DELETE_SETTINGS: 'delete settings',
  TEST_SECTION: 'test',
};

const SelectGoogleSheetNextStep = (data) => {
  let nextStep = '';
  switch (data.selectedAction) {
    case BaseNode.GoogleSheets.GoogleSheetsActionType.RETRIEVE_DATA:
      nextStep = Step.RETRIEVE_SETTINGS;
      break;
    case BaseNode.GoogleSheets.GoogleSheetsActionType.CREATE_DATA:
      nextStep = Step.CREATE_UPDATE_SETTINGS;
      break;
    case BaseNode.GoogleSheets.GoogleSheetsActionType.UPDATE_DATA:
      nextStep = Step.CREATE_UPDATE_SETTINGS;
      break;
    case BaseNode.GoogleSheets.GoogleSheetsActionType.DELETE_DATA:
      nextStep = Step.DELETE_SETTINGS;
      break;
    default:
  }
  return nextStep;
};

function GoogleSheetsEditor({ data, onChange, creatorID, versionID, currentStep, toggleStep, setStep }) {
  const [headers_list, setHeadersList] = React.useState([]);

  const updateHeaders = useCallback(async () => {
    setHeadersList([]);

    const spreadSheetId = data.spreadsheet && data.spreadsheet.value;
    const sheetId = data.sheet && data.sheet.value;
    const integrationsUser = data.user;

    if (spreadSheetId == null || sheetId == null || integrationsUser == null) return;

    try {
      const headers = await IntegrationsService.googleSheets.getSheetHeaders(spreadSheetId, sheetId, integrationsUser, creatorID, versionID);
      setHeadersList(headers);
    } catch (e) {
      ModalsV2.openError({ error: new Error('Blank or invalid headers in spreadsheet. The first row of your spreadsheet must be a header row') });
    }
  }, [creatorID, data.sheet, data.spreadsheet, data.user, versionID]);

  useEffect(() => {
    updateHeaders();
  }, [data.sheet, data.user, updateHeaders]);

  const hasSelectedAction = data.selectedAction;
  const hasUser = data.user && !_isEmpty(data.user);
  const hasSelectedSheet = data.sheet && !_isEmpty(data.sheet);

  return (
    <Content>
      <GoogleRequestType
        data={data}
        onChange={onChange}
        isOpened={currentStep === Step.SELECT_ACTION}
        toggle={toggleStep(Step.SELECT_ACTION)}
        openNextStep={setStep(Step.SELECT_USER)}
      />
      {hasSelectedAction && (
        <>
          <GoogleUsers
            data={data}
            onChange={onChange}
            isOpened={currentStep === Step.SELECT_USER}
            toggle={toggleStep(Step.SELECT_USER)}
            openNextStep={setStep(Step.SELECT_SHEET)}
          />
          {hasUser && (
            <>
              <UsingGoogleSheet
                updateHeaders={updateHeaders}
                data={data}
                onChange={onChange}
                isOpened={currentStep === Step.SELECT_SHEET}
                toggle={toggleStep(Step.SELECT_SHEET)}
                openNextStep={setStep(SelectGoogleSheetNextStep(data))}
              />
              {hasSelectedSheet && (
                <>
                  {data.selectedAction === BaseNode.GoogleSheets.GoogleSheetsActionType.RETRIEVE_DATA && (
                    <>
                      <RetrieveSettings
                        headers_list={headers_list}
                        data={data}
                        onChange={onChange}
                        isOpened={currentStep === Step.RETRIEVE_SETTINGS}
                        toggle={toggleStep(Step.RETRIEVE_SETTINGS)}
                        openNextStep={setStep(Step.MAPPING)}
                      />
                      <SheetsOutputMapping
                        headers_list={headers_list}
                        data={data}
                        onChange={onChange}
                        isOpened={currentStep === Step.MAPPING}
                        toggle={toggleStep(Step.MAPPING)}
                        openNextStep={setStep(Step.TEST_SECTION)}
                      />
                    </>
                  )}

                  {(data.selectedAction === BaseNode.GoogleSheets.GoogleSheetsActionType.CREATE_DATA ||
                    data.selectedAction === BaseNode.GoogleSheets.GoogleSheetsActionType.UPDATE_DATA) && (
                    <WithValues
                      headers_list={headers_list}
                      data={data}
                      onChange={onChange}
                      isOpened={currentStep === Step.CREATE_UPDATE_SETTINGS}
                      toggle={toggleStep(Step.CREATE_UPDATE_SETTINGS)}
                      openNextStep={setStep(Step.TEST_SECTION)}
                    />
                  )}
                  {data.selectedAction === BaseNode.GoogleSheets.GoogleSheetsActionType.DELETE_DATA && (
                    <DeleteSettings
                      data={data}
                      onChange={onChange}
                      isOpened={currentStep === Step.DELETE_SETTINGS}
                      toggle={toggleStep(Step.DELETE_SETTINGS)}
                      openNextStep={setStep(Step.TEST_SECTION)}
                    />
                  )}
                  <TestDropdown data={data} isOpened={currentStep === Step.TEST_SECTION} toggleStep={toggleStep(Step.TEST_SECTION)} />
                </>
              )}
            </>
          )}
        </>
      )}
    </Content>
  );
}

const mapStateToProps = {
  versionID: Session.activeVersionIDSelector,
  creatorID: VersionV2.active.creatorIDSelector,
};

const GoogleSheetsWithSteps = DropdownStepEditor(GoogleSheetsEditor, Step.SELECT_ACTION);

export default connect(mapStateToProps)(GoogleSheetsWithSteps);
