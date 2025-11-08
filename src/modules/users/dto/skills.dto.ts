import z from 'zod';

export const AddSkillsSchema = z.object({
  skills: z.string().min(1, 'Skills must be filled'),
});

export type AddSkillsDto = z.infer<typeof AddSkillsSchema>;
