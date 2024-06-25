import { Input, Select, Spinner } from '@voiceflow/ui';
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';
import React from 'react';
import { connect } from 'react-redux';

import Section from '@/components/Section';
import SubHeaderTabs from '@/components/Tabs';
import * as Version from '@/ducks/versionV2';
import { useSmartReducer } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { Content, Controls, FormControl } from '@/pages/Canvas/components/Editor';

import { Client, Domain, HelpTooltip, Scope, SpinnerContainer, SubHeader } from './components';
import { CLIENT_AUTH_SCHEMES, EMPTY_ACCOUNT_DATA, TABS } from './constants';

const TAB_COMPONENTS = {
  client: Client,
  scope: Scope,
  domain: Domain,
};

function AccountLinkingEditor({ data, isOpen, loadAccountLinking, patchSettings }) {
  const [activeTab, setActiveTab] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);
  const [state, actions] = useSmartReducer(EMPTY_ACCOUNT_DATA);

  const stateRef = React.useRef();
  const TabComponent = TAB_COMPONENTS[activeTab] || Client;

  const save = React.useCallback(async () => {
    try {
      await patchSettings({ accountLinking: stateRef.current });
    } catch (err) {
      ModalsV2.openError({ error: 'Unable to save template' });
    }
  }, []);

  const getState = React.useCallback(async () => {
    try {
      const accountLinking = await loadAccountLinking();

      if (!_isEmpty(accountLinking) && accountLinking !== null) {
        actions.set(accountLinking);
      } else {
        actions.set(EMPTY_ACCOUNT_DATA);
      }
      setLoading(false);
    } catch (err) {
      ModalsV2.openError({ error: 'Unable to Retrieve Account Linking Info' });
    }
  }, [loadAccountLinking, actions]);

  React.useEffect(() => {
    stateRef.current = state;
  }, [state]);

  React.useEffect(() => {
    // TODO figure out why returning save does not work for effect cleanup
    if (isOpen) {
      getState();
    } else if (stateRef.current) {
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
    (index, type) => actions.update({ [type]: _filter(state[type], (p, predictIndex) => index !== predictIndex) }),
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
                value={state.authorizationUrl || ''}
                placeholder="Enter URL"
                onChangeText={(value) => handleInputUpdate('authorizationUrl', value)}
              />
            </FormControl>
            <FormControl label="Access Token URL" contentBottomUnits={0}>
              <Input
                value={state.accessTokenUrl || ''}
                placeholder="Enter Token URL"
                onChangeText={(value) => handleInputUpdate('accessTokenUrl', value)}
              />
            </FormControl>
          </Section>

          <div>
            <SubHeader>
              <SubHeaderTabs
                options={TABS}
                selected={activeTab || 'client'}
                onChange={(value) => setActiveTab(value)}
              />
            </SubHeader>

            <TabComponent
              data={state}
              onUpdate={handleInputUpdate}
              handleAdd={handleAdd}
              handleRemove={handleRemove}
              handleChange={handleChange}
            />

            <Section>
              <FormControl label="Access Token Expiration">
                <Input
                  value={state.defaultTokenExpirationInSeconds}
                  onChangeText={(value) => handleInputUpdate('defaultTokenExpirationInSeconds', +value)}
                />
              </FormControl>
              <FormControl label="Client Authentication Scheme" contentBottomUnits={0}>
                <Select
                  value={CLIENT_AUTH_SCHEMES.find(({ value }) => value === state.accessTokenScheme)?.label}
                  placeholder={
                    _find(CLIENT_AUTH_SCHEMES, {
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
  patchSettings: Version.alexa.patchSettings,
  loadAccountLinking: Version.alexa.loadAccountLinking,
};

export default connect(null, mapDispatchToProps)(AccountLinkingEditor);
