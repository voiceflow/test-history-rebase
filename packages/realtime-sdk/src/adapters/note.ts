import { DBNote, Note } from '@realtime-sdk/models';
import createAdapter, { identityAdapter } from 'bidirectional-adapter';

const noteAdapter = createAdapter<DBNote, Note>(identityAdapter.fromDB, identityAdapter.toDB);

export default noteAdapter;
