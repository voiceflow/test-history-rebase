import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';

const mapStateToProps = {
  data: Creator.focusedNodeDataSelector,
};

// eslint-disable-next-line import/prefer-default-export
export const withManagerProps = connect(mapStateToProps);
