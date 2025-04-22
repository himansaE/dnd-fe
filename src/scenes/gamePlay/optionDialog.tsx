import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChoiceItem } from "@/lib/endpoints/storyStart";

type OptionDialogProps = {
  isOpen: boolean;
  options: ChoiceItem[];
  onSelect: (option: string) => void;
};

export const OptionDialog = (props: OptionDialogProps) => {
  return (
    <Dialog open={props.isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-2xl bg-[#22102E]/70 border border-[#9361B0] rounded-2xl px-16 py-14"
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
            >
              {option.text}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
