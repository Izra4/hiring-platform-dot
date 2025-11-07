import z from 'zod';

export const cvApplicantSchema = z.object({
  id: z.uuid(),
  fileUrl: z.string().nullable(),
  createdAt: z.date(),
});
