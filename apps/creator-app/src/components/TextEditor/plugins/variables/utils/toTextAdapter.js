const toTextAdapter =
  () =>
  ({ mention }, { variables = [] }) => ({
    text: `{{[${mention.name}].${mention.id}}}`,
    variables: [...variables, mention.id],
  });

export default toTextAdapter;
