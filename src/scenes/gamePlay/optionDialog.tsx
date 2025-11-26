import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChoiceItem } from "@/lib/endpoints/story";
import { useSettingsStore } from "@/stores/settingsStore";

type OptionDialogProps = {
  isOpen: boolean;
  options: ChoiceItem[];
  onSelect: (option: string) => void;
  disabled?: boolean;
};

export const OptionDialog = (props: OptionDialogProps) => {
  const { textSize, chatBarTransparency } = useSettingsStore();

  const fontSize = `${0.8 + (textSize / 100) * 0.7}rem`;
  const opacity = 1 - chatBarTransparency / 100;

  return (
    <Dialog open={props.isOpen} onOpenChange={() => { }}>
      <DialogContent
        className="sm:max-w-2xl border border-[#9361B0] rounded-2xl px-16 py-14"
        style={{
          backgroundColor: `rgba(34, 16, 46, ${opacity})`,
        }}
        hideCloseButton
      >
        <DialogHeader className="hidden">
          <DialogTitle>Options Dialog</DialogTitle>
          <DialogDescription>select an option HERE</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center flex-col gap-6">
          {props.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => props.onSelect(option.next_segment_id)}
              className="max-w-3xl whitespace-break-spaces h-auto block leading-normal"
              style={{ fontSize }}
              disabled={props.disabled}
            >
              {option.text}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
