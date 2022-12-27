// config/vite/config.ts
import path from "path";
import { defineConfig } from "file:///Users/tylerhan/voiceflow/creator-app/node_modules/vite/dist/node/index.js";
var rootDir = process.cwd();
var config_default = defineConfig({
  root: rootDir,
  resolve: {
    alias: [
      { find: /@\/(.*)/, replacement: path.resolve(rootDir, "/src/$1") },
      { find: /@voiceflow\/ml-sdk/, replacement: path.resolve(rootDir, "../ml-sdk/src") },
      { find: /@ml-sdk\/(.*)/, replacement: path.resolve(rootDir, "../ml-sdk/src/$1") },
      { find: /@voiceflow\/socket-utils/, replacement: path.resolve(rootDir, "../socket-utils/src") },
      { find: /@socket-utils\/(.*)/, replacement: path.resolve(rootDir, "../socket-utils/src/$1") }
    ]
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29uZmlnL3ZpdGUvY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3R5bGVyaGFuL3ZvaWNlZmxvdy9jcmVhdG9yLWFwcC9wYWNrYWdlcy9tbC1nYXRld2F5L2NvbmZpZy92aXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdHlsZXJoYW4vdm9pY2VmbG93L2NyZWF0b3ItYXBwL3BhY2thZ2VzL21sLWdhdGV3YXkvY29uZmlnL3ZpdGUvY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy90eWxlcmhhbi92b2ljZWZsb3cvY3JlYXRvci1hcHAvcGFja2FnZXMvbWwtZ2F0ZXdheS9jb25maWcvdml0ZS9jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuXG5jb25zdCByb290RGlyID0gcHJvY2Vzcy5jd2QoKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcm9vdDogcm9vdERpcixcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiBbXG4gICAgICB7IGZpbmQ6IC9AXFwvKC4qKS8sIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUocm9vdERpciwgJy9zcmMvJDEnKSB9LFxuICAgICAgeyBmaW5kOiAvQHZvaWNlZmxvd1xcL21sLXNkay8sIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUocm9vdERpciwgJy4uL21sLXNkay9zcmMnKSB9LFxuICAgICAgeyBmaW5kOiAvQG1sLXNka1xcLyguKikvLCByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKHJvb3REaXIsICcuLi9tbC1zZGsvc3JjLyQxJykgfSxcbiAgICAgIHsgZmluZDogL0B2b2ljZWZsb3dcXC9zb2NrZXQtdXRpbHMvLCByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKHJvb3REaXIsICcuLi9zb2NrZXQtdXRpbHMvc3JjJykgfSxcbiAgICAgIHsgZmluZDogL0Bzb2NrZXQtdXRpbHNcXC8oLiopLywgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShyb290RGlyLCAnLi4vc29ja2V0LXV0aWxzL3NyYy8kMScpIH0sXG4gICAgXSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1WCxPQUFPLFVBQVU7QUFDeFksU0FBUyxvQkFBb0I7QUFFN0IsSUFBTSxVQUFVLFFBQVEsSUFBSTtBQUU1QixJQUFPLGlCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxFQUFFLE1BQU0sV0FBVyxhQUFhLEtBQUssUUFBUSxTQUFTLFNBQVMsRUFBRTtBQUFBLE1BQ2pFLEVBQUUsTUFBTSxzQkFBc0IsYUFBYSxLQUFLLFFBQVEsU0FBUyxlQUFlLEVBQUU7QUFBQSxNQUNsRixFQUFFLE1BQU0saUJBQWlCLGFBQWEsS0FBSyxRQUFRLFNBQVMsa0JBQWtCLEVBQUU7QUFBQSxNQUNoRixFQUFFLE1BQU0sNEJBQTRCLGFBQWEsS0FBSyxRQUFRLFNBQVMscUJBQXFCLEVBQUU7QUFBQSxNQUM5RixFQUFFLE1BQU0sdUJBQXVCLGFBQWEsS0FBSyxRQUFRLFNBQVMsd0JBQXdCLEVBQUU7QUFBQSxJQUM5RjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
