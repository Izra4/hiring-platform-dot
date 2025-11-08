import { ApplicationStatus } from 'src/common/enums/application-status.enum';
import z from 'zod';

export const ApplicationSchema = z.object({
  status: z.enum(ApplicationStatus).default(ApplicationStatus.PENDING),
  job_id: z.string(),
  cv_id: z.string(),
});

export type ApplicationDto = z.infer<typeof ApplicationSchema>;
