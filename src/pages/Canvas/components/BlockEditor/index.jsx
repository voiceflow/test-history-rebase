import React from 'react';
import { Tooltip } from 'react-tippy';

import { FlexCenter } from '@/components/Flex';
import { RepromptType } from '@/constants';
import { HelpModalConsumer } from '@/pages/Canvas/contexts/HelpModalContext';

import { Body, Container, Content, Header, RemovableSection, Section, SettingsMenu, Title } from './components';

export { Section, Content, RemovableSection, Title };

function BlockEditor({ data, onChange, children, onExpand, onRemove, onDuplicate, expanded, hideHeader, renameActiveRevision }) {
  const addEmptyReprompt = React.useCallback(() => onChange({ reprompt: { type: RepromptType.TEXT } }), [onChange]);

  return (
    <Container>
      {!hideHeader && (
        <Header>
          <Title name={data.name} onChange={onChange} renameActiveRevision={renameActiveRevision} />
          <FlexCenter>
            <Tooltip html="Learn more" position="left" distance={10}>
              <HelpModalConsumer>
                {({ setType, toggle }) => (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                  <i
                    className="more-info d-flex align-items-center"
                    onClick={() => {
                      setType(data.type);
                      toggle(true);
                    }}
                  />
                )}
              </HelpModalConsumer>
            </Tooltip>
            <SettingsMenu addReprompt={addEmptyReprompt} data={data} onExpand={onExpand} onRemove={onRemove} onDuplicate={onDuplicate} />
          </FlexCenter>
        </Header>
      )}
      <Body expanded={expanded}>{children}</Body>
    </Container>
  );
}

export default BlockEditor;
