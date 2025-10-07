import { NarrativeContentItem } from "@/lib/endpoints/story";
import { cn } from "@/lib/utils";

type ChatDialogWindowProps = {
  content: NarrativeContentItem | boolean;
};

export const ChatDialogWindow = ({ content }: ChatDialogWindowProps) => {
  const name =
    typeof content === "boolean"
      ? "...."
      : content.type === "narrator"
      ? "Narrator"
      : content.name;
  const message =
    typeof content === "boolean"
      ? "........."
      : content.type === "narrator"
      ? content.text
      : content.dialogue;
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100vw_-_40px)] bg-[#22102E]/70 border border-[#9361B0] rounded-xl text-white px-12 py-10 z-10">
      <div className="text-3xl bg-[#664D76] px-4 pt-2 absolute rounded-lg border border-[#9361B0] top-0  transform -translate-x-6 -translate-y-6">
        <span className={cn(typeof content === "boolean" && "animate-pulse")}>
          {name}
        </span>
      </div>
      <p
        className={cn(
          "font-poppins font-semibold text-sm",
          typeof content === "boolean" && "animate-pulse"
        )}
      >
        {message}
      </p>
    </div>
  );
};
