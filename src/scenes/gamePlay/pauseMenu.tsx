import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useState } from "react";
import { SettingsPage } from "../settings/settingsPage";

type PauseMenuProps = {
    onResume: () => void;
};

export const PauseMenu = ({ onResume }: PauseMenuProps) => {
    const navigate = useNavigate();
    const [showSettings, setShowSettings] = useState(false);

    if (showSettings) {
        return (
            <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center backdrop-blur-sm">
                <SettingsPage onBack={() => setShowSettings(false)} />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col gap-6 w-80">
                <Button onClick={onResume} className="w-full text-xl py-6 tracking-widest">
                    RESUME
                </Button>
                <Button onClick={() => setShowSettings(true)} className="w-full text-xl py-6 tracking-widest">
                    SETTINGS
                </Button>
                <Button onClick={() => navigate("/")} className="w-full text-xl py-6 tracking-widest">
                    MAIN MENU
                </Button>
                <Button onClick={() => navigate("/sign-in")} className="w-full text-xl py-6 tracking-widest">
                    LOG OUT
                </Button>
            </div>
        </div>
    );
};
