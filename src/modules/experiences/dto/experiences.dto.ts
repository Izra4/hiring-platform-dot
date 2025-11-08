import z from 'zod';

export const ExperiencesSchema = z.object({
  title: z.string().nonempty({ message: 'This field is required' }),
  company_name: z.string().nonempty({ message: 'This field is required' }),
  description: z.string().optional(),
  start_date: z.iso.date().nonempty({ message: 'This field is required' }),
  end_date: z.iso.date().optional(),
  is_current: z.boolean().default(false),
});

export type ExperienceDto = z.infer<typeof ExperiencesSchema>;
