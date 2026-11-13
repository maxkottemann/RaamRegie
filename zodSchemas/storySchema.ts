import z from "zod";

export const storySchema = z.object({
  location_id: z.string().min(1, "Kies een locatie"),
  name: z.string().trim().min(1, "Naam is verplicht").max(120, "Maximaal 120 tekens"),
});

export type StoryFormInput = z.input<typeof storySchema>;
export type StoryFormValues = z.output<typeof storySchema>;
