import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const port = Number(process.env.PORT) || 5000;
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be set to a random string of at least 32 characters.');
  process.exit(1);
}
try {
  await connectDB();
  app.listen(port, () => console.log(`Guhasphere API listening on http://localhost:${port}`));
} catch (error) {
  console.error(`Unable to start API: ${error.message}`);
  process.exit(1);
}
