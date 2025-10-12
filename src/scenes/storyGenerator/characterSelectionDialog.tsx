import { useState, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCharactersList } from "@/lib/hooks/useCharacters";
import type { CharacterDto } from "@/lib/endpoints/characters";
import { Search, X, RefreshCcw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CharacterSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCharacters: CharacterDto[];
  onConfirm: (characters: CharacterDto[]) => void;
}

export const CharacterSelectionDialog = ({
  open,
  onOpenChange,
  selectedCharacters: initialSelected,
  onConfirm,
}: CharacterSelectionDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<CharacterDto[]>(initialSelected);

  // Fetch all characters with pagination
  const { data, isLoading, isError, error, refetch } = useCharactersList({
    page: 1,
    pageSize: 100, // Fetch many characters for selection
  });

  const allCharacters = data?.items ?? [];

  // Filter characters based on search query
  const filteredCharacters = useMemo(() => {
    if (!searchQuery.trim()) return allCharacters;
    const query = searchQuery.toLowerCase();
    return allCharacters.filter(
      (char) =>
        char.name.toLowerCase().includes(query) ||
        char.type.toLowerCase().includes(query) ||
        char.ability?.toLowerCase().includes(query)
    );
  }, [allCharacters, searchQuery]);

  const isSelected = useCallback(
    (char: CharacterDto) => selected.some((s) => s.id === char.id),
    [selected]
  );

  const toggleCharacter = useCallback(
    (char: CharacterDto) => {
      if (isSelected(char)) {
        setSelected(selected.filter((s) => s.id !== char.id));
      } else {
        if (selected.length < 10) {
          setSelected([...selected, char]);
        }
      }
    },
    [selected, isSelected]
  );

  const removeSelected = useCallback(
    (char: CharacterDto) => {
      setSelected(selected.filter((s) => s.id !== char.id));
    },
    [selected]
  );

  const handleConfirm = useCallback(() => {
    if (selected.length === 10) {
      onConfirm(selected);
      onOpenChange(false);
    }
  }, [selected, onConfirm, onOpenChange]);

  const handleCancel = useCallback(() => {
    setSelected(initialSelected);
    setSearchQuery("");
    onOpenChange(false);
  }, [initialSelected, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 text-white border-[#9569AE] border-2 sm:max-w-4xl rounded-2xl shadow-2xl backdrop-blur-md max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-3xl font-ruslan text-amber-400">
            Select Characters
          </DialogTitle>
          <p className="text-white/70 text-sm font-poppins">
            Choose exactly 10 characters for your adventure. These characters
            will be used throughout the story.
          </p>
        </DialogHeader>

        {/* Selected Characters Chips */}
        <div className="py-3 border-b border-[#9361B0]/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-poppins text-white/90">
              Selected: {selected.length}/10
            </span>
            {selected.length === 10 && (
              <span className="text-xs text-green-400 font-poppins">
                ✓ Ready to start
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {selected.length === 0 ? (
              <span className="text-white/50 text-sm font-poppins italic">
                No characters selected yet
              </span>
            ) : (
              selected.map((char) => (
                <div
                  key={char.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#7a3b9e] to-[#5a2b72] rounded-lg border border-[#9361B0] text-white font-poppins text-sm"
                >
                  <span>{char.name}</span>
                  <button
                    onClick={() => removeSelected(char)}
                    className="hover:text-red-400 transition-colors"
                    aria-label={`Remove ${char.name}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="py-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, type, or ability..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-[#9361B0] rounded-lg outline-none focus:ring-2 focus:ring-[#a15ad0] text-white placeholder:text-white/50 font-poppins"
            />
          </div>
        </div>

        {/* Character List */}
        <div className="flex-1 overflow-y-auto scrollbar-custom pr-2 min-h-[300px]">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-black/40 rounded-full animate-spin">
                  <RefreshCcw size="24" color="white" />
                </div>
                <p className="text-white/80 font-poppins text-sm">
                  Loading characters...
                </p>
              </div>
            </div>
          )}

          {isError && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3 text-center">
                <AlertTriangle className="text-red-400" size={32} />
                <p className="text-white/90 font-poppins">
                  Failed to load characters
                </p>
                <p className="text-white/60 text-sm font-poppins">
                  {error?.message ?? "Something went wrong"}
                </p>
                <Button variant="outline" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            </div>
          )}

          {!isLoading && !isError && filteredCharacters.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <p className="text-white/60 font-poppins text-center">
                {searchQuery
                  ? "No characters match your search"
                  : "No characters available. Create some characters first!"}
              </p>
            </div>
          )}

          {!isLoading && !isError && filteredCharacters.length > 0 && (
            <div className="grid grid-cols-1 gap-3">
              {filteredCharacters.map((char) => {
                const isCharSelected = isSelected(char);
                const canSelect = !isCharSelected && selected.length < 10;

                return (
                  <button
                    key={char.id}
                    onClick={() => toggleCharacter(char)}
                    disabled={!isCharSelected && !canSelect}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-lg border-2 transition-all duration-200 text-left",
                      isCharSelected
                        ? "bg-gradient-to-r from-[#7a3b9e] to-[#5a2b72] border-[#a15ad0] shadow-md"
                        : canSelect
                        ? "bg-black/30 border-[#9361B0]/50 hover:bg-black/50 hover:border-[#9361B0] hover:shadow-md"
                        : "bg-black/20 border-[#9361B0]/30 opacity-50 cursor-not-allowed"
                    )}
                  >
                    {char.imageUrl && (
                      <div
                        className="w-16 h-16 rounded-lg bg-cover bg-center border border-[#9361B0]"
                        style={{ backgroundImage: `url(${char.imageUrl})` }}
                      />
                    )}
                    {!char.imageUrl && (
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#683b82] to-[#3d204e] border border-[#9361B0] flex items-center justify-center">
                        <span className="text-2xl font-bold text-white/80">
                          {char.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white font-poppins truncate">
                        {char.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-black/40 border border-[#9361B0]/50 text-white/80 text-xs font-medium">
                          {char.type}
                        </span>
                        {char.ability && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-black/40 border border-[#9361B0]/50 text-white/80 text-xs font-medium">
                            {char.ability}
                          </span>
                        )}
                      </div>
                    </div>
                    {isCharSelected && (
                      <div className="text-green-400">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-[#9361B0]/30 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selected.length !== 10}
            className={cn(
              selected.length === 10 &&
                "bg-gradient-to-r from-[#7a3b9e] to-[#5a2b72]"
            )}
          >
            {selected.length === 10
              ? "Confirm Selection"
              : `Select ${10 - selected.length} more`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
