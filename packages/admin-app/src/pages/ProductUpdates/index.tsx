import { Button, ButtonVariant, toast } from '@voiceflow/ui';
import Markdown from 'markdown-to-jsx';
import React from 'react';
import { Form, FormGroup, Input, Label } from 'reactstrap';

import { Admin } from '@/client';
import { PageTitle } from '@/components/PageLayout';
import { UpdateType } from '@/models';

const ProductUpdates: React.FC = () => {
  const [type, setType] = React.useState(UpdateType.FEATURE);
  const [details, setDetails] = React.useState('');

  const onCreateUpdate = async () => {
    try {
      await Admin.setProductUpdate({ type, details });

      setType(UpdateType.FEATURE);
      setDetails('');

      toast.success('Product update successfully added');
    } catch (err) {
      toast.error('Fields not Complete!');
    }
  };

  return (
    <>
      <PageTitle>Product Updates</PageTitle>

      <hr />

      <div className="content">
        <h5>Create a new update</h5>

        <Form>
          <FormGroup>
            <Label for="type">What type of update is it</Label>

            <Input type="select" name="type" id="type" onChange={({ currentTarget }) => setType(currentTarget.value as UpdateType)}>
              <option>{UpdateType.FEATURE}</option>
              <option>{UpdateType.UPDATE}</option>
              <option>{UpdateType.CHANGE}</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="details">Enter your update here</Label>
            <Input
              type="textarea"
              name="details"
              id="details"
              placeholder="Checkout new **features** of [Voiceflow Creator](https://creator.voiceflow.com)"
              onChange={({ currentTarget }) => setDetails(currentTarget.value)}
            />
          </FormGroup>
        </Form>

        <div className="sample">
          <h6>Sample update:</h6>

          <hr />

          <div className="wrapper">
            <span>Input: </span>
            <p className="code">Checkout new **features** of [Voiceflow Creator](https://creator.voiceflow.com)</p>
          </div>

          <div className="wrapper">
            <span>Output: </span>
            <p className="code">
              <Markdown>Checkout new **features** of [Voiceflow Creator](https://creator.voiceflow.com)</Markdown>
            </p>
          </div>

          <p>
            Can also use - {/* eslint-disable-next-line react/jsx-no-target-blank */}
            <a href="https://stackedit.io/app#" target="_blank">
              Slack Markdown editor
            </a>{' '}
            (third-party)
          </p>
        </div>

        <Button variant={ButtonVariant.PRIMARY} onClick={onCreateUpdate}>
          Create New Update
        </Button>
      </div>
    </>
  );
};

export default ProductUpdates;
