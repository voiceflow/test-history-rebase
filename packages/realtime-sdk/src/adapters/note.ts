import { DBNote, Note } from '@realtime-sdk/models';
import { createMultiAdapter, identityAdapter } from 'bidirectional-adapter';

const noteAdapter = createMultiAdapter<DBNote, Note>(identityAdapter.transformer, identityAdapter.transformer);

export default noteAdapter;
