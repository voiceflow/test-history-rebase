/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import { object, select, withKnobs } from '@storybook/addon-knobs';

import withMinWidth from 'stories/decorators/withMinWidth';
import { convertArrayToSelect } from 'stories/lib/helpers';

import Stepper from './index';

const steps = [
  {
    id: '1',
    label: 'First step',
    errorsCount: 0,
  },
  {
    id: '2',
    label: 'Second step',
    errorsCount: 0,
  },
  {
    id: '3',
    label: 'Third step',
    errorsCount: 0,
  },
];

storiesOf('components/Stepper', module)
  .addDecorator(withMinWidth(1000))
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Stepper
      steps={object('steps', steps)}
      activeStepId={select('activeStepId', convertArrayToSelect(steps), '2')}
      panelBodyContentRenderer={props => JSON.stringify(props)}
    />
  ))
  .add('with footer', () => (
    <Stepper
      steps={object('steps', steps)}
      activeStepId={select('activeStepId', convertArrayToSelect(steps), '2')}
      panelFooterRenderer={props => `Footer: ${JSON.stringify(props)}`}
      panelBodyContentRenderer={props => `Body: ${JSON.stringify(props)}`}
    />
  ))
  .add('with details', () => (
    <Stepper
      steps={object('steps', steps)}
      activeStepId={select('activeStepId', convertArrayToSelect(steps), '2')}
      detailsRenderer={props => `Details: ${JSON.stringify(props)}`}
      panelFooterRenderer={props => `Footer: ${JSON.stringify(props)}`}
      panelBodyContentRenderer={props => `Body: ${JSON.stringify(props)}`}
    />
  ))
  .add('with some ui', () => (
    <div className="skill-products-form">
      <Stepper
        steps={object('steps', steps)}
        activeStepId={select('activeStepId', convertArrayToSelect(steps), '2')}
        detailsRenderer={() => (
          <div className="skill-products-form-details">
            <div className="skill-products-form-details__text">
              <p>
                Tell us how the product should appear to your customers.
                <br />
                The product name is included in purchase confirmation prompts, Alexa app purchasing
                cards and email receipts.
              </p>
              <p>
                You might also include things a customer might reasonably say as synonyms to the
                product name.
                <span className="text-link">Learn More</span>
              </p>
            </div>
          </div>
        )}
        panelFooterRenderer={({ onNextStep }) => (
          <div className="panel-footer-right">
            <button onClick={onNextStep} className="btn btn-secondary">
              Next
            </button>
          </div>
        )}
        panelBodyContentRenderer={() => (
          <div className="form form-vertical">
            <div className="form-group">
              <div className="form-group-header">
                <div className="form-group-header__title">
                  <label className="form-label">Product Name</label>
                </div>
              </div>
              <input
                className="form-control"
                type="text"
                placeholder="Enter a name for your product for the English (US) store"
              />
            </div>
            <div className="form-group">
              <div className="form-group-header">
                <div className="form-group-header__title">
                  <label className="form-label">Synonyms (optional)</label>
                </div>
              </div>
              <input
                className="form-control"
                type="text"
                placeholder="Add multiple synonyms of product name divided by comma"
              />
            </div>
            <div className="form-group">
              <div className="form-group-header">
                <div className="form-group-header__title">
                  <label className="form-label">Summary Description</label>
                </div>
              </div>
              <input
                className="form-control"
                type="text"
                placeholder="Enter a short description of the product"
              />
            </div>
            <div className="form-group">
              <div className="form-group-header">
                <div className="form-group-header__title">
                  <label className="form-label">Detailed Description</label>
                </div>
              </div>
              <input
                className="form-control"
                type="text"
                placeholder="Describe the product's functionality and any prerequisites to using it"
              />
            </div>
          </div>
        )}
      />
    </div>
  ));
