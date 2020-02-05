import React from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'reactstrap';

import Button from '@/components/Button';
import Image from '@/components/Uploads/Image';
import { MODALS } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';
import { createWorkspace } from '@/ducks/workspace';
import { connect } from '@/hocs';

function NewWorkspace({ history, createWorkspace }) {
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState('');
  const { open: openSuccessModal } = useModals(MODALS.SUCCESS);

  const onChangeName = React.useCallback(
    ({ target }) => {
      setName(target.value);
      setError(null);
    },
    [setName, setError]
  );

  const onBlurName = React.useCallback(() => {
    if (name.length > 32) {
      setError('Workspace Name Too Long - 32 Characters Max');
    } else if (!name.trim()) {
      setError('Please Fill in Workspace Name');
    }
  }, [name]);

  const onContinue = React.useCallback(async () => {
    const newWorkspace = await createWorkspace({ name, image: imageUrl || undefined });

    if (newWorkspace && newWorkspace.id) {
      history.push(`/workspace/${newWorkspace.id}`);

      openSuccessModal({ title: 'Success', message: `Your workplace ${newWorkspace.name} has been successfully created` });
    } else {
      history.push('/dashboard');
    }
  }, [createWorkspace, name, imageUrl, history, openSuccessModal]);

  return (
    <div id="template-box-container">
      <div className="card">
        <Link id="exit-template" to="/dashboard" className="btn-icon" />

        <div className="container">
          <div id="name-box" className="text-center">
            <div className="mb-4">
              <h5 className="uppercase-header">Create Workspace</h5>

              <div style={{ minHeight: 45 }} className="mt-3 super-center">
                {error && (
                  <Alert color="danger small" className="m-0">
                    {error}
                  </Alert>
                )}
              </div>

              <input
                id="skill-name"
                type="text"
                name="name"
                value={name}
                required
                onBlur={onBlurName}
                onChange={onChangeName}
                className="input-underline mt-0"
                placeholder="Enter Workspace Name"
              />
            </div>

            <div className="super-center mt-5">
              <div className="text-center">
                <Image
                  replace
                  className="icon-image icon-image-sm text-center icon-image-square mb-2 mx-auto"
                  path="/image/large_icon"
                  image={imageUrl}
                  update={(url) => setImageUrl(url)}
                />
                <div className="text-muted mt-4">
                  Drop workspace icon here <br /> or browse
                </div>
              </div>
            </div>

            <div className="mt-5">
              <Button isPrimary onClick={onContinue}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  createWorkspace,
};

export default connect(
  null,
  mapDispatchToProps
)(NewWorkspace);
