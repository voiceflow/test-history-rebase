# ML Gateway

This service wraps an instance of `@logux/server` and exposes a websocket connection for `creator-app` to connect to.

## Usage

For development this API can be meshed with your active `vfcli` environment.

```sh
yarn local
```

When running, the following servers will be exposed:

- **[`logux`](https://logux.org/) (WebSocket)**
  - **local**: `wss://localhost:8015`
  - **remote**: `wss://ml-gateway-[environment].[region].development.voiceflow.com`
- **Metrics**
  - **local**: `https://localhost:9015`
