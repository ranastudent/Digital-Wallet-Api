import { z } from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    name: z.string().min(4, 'Name is required'),
    email: z.string().email({ message: 'Invalid email address' }),
    phoneNumber: z
      .string()
      .min(11, { message: 'Phone number must be at least 11 digits' })
      .max(15, { message: 'Phone number must be at most 15 digits' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    role: z.enum(['user', 'admin', 'agent']).optional(),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    phoneNumber: z
      .string()
      .min(11, { message: 'Phone number must be at least 11 digits' })
      .max(15, { message: 'Phone number must be at most 15 digits' }),
    password: z.string().min(6, { message: 'Password is required' }),
  }),
});
