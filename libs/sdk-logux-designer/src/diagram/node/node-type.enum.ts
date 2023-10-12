export enum NodeType {
  /* root */

  ACTIONS__V3 = 'actions.v3',
  BLOCK__V3 = 'block.v3',
  START__V3 = 'start.v3',

  /* steps */

  STEP__FLOW__V3 = 'step.flow.v3',
  STEP__FUNCTION__V3 = 'step.function.v3',
  STEP__CONDITION__V3 = 'step.condition.v3',
  STEP__LISTEN__V3 = 'step.listen.v3',
  STEP__RANDOM__V3 = 'step.random.v3',
  STEP__RESPONSE__V3 = 'step.response.v3',
  STEP__SET__V3 = 'step.set.v3',

  /* actions */

  ACTION__END__V3 = 'action.end.v3',
  ACTION__GO_TO_BLOCK__V3 = 'action.go_to_block.v3',
  ACTION__GO_TO_FLOW__V3 = 'action.go_to_flow.v3',
  ACTION__GO_TO_STORY__V3 = 'action.go_to_story.v3',
  ACTION__OPEN_URL__V3 = 'action.open_url.v3',
  ACTION__SET_VARIABLE__V3 = 'action.set_variable.v3',
}
