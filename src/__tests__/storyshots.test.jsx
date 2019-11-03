/* eslint-disable react/display-name */

import 'jest-styled-components';

import initStoryshots from '@storybook/addon-storyshots';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import _ from 'lodash';
import path from 'path';
import React from 'react';

import { Test, Variant } from '@/../.storybook';
import { VariantContent } from '@/../.storybook/Variant';

jest.mock('react-stripe-elements', () => ({
  Elements: (props) => <mock-stripe-elements {...props} />,
  CardElement: (props) => <mock-stripe-card-element {...props} />,
  injectStripe: (Component) => (props) => <Component {...props} />,
  StripeProvider: (props) => <mock-stripe-provider {...props} />,
}));

window.Stripe = _.constant('stripe');

function getSnapshotFileName(context) {
  const fileName = context.fileName;

  if (!fileName) {
    return null;
  }

  const { dir, name } = path.parse(fileName);
  return path.format({ dir: path.join(dir, '__snapshots__'), name, ext: '.storyshot' });
}

function test({ story, context }) {
  const { shallow: isShallow } = story.parameters.options;
  const snapshotFileName = getSnapshotFileName(context);

  const storyElement = story.render(context);
  let tree = shallow(storyElement);

  const testElm = tree.find(Test);

  if (!testElm.exists()) {
    throw new Error('Story must be wrapped in to Test component, please use "createTestableStory" function');
  }

  let r = (e) => e;

  if (isShallow) {
    tree = tree.children().dive();
    r = (v) => v.children().shallow();
  } else {
    tree = mount(storyElement)
      .find(Test)
      .children()
      .children()
      .children()
      .children()
      .children();

    r = (e) =>
      e
        .find(VariantContent)
        .children()
        .children()
        .children()
        .children();
  }

  const variants = tree.find(Variant);
  const elementsToTest = variants.exists()
    ? variants.map((v) => ({ elm: r(v), name: v.prop('label') || 'default' }))
    : [{ elm: isShallow ? tree.shallow() : tree.children().children(), name: 'default' }];

  if (!snapshotFileName) {
    elementsToTest.forEach(({ elm, name }) => expect(toJson(elm)).toMatchSnapshot(name));
  } else {
    elementsToTest.forEach(({ elm, name }) => expect(toJson(elm)).toMatchSpecificSnapshot(snapshotFileName, name));
  }
}

initStoryshots({ test });
