# Designer HTTP SDK

## Installation

```sh
yarn add --exact @voiceflow/sdk-http-designer
```

## Browser Usage

```ts
import { DesignerClient } from '@voiceflow/sdk-http-designer';

// initialize client
const client = new DesignerClient({ headers: { authorization: 'Bearer <token>' } });

// send request
const session = await client.session.login();
```

## Node Usage

```ts
import { DesignerClient } from '@voiceflow/sdk-http-designer';
import { fetch } from 'undici';

// initialize client
const client = new DesignerClient({ fetchApi: fetch });

// send request
const session = await client.session.login({ headers: { authorization: 'Bearer <token>' } });
```

## Build

There are multiple steps to building this library locally.

```sh
# run the server & generate the client files
yarn codegen

# build the client with generated files
yarn build
```
