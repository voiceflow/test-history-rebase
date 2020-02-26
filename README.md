# creator-app

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/0d8d6315726f4eb09e278701f739147d)](https://www.codacy.com?utm_source=github.com&utm_medium=referral&utm_content=storyflow/creator-app&utm_campaign=Badge_Grade)
[![CircleCI](https://circleci.com/gh/voiceflow/creator-app/tree/master.svg?style=shield&circle-token=d2fee4e418aa5f2a3499ac21cbc5f86c2e0fcdf4)](https://circleci.com/gh/voiceflow/creator-app/tree/master)

## Getting Started

### Environment

In order to run this package locally, make sure you have `yarn` and `brew` installed.

### Package Manager

This Repository Relies on `yarn` and does not work with `npm`.

### Install Dependencies

Use `yarn` to install this project's dependencies.

```sh
yarn install
```

### Generate SSL Certificates

Use `mkcert` to generate and install SSL certificates for local development.

```sh
yarn gen-certs
```

## Usage

### Build

Run `webpack` to generate bundled, browser-ready code.

```sh
yarn build
```

### Start

Run a local `webpack` development server that watches files and re-builds them on the fly.

```sh
yarn start
```

### Testing

#### Linting

Test the code for linting errors with `estlint` and `stylelint`.

```sh
yarn lint
```

Or to run them separately

```sh
yarn lint:js
yarn lint:css
```

#### Integration and Snapshot Tests

Run interaction and snapshot tests with `jest`.

```sh
yarn test
```

#### Watching Tests

Run `jest` in an interactive watch mode that re-runs tests whenever the files change.

```sh
yarn tdd
```

#### Updating Jest Snapshots

The recommended way to update `jest` snapshots is to run in interactive watch mode (`yarn tdd`) so that you can see all of the snapshot diffs.
Filter down to just the files that you want to update (press `t` when in interactive mode).
Once you have your filtered list, update all of the relevant snapshots (press `u` when in interactive mode).
You can also use the inbuilt interactive snapshot update mode of `jest` (press `i` when in interactive mode).

See [here](https://jestjs.io/docs/en/snapshot-testing#interactive-snapshot-mode) for more documentation on `jest` and how to use the interactive watch mode.

### Storybook

This repository generates a [storybook](https://storybook.js.org/) for its component library.

#### Start Storybook

Run a local development server that automatically re-builds changed files.

```sh
yarn storybook
```

#### Build Storybook

Generate a website from this project's stories.

```sh
yarn storybook:build
```

## Configuration

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

#### Realtime Debugging

Websockets are very convenient to debug in the browser, but the sheer volume of events that are sent for a production scenario
can often make simple local debugging very difficult. Enabling realtime debugging will prevent the mouse movement events
from being sent in order to cut down on noise in the websocket event log.

To enable realtime debugging:

```sh
yarn start --debugRealtime
```

### LogRocket

To enable LogRocket when running locally, set the environment variable `VF_APP_LOGROCKET_ENABLED` to `"true"`
in the `.env.local` file in this directory. If this file doesn't exist then create one.

```sh
VF_APP_LOGROCKET_ENABLED='true'
```

You are also able to use the flag `--logrocket` to enable it from the command line.

```sh
yarn start --logrocket
```

### Intercom

To enable Intercom when running locally, set the environment variable `VF_APP_INTERCOM_ENABLED` to `"true"`
in the `.env.local` file in this directory. If this file doesn't exist then create one.

```sh
VF_APP_INTERCOM_ENABLED='true'
```

You are also able to use the flag `--intercom` to enable it from the command line.

```sh
yarn start --intercom
```

### Google Analytics

To enable Google Analytics when running locally, set the environment variable `VF_APP_GA_ENABLED` to `"true"`
in the `.env.local` file in this directory. If this file doesn't exist then create one.

```sh
VF_APP_GA_ENABLED='true'
```

You are also able to use the flag `--ga` to enable it from the command line.

```sh
yarn start --ga
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
