import axios from 'axios';
import _ from 'lodash';
import pretty from 'prettysize';
import React, { useEffect } from 'react';
import { Modal, ModalBody } from 'reactstrap';

import ButtonGroupRouter from '@/components/ButtonGroupRouter';
import { ModalHeader } from '@/components/Modal';
import DropdownCollapse from '@/componentsV2/DropdownCollapse';
import { styled } from '@/hocs';
import { copyJSONPath } from '@/utils/dom';

import Formatted from './TestModalComponents/Formatted';
import Raw from './TestModalComponents/Raw';
import Results from './TestModalComponents/Results';
import SetVariableInput from './TestModalComponents/SetVariableInput';

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

function CustomApiTestModal({ data, closeTestModal, testModalOpened }) {
  const variables = [];
  const [activeTabIndex, updateTabIndex] = React.useState(0);
  const [variableValuesArray, setVariableValuesArray] = React.useState([]);
  const [dropdownRef, setDropdownRef] = React.useState(null);

  const [responseMetaData, setResponseMetaData] = React.useState({});
  const [variableMap, setVariableMap] = React.useState([]);
  const [requestResponse, setRequestResponse] = React.useState({});

  const { headers, parameters, mapping, selectedAction, url } = data;
  const [hasResponse, setHasReponse] = React.useState(false);
  const [sendingRequest, setSendingRequest] = React.useState(false);

  const variableAlreadyExtracted = (variableName) => {
    return variables.some((variable) => {
      return variable.name === variableName;
    });
  };

  const extractVariableName = (subText) => {
    if (subText.name && !variableAlreadyExtracted(subText.name)) {
      variables.push({
        name: subText.name,
        value: '',
      });
    }
  };

  const extractVariables = () => {
    const metaDataTargets = [headers, parameters];

    metaDataTargets.forEach((target) => {
      target.forEach((lineitem) => {
        const { key, val } = lineitem;
        key.forEach((subText) => {
          extractVariableName(subText);
        });
        val.forEach((subText) => {
          extractVariableName(subText);
        });
      });
    });

    url.forEach((subText) => {
      extractVariableName(subText);
    });
  };

  const setVarValue = (value, index) => {
    variableValuesArray[index].value = value;
    setVariableValuesArray(variableValuesArray);
  };

  const getVariableValue = (variableName) => {
    let variableValue = null;
    variableValuesArray.forEach((variable) => {
      if (variable.name === variableName) {
        variableValue = variable.value;
      }
    });
    return variableValue;
  };

  const findPath = (path, data) => {
    const props = path.split('.');
    let cur_data = { response: data };
    props.forEach((prop) => {
      const props_and_inds = prop.split('[');
      props_and_inds.forEach((prop_or_ind) => {
        if (prop_or_ind.includes(']')) {
          const index_str = prop_or_ind.slice(0, -1);
          let index;
          if (index_str.toLowerCase() === '{random}') {
            index = Math.floor(Math.random() * cur_data.length);
          } else {
            index = parseInt(index_str, 10);
          }
          cur_data = cur_data[index];
        } else {
          cur_data = cur_data[prop_or_ind];
        }
      });
    });

    return cur_data;
  };

  const buildMeta = (textArray) => {
    let builtValue = '';
    textArray.forEach((subText) => {
      const subTextIsVariable = _.has(subText, ['name']);
      if (subTextIsVariable) {
        builtValue = builtValue.concat(getVariableValue(subText.name));
      } else {
        builtValue = builtValue.concat(subText);
      }
    });
    return builtValue;
  };

  const buildMetaObjectFromArray = (array) => {
    const returnObject = {};

    array.forEach((object) => {
      const keyName = buildMeta(object.key);
      const value = buildMeta(object.val);
      if (keyName && value) {
        returnObject[keyName] = value;
      }
    });

    return returnObject;
  };

  const createRequestObj = () => {
    const requestObj = {
      method: '',
      headers: [],
      url: [],
    };

    requestObj.method = selectedAction.split(' ')[2] || 'GET';
    requestObj.headers = buildMetaObjectFromArray(headers);
    requestObj.url = buildMeta(url);
    return requestObj;
  };

  const mapVars = (responseData) => {
    const mappedVars = [];

    mapping.forEach((mappedOutput) => {
      try {
        mappedVars.push({
          path: mappedOutput.path,
          var: mappedOutput.var,
          value: findPath(buildMeta(mappedOutput.path), responseData),
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

  const makeRequest = () => {
    const requestObj = createRequestObj();
    const VariableDropdown = dropdownRef?.current;
    const initTime = Date.now();
    setSendingRequest(true);
    if (dropdownRef && variableValuesArray.length > 0 && VariableDropdown.state.isOpened === true) {
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
  };

  useEffect(() => {
    extractVariables();
    setDropdownRef(React.createRef());
    setVariableValuesArray(variables);
    if (variables.length === 0) {
      makeRequest();
    }
  }, []);

  return (
    <Modal data={data} toggle={closeTestModal} isOpen={testModalOpened} onClosed={closeTestModal}>
      <ModalHeader toggle={closeTestModal} header="API TEST" />
      <ModalBody>
        {variableValuesArray.length > 0 && (
          <DropdownCollapseContainer>
            <DropdownCollapse text="Set Variable Values" ref={dropdownRef}>
              <div className="pb-2">
                {variableValuesArray.map((variable, index) => (
                  <SetVariableInput prefix={variable.name} key={index} onChange={(e) => setVarValue(e.target.value, index)} />
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

export default CustomApiTestModal;
