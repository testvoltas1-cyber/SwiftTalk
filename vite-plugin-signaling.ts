import type { Plugin } from 'vite';
import { WebSocketServer } from 'ws';
import { SignalingServer } from './server/signaling';

export function signalingPlugin(): Plugin {
  let signalingServer: SignalingServer | null = null;

  return {
    name: 'vite-plugin-signaling',
    configureServer(server) {
      if (!server.httpServer) return;

      const wss = new WebSocketServer({
        noServer: true,
      });

      signalingServer = new SignalingServer(wss);

      server.httpServer.on('upgrade', (request, socket, head) => {
        const url = request.url || '';
        if (url === '/ws' || url.startsWith('/ws?')) {
          wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
          });
        }
      });
    },
    closeBundle() {
      if (signalingServer) {
        signalingServer.close();
      }
    },
  };
}
