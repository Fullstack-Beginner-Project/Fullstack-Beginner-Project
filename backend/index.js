import 'dotenv/config';
import app from './src/app.js';
import prisma from './src/lib/prisma.js';



const server = app.listen(3000);

function shutdown(signal) {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}
