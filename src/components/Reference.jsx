import axios from 'axios';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { FullSpinner } from '@/components/Spinner';

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
  const project_id = props.match.params.project_id;
  const history = props.history;
  useEffect(() => {
    axios.post(`/project/${project_id}/use_reference`).then((res) => history.replace(`/canvas/${res.data.skill_id}`));
  }, [project_id]);
  return (
    <Diagram>
      <FullSpinner name="Project" />
    </Diagram>
  );
}
export default Reference;
