import app from '../app';  // your Express app
import serverless from 'serverless-http';

export default serverless(app);