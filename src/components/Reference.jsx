import React, { useEffect } from 'react';
import styled from 'styled-components';

import client from '@/client';
import { FullSpinner } from '@/components/Spinner';
import { RootRoute } from '@/config/routes';

const Diagram = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
`;

function Reference(props) {
  const projectID = props.match.params.project_id;
  const history = props.history;

  useEffect(() => {
    client.project.claimReference(projectID).then(({ skill_id }) => history.replace(`/${RootRoute.PROJECT}/${skill_id}/canvas`));
  }, [projectID]);

  return (
    <Diagram>
      <FullSpinner name="Project" />
    </Diagram>
  );
}
export default Reference;
