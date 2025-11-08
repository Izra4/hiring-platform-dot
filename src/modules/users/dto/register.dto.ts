import { UserRole } from 'src/common/enums/role.enums';
import { z } from 'zod';

export const RegisterSchema = z
  .object({
    email: z.email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm Password must be at least 6 characters'),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    role: z.enum(UserRole).default(UserRole.APPLICANT),
    number: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .optional(),
    profilePictureUrl: z.url('Invalid URL').optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const userRegisterResponseSchema = z.object({
  id: z.uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  role: z.string(),
  number: z.string().nullable().optional(),
  profilePicture: z.string().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
