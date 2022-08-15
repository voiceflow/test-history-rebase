/* eslint-disable no-useless-escape */
import { Box, Preview, Tag } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const code = `
if (dayRejex.test(date)) {
	flag = true;
} else {
	flag = false;
}

//Valid
let dayRejex = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}?$/;

//Invalid
let monthRejex = /^[0-9]{4}\-[0-9]{2}?$/;
let weekRejex = /^[0-9]{4}\-W[0-9]{2}?$/;
let yearRejex = /^[0-9]{4}?$/;
let seasonRejex = /^[0-9]{4}\-[A-Z]{2}?$/;
`;

const speakPreview = createExample('prompt list', () => (
  <Preview>
    <Preview.Header>
      <Preview.Title>All variants</Preview.Title>
    </Preview.Header>

    <Preview.Content>
      <Preview.ContentItem>
        <Preview.Text>Hi there, welcome to Voiceflow bank. How can I help you today?</Preview.Text>
        <Preview.ButtonIcon icon="copy" />
      </Preview.ContentItem>

      <Preview.ContentItem>
        <Preview.Text>Hi there, welcome to Voiceflow bank. How can I help you today?</Preview.Text>
        <Preview.ButtonIcon icon="copy" />
      </Preview.ContentItem>

      <Preview.ContentItem>
        <Preview.Text>Hi there, welcome to Voiceflow bank. How can I help you today?</Preview.Text>
        <Preview.ButtonIcon icon="copy" />
      </Preview.ContentItem>

      <Preview.ContentItem>
        <Preview.Text>Hi there, welcome to Voiceflow bank. How can I help you today?</Preview.Text>
        <Preview.ButtonIcon icon="copy" />
      </Preview.ContentItem>
    </Preview.Content>

    <Preview.Footer>
      <Preview.ButtonIcon icon="edit" mr={12} />
      <Preview.ButtonIcon icon="copy" />
    </Preview.Footer>
  </Preview>
));

const entityPreview = createExample('list with tag', () => (
  <Preview>
    <Preview.Header>
      <Preview.Title>Entity reprompt</Preview.Title>
    </Preview.Header>

    <Preview.Content>
      <Preview.ContentItem>
        <Box>
          <Tag color="blue">name</Tag>
          <Preview.Text>What&apos;s your name?</Preview.Text>
        </Box>
        <Preview.ButtonIcon icon="copy" />
      </Preview.ContentItem>
    </Preview.Content>

    <Preview.Footer>
      <Preview.ButtonIcon icon="edit" />
    </Preview.Footer>
  </Preview>
));

const urlPreview = createExample('simple preview', () => (
  <Preview>
    <Preview.Header>
      <Preview.Title>Open URL</Preview.Title>
    </Preview.Header>

    <Preview.Content>
      <Preview.Text>https://www.voiceflow.com/blog/how-to-build-a-discord-bot-with-voiceflow</Preview.Text>
    </Preview.Content>

    <Preview.Footer noBackground>
      <Preview.ButtonIcon icon="edit" mr={12} />
      <Preview.ButtonIcon icon="copy" />
    </Preview.Footer>
  </Preview>
));

const goToTargetPreview = createExample('different icons', () => (
  <Preview>
    <Preview.Header>
      <Preview.Title>Go to intent</Preview.Title>
    </Preview.Header>

    <Preview.Content>
      <Preview.Text>‘Confirmation’</Preview.Text>
    </Preview.Content>

    <Preview.Footer noBackground>
      <Preview.ButtonIcon icon="edit" mr={12} />
      <Preview.ButtonIcon icon="target" />
    </Preview.Footer>
  </Preview>
));

const popupPreview = createExample('popup', () => (
  <Preview.Popover>
    <Preview.Text>This is an incactive version</Preview.Text>
  </Preview.Popover>
));

const codePreview = createExample('code', () => (
  <Preview>
    <Preview.Header>
      <Preview.Title>Javascript</Preview.Title>
    </Preview.Header>

    <Preview.Content>
      <Preview.Code code={code} />
    </Preview.Content>

    <Preview.Footer>
      <Preview.ButtonIcon icon="edit" mr={12} />
      <Preview.ButtonIcon icon="copy" />
    </Preview.Footer>
  </Preview>
));

export default createSection('Preview', 'src/components/Preview/index.tsx', [
  speakPreview,
  entityPreview,
  codePreview,
  goToTargetPreview,
  urlPreview,
  popupPreview,
]);
