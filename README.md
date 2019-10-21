# creator-app

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/0d8d6315726f4eb09e278701f739147d)](https://www.codacy.com?utm_source=github.com&utm_medium=referral&utm_content=storyflow/creator-app&utm_campaign=Badge_Grade)
[![CircleCI](https://circleci.com/gh/voiceflow/creator-app/tree/master.svg?style=shield&circle-token=d2fee4e418aa5f2a3499ac21cbc5f86c2e0fcdf4)](https://circleci.com/gh/voiceflow/creator-app/tree/master)

## Configuration

### Package Manager

This Repository Relies on `yarn` and does not work with `npm`

### Debugging

Different types of debugging can be granularly enabled within the app, or globally enabled although it may cause a lot of noise in the logs.

To enable granular debugging, pass all of the debug flags described below that you would like enabled.
To enable all debugging, you can pass the flag `--debug` when starting the app:

```sh
yarn start --debug
```

#### Network Debugging

Display all outgoing network requests (that pass through `src/client/fetch` or the socket client) in the console.

To enable network debugging:

```sh
yarn start --debugNet
```

You can also enable more granular network debugging by passing `--debugHttp` to only see HTTP/HTTPS requests
or `--debugSocket` to only see websocket events.

### LogRocket

To enable LogRocket when running locally, set the environment variable `REACT_APP_LOGROCKET_ENABLED` to `"true"`
in the `.env.local` file in this directory. If this file doesn't exist then create one.

```sh
REACT_APP_LOGROCKET_ENABLED='true'
```

## Previewing in an ephmeral environment

1. Ask Frank (@Fran) <<frank@voiceflow.com>> for an ephemeral environment
2. A hash string will be given to you that represents your ephemeral environment name
3. Run `yarn preview <environment name>`
4. Monitor CircleCI to check your ephemeral branch's (`ephemeral-<environment name>`) deployment status.

- Make sure you run `yarn preview <environment name>` at least once in the `creator-app` repository after you have received your ephemeral environment. This will ensure that the app's API_URL is set correctly to your ephemeral API server.

| Component   | URL                                                |
| ----------- | -------------------------------------------------- |
| creator-api | `https://api.<environment name>.voiceflow.com`     |
| creator-app | `https://creator.<environment name>.voiceflow.com` |

Currently, only the `creator` component is supported; `voiceflow-server` and `integrations` services are not deployed as of this writing. HTTP 500 errors on the `/integrations` path is normal since the `integrations` service is not deployed.

#### Ephemeral environment rip down

1. Run `yarn preview:delete <environment name>`
2. If you are completely finished using the environment, please inform Frank to remove all cloud resources.

## Editor Configuration

See [editor configuration docs](https://github.com/storyflow/workspace#editor-configuration)
