import React from 'react';

import Collapsable from '@/components/Collapsable';
import { Paragraph, Section, Title } from '@/components/Tooltip';
import VideoPlayer from '@/components/VideoPlayer';

function HelpTooltip() {
  return (
    <>
      <Section marginBottomUnits={2.5}>
        <VideoPlayer link="https://www.youtube.com/embed/mxe1iwDboHc" height="210px" />
      </Section>
      <Title isSubtitle>Tutorial Recap</Title>
      <Collapsable title="Intents">
        <Paragraph>
          Intents are a collection of phrases (refered to as utterances) that aim to capture a users intention. For each project, you’ll define many
          intents, the combination of these intents can handle a complete conversation. When a user says something Voiceflow matches the users reply
          to the best intent in your project.
        </Paragraph>
        <Paragraph>
          For example, let’s imagine we’re building a pizza ordering experience, we will likely have an intent called “order pizza”, “check on my
          order”, and “help”, among others. The collection of these intents, or user intentions will make-up our conversation. Each of these intents
          will contain phrases that we call utterances, which allow Voiceflow to more accurately match what a user says to an intent. After a user
          triggers an intent, it is up to you to decide what we do next.
        </Paragraph>
      </Collapsable>

      <Collapsable title="Utterances">
        <Paragraph>
          Utterances are example phrases for what end-users might say. For each intent, you create many utterances. When an user reply resembles one
          of these phrases, Voiceflow matches the intent.
        </Paragraph>
        <Paragraph>
          For example, the training phrase "I want pizza" trains your agent to recognize user replys that are similar to that phrase, like "Get a
          pizza" or "Order pizza".
        </Paragraph>
        <Paragraph>
          You don't have to define every possible example, because Alexa and Googles machine learning expands on your list with other, similar
          phrases. You should create at least 10 training phrases, so your project can recognize a variety of user replys.
        </Paragraph>
      </Collapsable>

      <Collapsable title="Slots">
        <Paragraph>
          Slots are best described as variables within an utterance. They help us pick out important pieces of information from a sentence that we can
          use to fulfill the users intent.
        </Paragraph>
        <Paragraph marginBottomUnits={2}>
          Voiceflow already contains a set of pre-defined slot types including First Name, Country, Airport etc. You also have the ability to define
          our own custom slots types.
        </Paragraph>
      </Collapsable>
    </>
  );
}

export default HelpTooltip;
