import _ from 'lodash';
import React from 'react';

import Input from '@/components/Input';
import { SubHeader } from '@/components/Page/components';
import Select from '@/components/Select';
import { Spinner } from '@/components/Spinner';
import SubHeaderTabs from '@/components/Tabs';
import { setError } from '@/ducks/modal';
import { getAccountLinking, saveAccountLinking } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useSmartReducer } from '@/hooks';
import { Content, Controls, FormControl, Section } from '@/pages/Canvas/components/Editor';

import { Client, Domain, HelpTooltip, Scope, SpinnerContainer } from './components';
import { CLIENT_AUTH_SCHEMES, EMPTY_ACCOUNT_DATA, TABS } from './constants';

const TAB_COMPONENTS = {
  client: Client,
  scope: Scope,
  domain: Domain,
};

function AccountLinkingEditor({ data, saveAccountLinking, getAccountLinking, isOpen, setError }) {
  const [activeTab, setActiveTab] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);
  const [state, actions] = useSmartReducer(EMPTY_ACCOUNT_DATA);

  const stateRef = React.useRef();
  const TabComponent = TAB_COMPONENTS[activeTab] || Client;

  const save = React.useCallback(async () => {
    try {
      await saveAccountLinking(stateRef.current);
    } catch (err) {
      setError({ message: 'Unable to save template' });
    }
  }, [saveAccountLinking, setError]);

  const getState = React.useCallback(async () => {
    try {
      const accountLinking = await getAccountLinking();
      if (!_.isEmpty(accountLinking) && !_.isNull(accountLinking)) {
        actions.set(accountLinking);
      } else {
        actions.set(EMPTY_ACCOUNT_DATA);
      }
      setLoading(false);
    } catch (err) {
      setError({ message: 'Unable to Retrieve Account Linking Info' });
    }
  }, [getAccountLinking, actions, setError]);

  React.useEffect(() => {
    stateRef.current = state;
  }, [state]);

  React.useEffect(() => {
    // TODO figure out why returning save does not work for effect cleanup
    if (isOpen) {
      getState();
    } else {
      save();
    }
  }, [isOpen]);

  const handleInputUpdate = React.useCallback((key, value) => actions.update({ [key]: value }), [actions]);

  const handleChange = React.useCallback(
    (index, e, type) =>
      actions.update({
        [type]: state[type].map((item, predictIndex) => {
          if (predictIndex === index) {
            return e.target.value;
          }
          return item;
        }),
      }),
    [actions, state]
  );

  const handleAdd = React.useCallback((type) => actions.update({ [type]: [''].concat(state[type]) }), [actions, state]);

  const handleRemove = React.useCallback(
    (index, type) => actions.update({ [type]: _.filter(state[type], (p, predictIndex) => index !== predictIndex) }),
    [actions, state]
  );

  return (
    <Content
      footer={() => (
        <Controls
          tutorial={{
            blockType: data.type,
            content: <HelpTooltip />,
          }}
          tutorialAnchor="What's Account Linking"
          tutorialTitle="Account Linking"
        />
      )}
      hideFooter={isLoading}
    >
      {isLoading ? (
        <SpinnerContainer>
          <Spinner name="Template" />
        </SpinnerContainer>
      ) : (
        <>
          <Section>
            <FormControl label="URL Authorization">
              <Input
                placeholder="Enter URL"
                value={state.authorizationUrl || ''}
                onChange={(e) => handleInputUpdate('authorizationUrl', e.target.value)}
              />
            </FormControl>
            <FormControl label="Access Token URL" contentBottomUnits={0}>
              <Input
                value={state.accessTokenUrl || ''}
                placeholder="Enter Token URL"
                onChange={(e) => handleInputUpdate('accessTokenUrl', e.target.value)}
              />
            </FormControl>
          </Section>

          <div>
            <SubHeader>
              <SubHeaderTabs options={TABS} selected={activeTab || 'client'} onChange={(value) => setActiveTab(value)} />
            </SubHeader>

            <TabComponent data={state} onUpate={handleInputUpdate} handleAdd={handleAdd} handleRemove={handleRemove} handleChange={handleChange} />

            <Section>
              <FormControl label="Access Token Expiration">
                <Input
                  value={state.defaultTokenExpirationInSeconds}
                  onChange={(e) => handleInputUpdate('defaultTokenExpirationInSeconds', e.target.value)}
                />
              </FormControl>
              <FormControl label="Client Authentication Scheme" contentBottomUnits={0}>
                <Select
                  value={CLIENT_AUTH_SCHEMES.find(({ value }) => value === state.accessTokenScheme)?.label}
                  placeholder={
                    _.find(CLIENT_AUTH_SCHEMES, {
                      value: 'HTTP_BASIC',
                    }).label
                  }
                  getOptionValue={(option) => option.value}
                  renderOptionLabel={(option) => option.label}
                  options={CLIENT_AUTH_SCHEMES}
                  onSelect={(value) => handleInputUpdate('accessTokenScheme', value)}
                />
              </FormControl>
            </Section>
          </div>
        </>
      )}
    </Content>
  );
}

const mapDispatchToProps = {
  setError,
  saveAccountLinking,
  getAccountLinking,
};

export default connect(null, mapDispatchToProps)(AccountLinkingEditor);
