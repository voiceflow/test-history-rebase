# Creator App

A frontend webapp for Voiceflow agent creation experience.

## Usage

For development this webapp can be meshed with your active `vfcli` environment.

```sh
yarn local
```

When running, the webapp will be available at <https://creator-local.development.voiceflow.com:3002>.

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
