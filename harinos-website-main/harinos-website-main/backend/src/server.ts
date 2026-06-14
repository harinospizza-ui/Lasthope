import { config } from './config.js';
import { createApp } from './app.js';

const app = createApp();

app.listen(config.server.port, () => {
  console.log(`Harino's backend listening on port ${config.server.port}`);
});
