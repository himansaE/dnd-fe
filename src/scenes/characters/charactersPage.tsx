import Backdrop from "@/assets/images/game-backdrop.webp";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  AlertTriangle,
  UserPlus,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCharactersList,
  useCreateCharacter,
  useUpdateCharacter,
  useDeleteCharacter,
} from "@/lib/hooks/useCharacters";
import type { CharacterDto } from "@/lib/endpoints/characters";

type CharacterDraft = Omit<CharacterDto, "id" | "createdAt" | "updatedAt">;

const PAGE_SIZE = 6;
const TYPE_OPTIONS = ["Enemy", "Ally", "Random Encounter"];
const ABILITY_OPTIONS = [
  "Fireball",
  "Healing",
  "Stealth",
  "Shield Block",
  "Lightning Strike",
  "Poison",
  "Charm",
  "Summon",
  "Berserk",
  "Frost Nova",
  "Teleport",
  "Curse",
  "Blessing",
  "Illusion",
  "Trap Setting",
  "Disarm",
  "Dodge",
  "Piercing Shot",
  "Cleave",
  "Arcane Blast",
  "Divine Light",
  "Shadow Step",
  "Earthquake",
  "Wind Gust",
  "Magic Barrier",
  "Rage",
  "Life Drain",
  "Time Slow",
];

export default function CharactersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [editing, setEditing] = useState<CharacterDto | null>(null);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingDeleteName, setPendingDeleteName] = useState<string>("");
  const [form, setForm] = useState<CharacterDraft>({
    name: "",
    type: "",
    description: "",
    ability: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    data: listData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useCharactersList({
    page: currentPage,
    pageSize: PAGE_SIZE,
  });
  const items = listData?.items ?? [];
  const totalPages = listData?.totalPages ?? 1;

  const createMutation = useCreateCharacter();
  const updateMutation = useUpdateCharacter();
  const deleteMutation = useDeleteCharacter();
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const resetForm = () =>
    setForm({ name: "", type: "", description: "", ability: "" });

  const openCreate = () => {
    setEditing(null);
    resetForm();
    setFile(null);
    setPreview(null);
    setOpen(true);
  };

  const openEdit = (char: CharacterDto) => {
    setEditing(char);
    setForm({
      name: char.name,
      type: char.type,
      description: char.description,
      ability: char.ability,
    });
    setFile(null);
    setPreview(char.imageUrl ?? null);
    setOpen(true);
  };

  const onSubmit = async () => {
    if (!form.name.trim() || !form.type.trim()) return; // minimal validation
    if (editing) {
      await updateMutation.mutateAsync({
        id: editing.id,
        data: { ...form, image: file },
      });
    } else {
      await createMutation.mutateAsync({ ...form, image: file });
      setCurrentPage(1);
    }
    setOpen(false);
  };

  const onRequestDelete = (id: string, name: string) => {
    setPendingDeleteId(id);
    setPendingDeleteName(name);
    setConfirmOpen(true);
  };

  const onConfirmDelete = () => {
    if (pendingDeleteId) deleteMutation.mutate(pendingDeleteId);
    setConfirmOpen(false);
    setPendingDeleteId(null);
    setPendingDeleteName("");
  };

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div
      className="flex flex-col items-center min-h-screen bg-charcoal relative"
      style={{
        backgroundImage: `url(${Backdrop})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {(isLoading || isFetching || isMutating) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-xl">
          <div className="p-4 bg-black/40 rounded-full animate-spin">
            <RefreshCcw size="32" color="white" />
          </div>
        </div>
      )}
      <div className="w-full max-w-7/9 px-20 pt-16 font-poppins">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl text-white font-bold font-ruslan">
            Characters
          </h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openCreate}
                className="font-ruslan text-2xl text-white hover:text-white/80 transition-all duration-200 ease-in-out"
              >
                CREATE
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/80 text-white border-[#9569AE] border-2 sm:max-w-3xl rounded-2xl shadow-2xl backdrop-blur-md">
              <DialogHeader>
                <DialogTitle className="text-3xl font-ruslan">
                  {editing ? "Edit Character" : "Create Character"}
                </DialogTitle>
                <p className="text-white/70 text-sm font-poppins">
                  Craft your hero or foe with style. Upload an image and set
                  their traits.
                </p>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch font-poppins">
                <div className="flex flex-col gap-4 h-full">
                  <ImageField
                    label="Image"
                    preview={preview}
                    fullHeight
                    onFileSelected={(f) => {
                      setFile(f);
                      setPreview(
                        f ? URL.createObjectURL(f) : editing?.imageUrl ?? null
                      );
                    }}
                  />
                  <p className="text-xs text-white/60">
                    Tip: Use a portrait-style image with good contrast.
                    Recommended ratio ~3:4.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <Field
                    label="Name"
                    value={form.name}
                    onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                  />
                  <SelectLabelField label="Type">
                    <Select
                      value={form.type}
                      onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {TYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </SelectLabelField>
                  <SelectLabelField label="Ability">
                    <Select
                      value={form.ability ?? ""}
                      onValueChange={(v) =>
                        setForm((f) => ({ ...f, ability: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Ability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {ABILITY_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </SelectLabelField>
                  <Field
                    label="Description"
                    textarea
                    value={form.description ?? ""}
                    onChange={(v) => setForm((f) => ({ ...f, description: v }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={onSubmit}>
                  {editing ? "Save" : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isError && (
          <div className="mb-6 bg-black/60 border-[#9569AE] border rounded-lg px-6 py-4 text-white">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-amber-400" />
              <div>
                <p className="font-semibold">Failed to load characters</p>
                <p className="text-white/80 text-sm font-poppins">
                  {String((error as any)?.message ?? "Something went wrong.")}
                </p>
              </div>
              <div className="ml-auto">
                <Button variant="outline" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="w-full px-10 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {items.length === 0 && !isError ? (
            <div className="col-span-full flex items-center justify-center">
              <div className="bg-black/60 border-[#9569AE] border rounded-lg px-10 py-12 text-white text-center max-w-xl w-full backdrop-blur-sm">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-black/40 rounded-full border border-[#9361B0]">
                    <UserPlus className="text-white" />
                  </div>
                </div>
                <p className="text-lg font-poppins mb-4">No characters yet</p>
                <p className="text-white/80 text-sm font-poppins mb-6">
                  Create your first character to start building your adventures.
                </p>
                <Button onClick={openCreate} className="font-ruslan">
                  CREATE
                </Button>
              </div>
            </div>
          ) : (
            items.map((c) => (
              <CharacterCard
                key={c.id}
                c={c}
                onEdit={openEdit}
                onDelete={() => onRequestDelete(c.id, c.name)}
              />
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              onClick={goPrev}
              disabled={currentPage === 1}
            >
              <ChevronLeft /> Prev
            </Button>
            <span className="text-white">
              Page {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={goNext}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight />
            </Button>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-black/80 text-white border-[#9569AE]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-white/90 font-poppins">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{pendingDeleteName}</span>? This
            action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2 text-white">
      <span className="text-sm opacity-90 font-poppins">{label}</span>
      {textarea ? (
        <textarea
          className="bg-black/40 border border-[#9361B0] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#a15ad0] text-white placeholder:text-white/50 min-h-28"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
        />
      ) : (
        <input
          className="bg-black/40 border border-[#9361B0] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#a15ad0] text-white placeholder:text-white/50"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
        />
      )}
    </label>
  );
}

function SelectLabelField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2 text-white">
      <span className="text-sm opacity-90 font-poppins">{label}</span>
      {children}
    </label>
  );
}

function ImageField({
  label,
  preview,
  onFileSelected,
  fullHeight,
}: {
  label: string;
  preview: string | null;
  onFileSelected: (file: File | null) => void;
  fullHeight?: boolean;
}) {
  return (
    <div
      className={cn("flex flex-col gap-2 text-white", fullHeight && "h-full")}
    >
      <span className="text-sm opacity-90 font-poppins">{label}</span>
      {preview ? (
        <div
          className={cn(
            "w-full rounded-xl border border-[#9361B0] bg-cover bg-center",
            fullHeight ? "flex-1 min-h-[200px]" : "h-40"
          )}
          style={{ backgroundImage: `url(${preview})` }}
        />
      ) : (
        <div
          className={cn(
            "w-full rounded-xl border border-[#9361B0] bg-black/30 flex items-center justify-center text-white/60",
            fullHeight ? "flex-1 min-h-[200px]" : "h-40"
          )}
        >
          <span className="inline-flex items-center gap-2">
            <ImageIcon className="opacity-70" /> No image selected
          </span>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        className="bg-black/40 border border-[#9361B0] rounded-xl p-2 outline-none focus:ring-2 focus:ring-[#a15ad0] text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-[#9361B0] file:text-white hover:file:bg-[#a15ad0] cursor-pointer"
        onChange={(e) => onFileSelected(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

function CharacterCard({
  c,
  onEdit,
  onDelete,
}: {
  c: CharacterDto;
  onEdit: (c: CharacterDto) => void;
  onDelete: () => void;
}) {
  return (
    <div className="group relative">
      {/* Hover action buttons slightly above the card */}
      <div
        className={cn(
          "absolute -top-4 right-2 z-20 flex gap-2 opacity-0 transition-opacity pointer-events-none",
          "group-hover:opacity-100 group-hover:pointer-events-auto"
        )}
      >
        <Button
          size="icon"
          variant="outline"
          className="rounded-md border-2 border-[#9361B0] bg-black/60 text-white/90 hover:bg-black/70"
          onClick={() => onEdit(c)}
          aria-label="Edit"
        >
          <Pencil />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="rounded-md border-2 border-[#9361B0] bg-black/60 text-white/90 hover:bg-black/70"
          onClick={onDelete}
          aria-label="Delete"
        >
          <Trash2 />
        </Button>
      </div>

      {/* Card styled like story select cards */}
      <div
        className={cn(
          "h-[430px] rounded-2xl max-w-[320px] w-full p-4 flex flex-col shadow-lg transition-transform duration-300 ease-in-out",
          "hover:scale-105 hover:shadow-2xl text-white relative border-gradient-btn-end border-3 overflow-hidden bg-[#1a0f21]/70 bg-cover bg-center"
        )}
        style={
          c.imageUrl ? { backgroundImage: `url(${c.imageUrl})` } : undefined
        }
      >
        <div className="relative z-10 mt-auto">
          <h3 className="text-2xl font-bold">{c.name}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {c.type && (
              <span className="inline-flex items-center px-3 py-1 rounded-md border-2 border-[#9361B0] bg-black/60 text-white/90 text-xs font-medium">
                {c.type}
              </span>
            )}
            {c.ability && (
              <span className="inline-flex items-center px-3 py-1 rounded-md border-2 border-[#9361B0] bg-black/60 text-white/90 text-xs font-medium">
                {c.ability}
              </span>
            )}
          </div>
        </div>
        {/* Bottom gradient overlay to match story card vibe */}
        <div className="bg-gradient-to-t from-gradient-box-end to-transparent absolute bottom-0 h-72 w-full left-0" />
      </div>
    </div>
  );
}
