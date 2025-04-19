import Request from "@/lib/http";

export interface storyGeneratorRes {
  title: string;
  card_background: string;
  hidden_description: string;
  plot: string;
}

export const storyGenerator = async () => {
  const res = await Request<storyGeneratorRes[]>({
    method: "get",
    url: "/api/story-generator/generate",
  });

  return res.data;
};
