import axios from 'axios';
import React, { useEffect } from 'react';

function Reference(props) {
  const project_id = props.match.params.project_id;
  const history = props.history;
  useEffect(() => {
    axios.post(`/project/${project_id}/use_reference`).then((res) => history.replace(`/canvas/${res.data.skill_id}`));
  }, [project_id]);
  return (
    <div id="loading-diagram">
      <div className="text-center">
        <h5 className="text-muted mb-2">Loading Project...</h5>
        <span className="loader" />
      </div>
    </div>
  );
}
export default Reference;
