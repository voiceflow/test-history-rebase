import axios from 'axios';
import _ from 'lodash';
import pretty from 'prettysize';
import React from 'react';
import { Modal, ModalBody } from 'reactstrap';

import ButtonGroupRouter from '@/components/ButtonGroupRouter';
import DropdownCollapse from '@/components/DropdownCollapse';
import { ModalHeader } from '@/components/LegacyModal';
import { styled } from '@/hocs';
import { copyJSONPath } from '@/utils/dom';

import Formatted from './Formatted';
import Raw from './Raw';
import Results from './Results';
import SetVariableInput from './SetVariableInput';
import { deepVariableReplacement, deepVariableSearch, findPath, normalize, variableReplacement } from './util';

const API_TEST_TABS = [
  {
    label: 'Formatted',
    value: 0,
    component: Formatted,
  },
  {
    label: 'Raw',
    value: 1,
    component: Raw,
  },
  {
    label: 'Results',
    value: 2,
    component: Results,
  },
];

const SendRequestBar = styled.div`
  display: flex;
  padding: 16px;
  background-color: #f9f9f9;
  border-bottom-right-radius: 0.3rem;
  border-bottom-left-radius: 0.3rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid #eaeff4;
  height: 90px;

  p {
    font-size: 12px;
    color: grey;
    margin: 0;
  }
`;

const DropdownCollapseContainer = styled.div`
  border-top: 1px solid rgba(17, 49, 96, 0.06);
  border-bottom: 1px solid rgba(17, 49, 96, 0.06);
  margin-bottom: 16px;
`;

const TabContentContainer = styled(ButtonGroupRouter)`
  max-height: 400px;
  overflow: auto;
`;

function APITestModal({ data, closeTestModal, testModalOpened }) {
  const [activeTabIndex, updateTabIndex] = React.useState(0);
  const [variableValues, setVariableValues] = React.useState({});

  const dropdownRef = React.useRef(null);

  const [responseMetaData, setResponseMetaData] = React.useState({});
  const [variableMap, setVariableMap] = React.useState([]);
  const [requestResponse, setRequestResponse] = React.useState({});

  const [hasResponse, setHasReponse] = React.useState(false);
  const [sendingRequest, setSendingRequest] = React.useState(false);

  const formattedData = React.useRef({});

  const setVarValue = (key, value) => {
    setVariableValues({
      ...variableValues,
      [key]: value,
    });
  };

  const mapVars = (responseData) => {
    const mappedVars = [];

    formattedData.current.mapping?.forEach((mappedOutput) => {
      try {
        const path = variableReplacement(mappedOutput.path, variableValues);
        mappedVars.push({
          path,
          var: mappedOutput.var,
          value: findPath(path, responseData),
        });
      } catch (error) {
        mappedVars.push({
          path: mappedOutput.path,
          var: mappedOutput.var,
          value: 'Undefined',
        });
      }
    });

    return mappedVars;
  };

  const makeRequest = React.useCallback(() => {
    const requestObj = deepVariableReplacement(formattedData.current, variableValues);

    const VariableDropdown = dropdownRef?.current;
    const initTime = Date.now();
    setSendingRequest(true);
    if (dropdownRef && !_.isEmpty(variableValues) && VariableDropdown.state.isOpened === true) {
      VariableDropdown.toggle();
    }

    axios
      .post('/test/api', { api: requestObj })
      .then((res) => {
        const responseMeta = {
          status: res.status,
          time: Date.now() - initTime,
          size: pretty(JSON.stringify(res).length * 7),
        };
        setResponseMetaData(responseMeta);
        setHasReponse(true);
        setSendingRequest(false);

        setVariableMap(mapVars(res.data));
        setRequestResponse(res.data);
      })
      .catch((err) => {
        setSendingRequest(false);

        const status = err.response ? err.response.status : err.status;
        const error = _.get(err, ['response', 'data']);
        const responseMeta = {
          status,
          time: Date.now() - initTime,
          size: pretty(JSON.stringify(err).length * 7),
        };
        setResponseMetaData(responseMeta);
        setVariableMap([]);
        setRequestResponse(error);
        setHasReponse(true);
      });
  });

  const initialize = React.useCallback(() => {
    const normalizedData = normalize(data);
    const usedVariables = deepVariableSearch(normalizedData);

    setVariableValues(usedVariables.reduce((acc, key) => ({ ...acc, [key]: null }), {}));
    formattedData.current = normalizedData;

    if (usedVariables.length === 0) {
      makeRequest();
    }
  }, [data, makeRequest]);

  return (
    <Modal toggle={closeTestModal} isOpen={testModalOpened} onClosed={closeTestModal} size="lg" onOpened={initialize}>
      <ModalHeader toggle={closeTestModal} header="API TEST" />
      <ModalBody>
        {!_.isEmpty(variableValues) && (
          <DropdownCollapseContainer>
            <DropdownCollapse text="Set Variable Values" ref={dropdownRef}>
              <div className="pb-2">
                {Object.keys(variableValues).map((name) => (
                  <SetVariableInput prefix={name} key={name} onChange={(e) => setVarValue(name, e.target.value)} />
                ))}
              </div>
            </DropdownCollapse>
          </DropdownCollapseContainer>
        )}

        {hasResponse && (
          <TabContentContainer
            maxHeight={400}
            selected={activeTabIndex}
            onChange={(tab) => {
              updateTabIndex(tab);
            }}
            routes={API_TEST_TABS}
            routeProps={{ requestResponse, responseMetaData, copyJSONPath, variableMap }}
          />
        )}
      </ModalBody>
      <SendRequestBar>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={makeRequest}>
            {hasResponse && !sendingRequest && <span>Re-Send Request</span>}
            {!sendingRequest && !hasResponse && <span>Send Request</span>}
            {sendingRequest && <span>Sending...</span>}
          </button>
        </div>
      </SendRequestBar>
    </Modal>
  );
}

export default APITestModal;
