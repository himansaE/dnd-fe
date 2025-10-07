import Backdrop from "@/assets/images/game-backdrop.webp";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/stores/settingsStore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

type SettingsItemProps = {
  title: string;
  component: React.ReactNode;
};

const SettingsItem = ({ title, component }: SettingsItemProps) => {
  return (
    <>
      <h2 className="text-3xl text-white">{title}</h2>
      {component}
    </>
  );
};

export const SettingsPage = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const {
    isFullScreen,
    volume,
    textSpeed,
    textSize,
    chatBarTransparency,
    saveSettings,
  } = useSettingsStore();

  const [localSettings, setLocalSettings] = useState({
    isFullScreen,
    volume,
    textSpeed,
    textSize,
    chatBarTransparency,
  });

  useEffect(() => {
    setLocalSettings({
      isFullScreen,
      volume,
      textSpeed,
      textSize,
      chatBarTransparency,
    });
  }, [isFullScreen, volume, textSpeed, textSize, chatBarTransparency]);

  const handleSave = () => {
    setIsSaving(true);

    saveSettings(localSettings);

    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  const toggleFullScreen = (checked: boolean) => {
    setLocalSettings({ ...localSettings, isFullScreen: checked });

    if (checked) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  return (
    <div
      className="flex flex-col gap-5 min-h-screen bg-charcoal relative justify-center items-end w-full"
      style={{
        backgroundImage: `url(${Backdrop})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-7/9 px-20">
        <div className="bg-lavender/20 border-[#9569AE] border w-full rounded-lg grid grid-cols-2 px-10 py-6 gap-y-5 gap-x-10 items-center">
          <SettingsItem
            title="Full Screen"
            component={
              <Switch
                id="fullscreen-toggle"
                className="ml-auto"
                checked={localSettings.isFullScreen}
                onCheckedChange={toggleFullScreen}
              />
            }
          />
          <SettingsItem
            title="VOLUME"
            component={
              <Slider
                max={100}
                step={1}
                value={[localSettings.volume]}
                onValueChange={(vals) =>
                  setLocalSettings({ ...localSettings, volume: vals[0] })
                }
              />
            }
          />
          <SettingsItem
            title="TEXT SPEED"
            component={
              <Slider
                max={100}
                step={1}
                value={[localSettings.textSpeed]}
                onValueChange={(vals) =>
                  setLocalSettings({ ...localSettings, textSpeed: vals[0] })
                }
              />
            }
          />
          <SettingsItem
            title="TEXT SIZE"
            component={
              <Slider
                max={100}
                step={1}
                value={[localSettings.textSize]}
                onValueChange={(vals) =>
                  setLocalSettings({ ...localSettings, textSize: vals[0] })
                }
              />
            }
          />
          <SettingsItem
            title="Chat Bar Transparency"
            component={
              <Slider
                max={100}
                step={1}
                value={[localSettings.chatBarTransparency]}
                onValueChange={(vals) =>
                  setLocalSettings({
                    ...localSettings,
                    chatBarTransparency: vals[0],
                  })
                }
              />
            }
          />
        </div>
        <div className="flex gap-6 mt-8 justify-end">
          <Button
            variant="outline"
            className="px-10"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>

          <Button className="px-10" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};
