import type { Server } from 'http';

export const shutdown = (status: string, server: Server) => {
  console.log(`${status} Closing HTTP server...`);
  server.close((err) => {
    if (err) {
      console.error("Error during server close:", err);
      process.exit(1);
    }
    console.log("HTTP server closed successfully.");
    process.exit(0);
  });
};

