import { NarrativeContentItem } from "@/lib/endpoints/story";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settingsStore";
import { useEffect, useState } from "react";

type ChatDialogWindowProps = {
  content: NarrativeContentItem | boolean;
};

export const ChatDialogWindow = ({ content }: ChatDialogWindowProps) => {
  const { textSize, chatBarTransparency, textSpeed } = useSettingsStore();
  const [displayedText, setDisplayedText] = useState("");

  const name =
    typeof content === "boolean"
      ? "...."
      : content.type === "narrator"
        ? "Narrator"
        : content.name;
  const fullMessage =
    typeof content === "boolean"
      ? "........."
      : content.type === "narrator"
        ? content.text
        : content.dialogue;

  // Typewriter effect
  useEffect(() => {
    setDisplayedText("");

    if (!fullMessage) return;

    // Calculate delay based on textSpeed (0-100)
    // 100 speed -> 0ms delay (instant)
    // 0 speed -> 50ms delay
    const delay = Math.max(0, (100 - textSpeed) * 0.5);

    if (delay === 0) {
      setDisplayedText(fullMessage);
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < fullMessage.length) {
        setDisplayedText(fullMessage.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [fullMessage, textSpeed]);

  // Calculate styles
  // Text Size: 50 is default. Range 0.8rem to 1.5rem
  const fontSize = `${0.8 + (textSize / 100) * 0.7}rem`;

  // Transparency: 0-100.
  // Opacity = 1 - (transparency / 100)
  const opacity = 1 - chatBarTransparency / 100;

  return (
    <div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100vw_-_40px)] border border-[#9361B0] rounded-xl text-white px-12 py-10 z-10"
      style={{
        backgroundColor: `rgba(34, 16, 46, ${opacity})`,
      }}
    >
      <div className="text-3xl bg-[#664D76] px-4 pt-2 absolute rounded-lg border border-[#9361B0] top-0  transform -translate-x-6 -translate-y-6">
        <span className={cn(typeof content === "boolean" && "animate-pulse")}>
          {name}
        </span>
      </div>
      <p
        className={cn(
          "font-poppins font-semibold",
          typeof content === "boolean" && "animate-pulse"
        )}
        style={{ fontSize }}
      >
        {displayedText}
      </p>
    </div>
  );
};
