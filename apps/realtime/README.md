# Realtime

This service wraps an instance of `@logux/server` and exposes a websocket connection for `creator-app` to connect to.

## Usage

For development this API can be meshed with your active `vfcli` environment.

```sh
yarn local
```

When running, the following servers will be exposed:

- **[`logux`](https://logux.org/) (WebSocket)**
  - **local**: `wss://localhost:8013`
  - **remote**: `wss://realtime-[environment].[region].development.voiceflow.com`
- **[`socket.io`](https://socket.io/) (WebSocket)**
  - **local**: `wss://localhost:8017`
  - **remote**: `wss://realtime-io-[environment].[region].development.voiceflow.com`
- **Metrics**
  - **local**: `https://localhost:9013`

## Health

To check if this service is up and running correctly you can query the `GET /health` endpoint.
