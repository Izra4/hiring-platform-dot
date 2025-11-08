import { JobType } from 'src/common/enums/job.enum';
import z from 'zod';

export const JobsSchema = z.object({
  title: z.string().nonempty({ message: 'Title is required' }),
  job_type: z.enum(JobType),
  location: z.string().nonempty({ message: 'Location is required' }),
  salary_range: z.string().nonempty({ message: 'Salary range is required' }),
  description: z.string().optional(),
  is_open: z.boolean().default(true),
});

export type JobsDto = z.infer<typeof JobsSchema>;
