import { supabase } from "@/lib/browserClient";
import { createStory, getStoriesFromLocation } from "@/services/storyService";
import { StoryFormValues } from "@/zodSchemas/storySchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLocationStories(id: string | undefined) {
  return useQuery({
    queryKey: ["stories", id],
    queryFn: () => getStoriesFromLocation(supabase, id!),
    enabled: !!id,
  });
}

export function useCreateStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: StoryFormValues) => createStory(supabase, args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });
}
