# creator-app

[![circle ci](https://circleci.com/gh/voiceflow/creator-app/tree/master.svg?style=shield&circle-token=d2fee4e418aa5f2a3499ac21cbc5f86c2e0fcdf4)](https://circleci.com/gh/voiceflow/creator-app/tree/master)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=voiceflow_creator-app&metric=coverage&token=12b0291403fde6d83376469eaf9c2371b8c9685a)](https://sonarcloud.io/dashboard?id=voiceflow_creator-app)
[![sonar quality gate](https://sonarcloud.io/api/project_badges/measure?project=voiceflow_creator-app&metric=alert_status&token=12b0291403fde6d83376469eaf9c2371b8c9685a)](https://sonarcloud.io/dashboard?id=voiceflow_creator-app)

## Getting Started

### Environment

In order to run this package locally, make sure you have `yarn` and `brew` installed.

### Package Manager

This Repository Relies on `yarn` and does not work with `npm`.

### Install Dependencies

Run `yarn` or `yarn install` in the root directory of this monorepo to install dependencies for every package.

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

Generate bundled, browser-ready code.

```sh
yarn build
```

### Start

Run a local development server that watches files and re-builds them on the fly.

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

#### Integration Tests

Run interaction tests with `jest`.

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

#### End to End Tests

Run e2e tests with `cypress`.
Make sure you already have `creator-api` and `creator-app` running locally and you've initialized the `database` with `yarn init:local`

**Interactive Tests**

1. Start the interactive testing tool `yarn cypress`
1. Select the tests you want to run, and you can see them executing in a browser that will open

**Headless Tests**

1. Start the interactive testing tool `yarn cypress:run`
1. Results of the tests will be printed to the console

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

You can also enable more granular network debugging by passing `--debugFetch` to only see HTTP/HTTPS requests
or `--debugSocket` to only see websocket events.

#### Realtime Debugging

Websockets are very convenient to debug in the browser, but the sheer volume of events that are sent for a production scenario
can often make simple local debugging very difficult. Enabling realtime debugging will prevent the mouse movement events
from being sent in order to cut down on noise in the websocket event log.

To enable realtime debugging:

```sh
yarn start --debugRealtime
```

#### Canvas Debugging

To enable all canvas debugging:

```sh
yarn start --debugCanvas
# or
VF_APP_DEBUG_CANVAS='true'
```

**Canvas Crosshair**

Show an overlay of a crosshair with coordinates relative to the window to help with debugging / developing position-sentitive elements.

To enable:

```sh
yarn start --canvasCrosshair
# or
VF_APP_CANVAS_CROSSHAIR='true'
```

#### Logging

When running locally the log level will automatically be set to `info`, in production it will be set to `error`.
You can also override the log level when running locally. You can also filter the logs presented by passing
a comma-separated list of log namespace globs to allow. Any path segment can also be matched with a `*` or
multiple path segments can be matched with `**`.

```sh
yarn start --logLevel info
yarn start --logFilter 'client.fetch,engine.*,client.adapter.**'

# or

VF_APP_LOG_LEVEL='info'
VF_APP_LOG_FILTER='client.fetch,engine.*,client.adapter.**'
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

### Private Cloud

Some features are disabled when running on a private cloud.

```sh
VF_APP_CLOUD_ENV='myPrivateCloud'

```

You are also able to use the flag `--privateCloud` to enable it from the command line.

```sh
yarn start --privateCloud myPrivateCloud
```

### Feature Flags

All feature flags environment variables begin with `VF_APP_FF_`.
You can invoke the feature by setting the appropriate environment variable in a `.env.local` file.

```sh
VF_APP_FF_SOME_FEATURE='true'
```

### Environment variable overrides

To properly decouple code from configuration, certain configuration variables can be overriden at runtime.
This is accomplished by injecting these variables into the `window` global variable in `public/static.js`.
The dockerfile entrypoint is a script that checks for container environment variables prefixed with `VF_OVERRIDE` and populates `public/static.js`.
The override logic is written in `src/config/index.ts`; if the override on a given variable is populated, then it will override the target variable.
NOTE: PLEASE DO NOT MODIFY `public/static.js`!!! It should be solely managed by the startup script.

## Previewing in a Development Environment

### Preparations

Make sure your `envcli` utility is properly set up by following the [envcli readme](https://github.com/voiceflow/envcli).

### Previewing

```bash
envcli preview
```

Follow the interactive prompt for environment creation (if applicable). The command will output a CircleCI link that you can follow to see the deployment status of the `creator-app` in your environment.

## Editor Configuration

See [editor configuration docs](https://github.com/storyflow/workspace#editor-configuration).
