import { NarrativeContentItem } from "@/lib/endpoints/storyStart";

type ChatDialogWindowProps = {
  content: NarrativeContentItem;
};

export const ChatDialogWindow = ({ content }: ChatDialogWindowProps) => {
  const name = content.type === "narrator" ? "Narrator" : content.name;
  const message = content.type === "narrator" ? content.text : content.dialogue;
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100vw_-_40px)] bg-[#22102E]/70 border border-[#9361B0] rounded-xl text-white px-12 py-10 z-10">
      <div className="text-3xl bg-[#664D76] px-4 pt-2 absolute rounded-lg border border-[#9361B0] top-0  transform -translate-x-6 -translate-y-6">
        {name}
      </div>
      <p className="font-poppins font-semibold text-sm">{message}</p>
    </div>
  );
};
