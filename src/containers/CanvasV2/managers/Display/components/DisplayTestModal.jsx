import axios from 'axios';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';

import Modal, { ModalBody, ModalHeader } from '@/components/Modal';
import { Spinner } from '@/components/Spinner';
import Button from '@/componentsV2/Button';

import DisplayRender from './DisplayRender';

const validVariableInjection = (variables, userVariables) => {
  for (let i = 0; i < variables.length; i++) {
    const variable = variables[i];
    const userVariable = userVariables[variable];
    if (_.isNil(userVariable) || userVariable === '') {
      return false;
    }
  }
  return true;
};

const DisplayTestModal = ({ displayModalContext }) => {
  const { isEnabled, toggle, displayID, datasource, aplCommands } = displayModalContext;

  const [variables, setVariables] = React.useState([]);
  const [userSetVariables, setUserSetVariables] = React.useState({});
  const [error, setError] = React.useState('');
  const [renderedDatasource, setRenderedDatasource] = React.useState(null);
  const [currentRequest, setCurrentRequest] = React.useState(false);
  const [modalContent, setModalContent] = React.useState(null);

  const handleVariableChange = (e) => {
    userSetVariables[e.target.name] = e.target.value;
    setUserSetVariables(userSetVariables);
    setError('');
  };

  const testDisplay = () => {
    let datasourceFinal = datasource;

    if (!validVariableInjection(variables, userSetVariables)) return setError('Variables cannot be blank!');
    if (!currentRequest) {
      setCurrentRequest(true);
      setModalContent(null);

      Object.entries(userSetVariables).forEach(([old_str, new_str]) => {
        const replacement = new_str;
        const re = new RegExp(`{${old_str}}`, 'g');
        datasourceFinal = datasource.replace(re, replacement);
      });

      axios
        .get(`/multimodal/display/${displayID}`)
        .then((res) => {
          setCurrentRequest(false);
          setRenderedDatasource(datasourceFinal);
          setModalContent(res.data.document);
        })
        .catch((err) => {
          setCurrentRequest(false);
          setModalContent(err);
        });
    }
  };

  useEffect(() => {
    const extractedVariables = (datasource.match(/{\w+}/g) || []).map((s) => s.slice(1, -1));
    setVariables(extractedVariables);
    if (extractedVariables.length === 0) testDisplay();
  }, []);

  return (
    <Modal size="lg" isOpen={isEnabled} toggle={toggle}>
      <ModalHeader toggle={toggle} header="Multimodal Display Test" />
      <ModalBody>
        <div>
          {!_.isEmpty(variables) && (
            <>
              <label>We've detected you are using variables in your Data Source JSON, please set variables and run</label>

              {_.map(variables, (val, key) => (
                <React.Fragment key={key}>
                  <InputGroup className="mb-2">
                    <InputGroupAddon addonType="prepend">{val}</InputGroupAddon>
                    <Input className="form-control form-control-border right" name={val} placeholder="set variable" onChange={handleVariableChange} />
                  </InputGroup>
                </React.Fragment>
              ))}
              <div>
                <Button color="primary" onClick={() => testDisplay()} className="mt-2 mb-2" disabled={error}>
                  <i className="fas fa-play mr-2" /> Run
                </Button>
              </div>
            </>
          )}
          {modalContent && error && <div className="error-message text-center">{error}</div>}
          {currentRequest && <Spinner isEmpty />}
          {modalContent && <div className="space-between flex-hard" />}
          {modalContent && renderedDatasource && (
            <DisplayRender apl={modalContent} data={renderedDatasource} commands={aplCommands} error={(e) => setError(e)} />
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DisplayTestModal;
