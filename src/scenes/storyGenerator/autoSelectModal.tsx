import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, Zap, Shield, AlertTriangle } from "lucide-react";
import type { CharacterDto } from "@/lib/endpoints/characters";

interface CharacterAnalysis {
  characterId: string;
  characterName: string;
  tacticalScore: number;
  narrativeScore: number;
  reasoning: string;
}

interface AutoSelectModalProps {
  open: boolean;
  isLoading: boolean;
  characters: CharacterDto[] | null;
  analysis: CharacterAnalysis[] | null;
  strategy: string | null;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AutoSelectModal = ({
  open,
  isLoading,
  characters,
  analysis,
  // strategy, // Commented out - not currently displayed in UI
  error,
  onConfirm,
  onCancel,
}: AutoSelectModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="bg-black/95 text-white border-[#9569AE] border-2 sm:max-w-5xl rounded-2xl shadow-2xl backdrop-blur-md max-h-[90vh] flex flex-col">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            {/* Animated AI thinking visualization */}
            <div className="relative mb-8">
              <Brain className="w-24 h-24 text-purple-400 animate-pulse" />
              <Sparkles
                className="absolute -top-2 -right-2 w-8 h-8 text-amber-400 animate-spin"
                style={{ animationDuration: "3s" }}
              />
              <Sparkles
                className="absolute -bottom-2 -left-2 w-6 h-6 text-blue-400 animate-spin"
                style={{
                  animationDuration: "2s",
                  animationDirection: "reverse",
                }}
              />
            </div>

            <h3 className="text-2xl font-bold font-ruslan text-amber-400 mb-3">
              AI Analyzing Characters...
            </h3>
            <p className="text-white/70 text-center font-poppins max-w-md">
              Evaluating tactical abilities, narrative fit, and party synergy to
              select the perfect characters for your adventure.
            </p>

            <div className="mt-8 flex flex-col gap-2 text-sm text-white/60 font-poppins">
              <div className="flex items-center gap-2 animate-pulse">
                <span>Analyzing tactical requirements...</span>
              </div>
              <div
                className="flex items-center gap-2 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              >
                <span>Matching character abilities to story...</span>
              </div>
              <div
                className="flex items-center gap-2 animate-pulse"
                style={{ animationDelay: "1s" }}
              >
                <span>Optimizing party composition...</span>
              </div>
            </div>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-12 px-8">
            <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
            <h3 className="text-xl font-bold font-ruslan text-white mb-2">
              Auto-Selection Failed
            </h3>
            <p className="text-white/70 text-center font-poppins mb-6">
              {error}
            </p>
            <Button variant="outline" onClick={onCancel}>
              Close
            </Button>
          </div>
        )}

        {!isLoading && !error && characters && analysis && (
          <div className="flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[#9361B0]/30">
              <div className="flex items-center gap-3 mb-3">
                <Brain className="w-8 h-8 text-purple-400" />
                <h2 className="text-2xl font-bold font-ruslan text-amber-400">
                  AI Selected {characters.length} Characters
                </h2>
              </div>
              {/* {strategy && (
                <div className="bg-black/40 border border-[#9361B0]/50 rounded-lg p-4 mt-3">
                  <h4 className="text-sm font-semibold text-purple-300 mb-2 font-poppins">
                    Party Strategy:
                  </h4>
                  <p className="text-sm text-white/80 font-poppins leading-relaxed">
                    {strategy}
                  </p>
                </div>
              )} */}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-custom p-6">
              <div className="grid grid-cols-1 gap-4">
                {characters.map((char) => {
                  const charAnalysis = analysis.find(
                    (a) => a.characterId === char.id
                  );
                  if (!charAnalysis) return null;

                  return (
                    <div
                      key={char.id}
                      className="flex items-start gap-4 p-4 bg-gradient-to-r from-black/60 to-black/40 border-2 border-[#9361B0]/50 rounded-xl hover:border-[#a15ad0] transition-all duration-200"
                    >
                      {/* Character Image */}
                      {char.imageUrl ? (
                        <div
                          className="w-20 h-20 rounded-lg bg-cover bg-center border-2 border-[#9361B0] flex-shrink-0"
                          style={{
                            backgroundImage: `url(${char.imageUrl})`,
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#683b82] to-[#3d204e] border-2 border-[#9361B0] flex items-center justify-center flex-shrink-0">
                          <span className="text-3xl font-bold text-white/80">
                            {char.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}

                      {/* Character Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h4 className="font-semibold text-lg text-white font-poppins">
                              {char.name}
                            </h4>
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
                          <Zap className="w-5 h-5 text-amber-400 flex-shrink-0" />
                        </div>

                        {/* Scores */}
                        <div className="flex gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-white/70 font-poppins">
                              Tactical:
                            </span>
                            <span className="text-sm font-semibold text-blue-300 font-poppins">
                              {charAnalysis.tacticalScore}/10
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-xs text-white/70 font-poppins">
                              Narrative:
                            </span>
                            <span className="text-sm font-semibold text-purple-300 font-poppins">
                              {charAnalysis.narrativeScore}/10
                            </span>
                          </div>
                        </div>

                        {/* Reasoning */}
                        <p className="text-xs text-white/80 font-poppins leading-relaxed bg-black/30 p-3 rounded-lg border border-[#9361B0]/30">
                          {charAnalysis.reasoning}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <DialogFooter className="border-t border-[#9361B0]/30 p-6">
              <Button
                variant="outline"
                onClick={onCancel}
                className="font-poppins text-base"
              >
                Choose Different Characters
              </Button>
              <Button
                onClick={onConfirm}
                className="bg-gradient-to-r from-[#7a3b9e] to-[#5a2b72] hover:from-[#8e4bb8] hover:to-[#6a3b82] font-poppins text-base"
              >
                Use These {characters.length} Characters
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
