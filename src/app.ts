
import express from 'express';
import cors from 'cors';
import { router } from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { User } from './app/modules/user/user.model';
import AppError from './app/utils/Apperror';
// import { globalErrorHandler } from './app/middlewares/globalErrorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application routes
app.use('/api', router);

// Global error handler
// app.use(globalErrorHandler);

// Not Found Route
app.get('/', (req, res) => {
  res.send('Server is up and connected to MongoDB');
});
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Not Found' });
});
app.use(globalErrorHandler);
if (!User) {
  throw new AppError(404, 'User not found');
}


export default app;
