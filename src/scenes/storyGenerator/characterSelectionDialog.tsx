import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
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

  // Update selected characters when dialog opens or initialSelected changes
  useEffect(() => {
    if (open) {
      setSelected(initialSelected);
      setSearchQuery("");
    }
  }, [open, initialSelected]);

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
        if (selected.length < 30) {
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
    if (selected.length >= 10 && selected.length <= 30) {
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
      <DialogContent className="bg-black/90 text-white border-[#9569AE] border-2 sm:max-w-6xl rounded-2xl shadow-2xl backdrop-blur-md max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-3xl font-ruslan text-amber-400">
            Select Characters
          </DialogTitle>
          <p className="text-white/70 text-sm font-poppins">
            Choose between 10-30 characters for your adventure. Click to
            add/remove.
          </p>
        </DialogHeader>

        {/* Two Column Layout */}
        <div className="flex gap-4 flex-1 overflow-hidden">
          {/* LEFT COLUMN: Available Characters */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-white mb-2 font-poppins">
                Available Characters
              </h3>
              {/* Search Bar */}
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

            {/* Character List - Scrollable */}
            <div className="flex-1 overflow-y-auto scrollbar-custom pr-2">
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-black/40 rounded-full animate-spin">
                      <RefreshCcw size="24" color="white" />
                    </div>
                    <p className="text-white/80 text-sm font-poppins">
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
                  <p className="text-white/60 text-center font-poppins">
                    {searchQuery
                      ? "No characters match your search"
                      : "No characters available. Create some characters first!"}
                  </p>
                </div>
              )}

              {!isLoading && !isError && filteredCharacters.length > 0 && (
                <div className="grid grid-cols-1 gap-2">
                  {filteredCharacters.map((char) => {
                    const isCharSelected = isSelected(char);
                    const canSelect = !isCharSelected && selected.length < 30;

                    return (
                      <button
                        key={char.id}
                        onClick={() => toggleCharacter(char)}
                        disabled={!isCharSelected && !canSelect}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 text-left",
                          isCharSelected
                            ? "bg-gradient-to-r from-[#7a3b9e] to-[#5a2b72] border-[#a15ad0]"
                            : canSelect
                            ? "bg-black/30 border-[#9361B0]/50 hover:bg-black/50 hover:border-[#9361B0]"
                            : "bg-black/20 border-[#9361B0]/30 opacity-50 cursor-not-allowed"
                        )}
                      >
                        {char.imageUrl ? (
                          <div
                            className="w-12 h-12 rounded-lg bg-cover bg-center border border-[#9361B0] flex-shrink-0"
                            style={{ backgroundImage: `url(${char.imageUrl})` }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#683b82] to-[#3d204e] border border-[#9361B0] flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-white/80">
                              {char.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-white truncate font-poppins">
                            {char.name}
                          </h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-black/40 border border-[#9361B0]/50 text-white/80 text-xs font-poppins">
                              {char.type}
                            </span>
                            {char.ability && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-black/40 border border-[#9361B0]/50 text-white/80 text-xs font-poppins">
                                {char.ability}
                              </span>
                            )}
                          </div>
                        </div>
                        {isCharSelected && (
                          <div className="text-green-400 flex-shrink-0">
                            <svg
                              width="20"
                              height="20"
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
          </div>

          {/* RIGHT COLUMN: Selected Characters */}
          <div className="w-80 flex flex-col border-l border-[#9361B0]/30 pl-4 overflow-hidden">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white font-poppins">
                  Selected
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/90 font-poppins">
                    {selected.length}/30
                  </span>
                  {selected.length >= 10 && (
                    <span className="text-xs text-green-400 font-poppins">
                      ✓
                    </span>
                  )}
                </div>
              </div>
              {selected.length < 10 && (
                <p className="text-xs text-amber-400 font-poppins">
                  Select {10 - selected.length} more (min: 10)
                </p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-custom pr-2">
              {selected.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-white/50 text-sm text-center italic font-poppins">
                    No characters selected yet
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {selected.map((char) => (
                    <div
                      key={char.id}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#7a3b9e] to-[#5a2b72] rounded-lg border border-[#9361B0]"
                    >
                      {char.imageUrl ? (
                        <div
                          className="w-10 h-10 rounded-lg bg-cover bg-center border border-[#9361B0] flex-shrink-0"
                          style={{ backgroundImage: `url(${char.imageUrl})` }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#683b82] to-[#3d204e] border border-[#9361B0] flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-white/80">
                            {char.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-white truncate font-poppins">
                          {char.name}
                        </h4>
                        <p className="text-xs text-white/70 truncate font-poppins">
                          {char.type}
                        </p>
                      </div>
                      <button
                        onClick={() => removeSelected(char)}
                        className="hover:text-red-400 transition-colors flex-shrink-0"
                        aria-label={`Remove ${char.name}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#9361B0]/30 pt-4 mt-4 flex items-center justify-between gap-4">
          {/* Left: Type Breakdown */}
          <div className="flex items-center gap-3 text-sm font-poppins text-white/80 flex-1">
            {selected.length > 0 && (
              <>
                <span className="text-white/60">Party:</span>
                {(() => {
                  const typeCounts = selected.reduce((acc, char) => {
                    acc[char.type] = (acc[char.type] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);

                  return Object.entries(typeCounts).map(([type, count]) => (
                    <span
                      key={type}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/40 border border-[#9361B0]/50"
                    >
                      <span className="text-white/90">{type}</span>
                      <span className="text-amber-400 font-semibold">
                        {count}
                      </span>
                    </span>
                  ));
                })()}
              </>
            )}
          </div>

          {/* Right: Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="font-poppins text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selected.length < 10 || selected.length > 30}
              className={cn(
                "font-poppins text-base",
                selected.length >= 10 &&
                  selected.length <= 30 &&
                  "bg-gradient-to-r from-[#7a3b9e] to-[#5a2b72]"
              )}
            >
              {selected.length < 10
                ? `Select ${10 - selected.length} more`
                : selected.length > 30
                ? `Remove ${selected.length - 30} characters`
                : `Confirm ${selected.length} Characters`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
