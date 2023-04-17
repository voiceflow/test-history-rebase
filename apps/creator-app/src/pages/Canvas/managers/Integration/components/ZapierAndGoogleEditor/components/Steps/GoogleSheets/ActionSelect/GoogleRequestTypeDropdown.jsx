import { BaseNode } from '@voiceflow/base-types';
import React from 'react';

import SquareButton from '../../components/SquareButton';
import DropdownHeader from '../../components/StepDropdown';

function GoogleRequestType({ data, onChange, isOpened, toggle, openNextStep }) {
  const setRequestType = (requestType) => {
    onChange({ selectedAction: requestType });
    openNextStep();
  };

  return (
    <DropdownHeader headerText="I want to" headerSuffixText={data.selectedAction} isOpened={isOpened} toggle={toggle}>
      <SquareButton
        onClick={() => setRequestType(BaseNode.GoogleSheets.GoogleSheetsActionType.RETRIEVE_DATA)}
        text={BaseNode.GoogleSheets.GoogleSheetsActionType.RETRIEVE_DATA}
        tooltip="Retrieve a Single Row from a Spreadsheet"
      />
      <SquareButton
        onClick={() => setRequestType(BaseNode.GoogleSheets.GoogleSheetsActionType.CREATE_DATA)}
        text={BaseNode.GoogleSheets.GoogleSheetsActionType.CREATE_DATA}
        tooltip="Create a Row in a Spreadsheet"
      />
      <SquareButton
        onClick={() => setRequestType(BaseNode.GoogleSheets.GoogleSheetsActionType.UPDATE_DATA)}
        text={BaseNode.GoogleSheets.GoogleSheetsActionType.UPDATE_DATA}
        tooltip="Update an Existing Row in a Spreadsheet"
      />
      <SquareButton
        onClick={() => setRequestType(BaseNode.GoogleSheets.GoogleSheetsActionType.DELETE_DATA)}
        text={BaseNode.GoogleSheets.GoogleSheetsActionType.DELETE_DATA}
        tooltip="Delete Rows in a Spreadsheet"
      />
    </DropdownHeader>
  );
}

export default GoogleRequestType;
