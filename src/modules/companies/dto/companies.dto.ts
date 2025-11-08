import z from 'zod';

export const CompaniesSchema = z.object({
  name: z.string().nonempty({ message: 'This field is required' }),
  description: z.string().optional(),
  industry: z.string().nonempty({ message: 'industry is required' }),
  location: z.string().nonempty({ message: 'location is required' }),
  website: z.string().optional(),
  founded_year: z.number().optional(),
  is_verified: z.boolean().default(false),
  is_premium: z.boolean().default(false),
  premium_expiry_date: z.date().optional(),
});

export type CompaniesDto = z.infer<typeof CompaniesSchema>;
