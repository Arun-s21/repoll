import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // Attach Socket.IO to the server
  const io = new Server(server);

  // This is the "switchboard"
  io.on('connection', (socket) => {                     //this is our event listener
    console.log('A user connected:', socket.id);

    // When a user disconnects
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });

  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});