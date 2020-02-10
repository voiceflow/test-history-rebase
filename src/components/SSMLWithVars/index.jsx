import React from 'react';

import SSML, { DEFAULT_VOICE } from '@/components/SSML';
import { toast } from '@/components/Toast';
import { addGlobalVariable } from '@/ducks/skill';
import { connect } from '@/hocs';
import { allVariablesSelector } from '@/store/selectors';
import { compose } from '@/utils/functional';

const SSMLWithVars = ({ icon = 'alexa', voice, variables, addGlobalVariable, ...props }, ref) => {
  const vars = React.useMemo(() => variables.map((name) => ({ id: name, name, isVariable: true })), [variables]);

  const onAddVariable = React.useCallback(
    (name) => {
      try {
        addGlobalVariable(name);

        return { id: name, name, isVariable: true };
      } catch (err) {
        toast.error(err);

        return null;
      }
    },
    [addGlobalVariable]
  );

  return <SSML ref={ref} icon={icon} voice={voice || DEFAULT_VOICE} space variables={vars} onAddVariable={onAddVariable} {...props} />;
};

const mapStateToProps = {
  variables: allVariablesSelector,
};

const mapDispatchToProps = {
  addGlobalVariable,
};

export default compose(connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true }), React.forwardRef)(SSMLWithVars);
