/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect } from "react";

interface SettingsState {
  // Settings
  isFullScreen: boolean;
  volume: number;
  textSpeed: number;
  textSize: number;
  chatBarTransparency: number;

  // Listener callbacks
  listeners: {
    onVolumeChange: ((volume: number) => void)[];
    onTextSpeedChange: ((speed: number) => void)[];
    onTextSizeChange: ((size: number) => void)[];
    onFullScreenChange: ((isFullScreen: boolean) => void)[];
    onChatBarTransparencyChange: ((transparency: number) => void)[];
  };

  // Action functions
  saveSettings: (settings: Partial<SettingsState>) => void; // Save settings to store and storage
  resetSettings: () => void; // Reset to default values

  // Listener management
  addVolumeListener: (callback: (volume: number) => void) => () => void;
  addTextSpeedListener: (callback: (speed: number) => void) => () => void;
  addTextSizeListener: (callback: (size: number) => void) => () => void;
  addFullScreenListener: (
    callback: (isFullScreen: boolean) => void
  ) => () => void;
  addChatBarTransparencyListener: (
    callback: (transparency: number) => void
  ) => () => void;
}

// Default settings values
const DEFAULT_SETTINGS = {
  isFullScreen: false,
  volume: 75,
  textSpeed: 50,
  textSize: 50,
  chatBarTransparency: 30,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Initial settings
      ...DEFAULT_SETTINGS,

      // Initialize empty listener arrays
      listeners: {
        onVolumeChange: [],
        onTextSpeedChange: [],
        onTextSizeChange: [],
        onFullScreenChange: [],
        onChatBarTransparencyChange: [],
      },

      // Only update store when explicitly saving
      saveSettings: (newSettings) => {
        // Get current settings before update
        const prevSettings = get();

        // Filter out any action functions or listeners
        const {
          saveSettings,
          resetSettings,
          listeners,
          addVolumeListener,
          addTextSpeedListener,
          addTextSizeListener,
          addFullScreenListener,
          addChatBarTransparencyListener,
          ...currentSettings
        } = newSettings;

        // Update the store
        set(currentSettings);

        // Get settings after update
        const updatedSettings = { ...get(), ...currentSettings };

        // Call appropriate listeners for changed settings
        if (prevSettings.volume !== updatedSettings.volume) {
          get().listeners.onVolumeChange.forEach((cb) =>
            cb(updatedSettings.volume)
          );
        }

        if (prevSettings.textSpeed !== updatedSettings.textSpeed) {
          get().listeners.onTextSpeedChange.forEach((cb) =>
            cb(updatedSettings.textSpeed)
          );
        }

        if (prevSettings.textSize !== updatedSettings.textSize) {
          get().listeners.onTextSizeChange.forEach((cb) =>
            cb(updatedSettings.textSize)
          );
        }

        if (prevSettings.isFullScreen !== updatedSettings.isFullScreen) {
          get().listeners.onFullScreenChange.forEach((cb) =>
            cb(updatedSettings.isFullScreen)
          );
        }

        if (
          prevSettings.chatBarTransparency !==
          updatedSettings.chatBarTransparency
        ) {
          get().listeners.onChatBarTransparencyChange.forEach((cb) =>
            cb(updatedSettings.chatBarTransparency)
          );
        }

        console.log("Settings saved to storage");
      },

      resetSettings: () => {
        const prevSettings = get();
        set({ ...DEFAULT_SETTINGS });

        // Call listeners for all settings that changed
        const updatedSettings = DEFAULT_SETTINGS;

        if (prevSettings.volume !== updatedSettings.volume) {
          get().listeners.onVolumeChange.forEach((cb) =>
            cb(updatedSettings.volume)
          );
        }

        if (prevSettings.textSpeed !== updatedSettings.textSpeed) {
          get().listeners.onTextSpeedChange.forEach((cb) =>
            cb(updatedSettings.textSpeed)
          );
        }

        if (prevSettings.textSize !== updatedSettings.textSize) {
          get().listeners.onTextSizeChange.forEach((cb) =>
            cb(updatedSettings.textSize)
          );
        }

        if (prevSettings.isFullScreen !== updatedSettings.isFullScreen) {
          get().listeners.onFullScreenChange.forEach((cb) =>
            cb(updatedSettings.isFullScreen)
          );
        }

        if (
          prevSettings.chatBarTransparency !==
          updatedSettings.chatBarTransparency
        ) {
          get().listeners.onChatBarTransparencyChange.forEach((cb) =>
            cb(updatedSettings.chatBarTransparency)
          );
        }
      },

      // Listener management functions
      addVolumeListener: (callback) => {
        const { listeners } = get();
        set({
          listeners: {
            ...listeners,
            onVolumeChange: [...listeners.onVolumeChange, callback],
          },
        });

        // Return function to remove listener
        return () => {
          const { listeners } = get();
          set({
            listeners: {
              ...listeners,
              onVolumeChange: listeners.onVolumeChange.filter(
                (cb) => cb !== callback
              ),
            },
          });
        };
      },

      addTextSpeedListener: (callback) => {
        const { listeners } = get();
        set({
          listeners: {
            ...listeners,
            onTextSpeedChange: [...listeners.onTextSpeedChange, callback],
          },
        });

        return () => {
          const { listeners } = get();
          set({
            listeners: {
              ...listeners,
              onTextSpeedChange: listeners.onTextSpeedChange.filter(
                (cb) => cb !== callback
              ),
            },
          });
        };
      },

      addTextSizeListener: (callback) => {
        const { listeners } = get();
        set({
          listeners: {
            ...listeners,
            onTextSizeChange: [...listeners.onTextSizeChange, callback],
          },
        });

        return () => {
          const { listeners } = get();
          set({
            listeners: {
              ...listeners,
              onTextSizeChange: listeners.onTextSizeChange.filter(
                (cb) => cb !== callback
              ),
            },
          });
        };
      },

      addFullScreenListener: (callback) => {
        const { listeners } = get();
        set({
          listeners: {
            ...listeners,
            onFullScreenChange: [...listeners.onFullScreenChange, callback],
          },
        });

        return () => {
          const { listeners } = get();
          set({
            listeners: {
              ...listeners,
              onFullScreenChange: listeners.onFullScreenChange.filter(
                (cb) => cb !== callback
              ),
            },
          });
        };
      },

      addChatBarTransparencyListener: (callback) => {
        const { listeners } = get();
        set({
          listeners: {
            ...listeners,
            onChatBarTransparencyChange: [
              ...listeners.onChatBarTransparencyChange,
              callback,
            ],
          },
        });

        return () => {
          const { listeners } = get();
          set({
            listeners: {
              ...listeners,
              onChatBarTransparencyChange:
                listeners.onChatBarTransparencyChange.filter(
                  (cb) => cb !== callback
                ),
            },
          });
        };
      },
    }),
    {
      name: "dnd-settings-storage", // unique name for localStorage
      partialize: (state) => {
        // Don't persist listeners to storage
        const {
          listeners,
          addVolumeListener,
          addTextSpeedListener,
          addTextSizeListener,
          addFullScreenListener,
          addChatBarTransparencyListener,
          ...rest
        } = state;
        return rest;
      },
    }
  )
);

// React hook wrappers for more convenient use in components
export const useVolumeChange = (callback: (volume: number) => void) => {
  const addVolumeListener = useSettingsStore(
    (state) => state.addVolumeListener
  );

  useEffect(() => {
    const removeListener = addVolumeListener(callback);
    return () => removeListener();
  }, [addVolumeListener, callback]);
};

export const useTextSpeedChange = (callback: (speed: number) => void) => {
  const addTextSpeedListener = useSettingsStore(
    (state) => state.addTextSpeedListener
  );

  useEffect(() => {
    const removeListener = addTextSpeedListener(callback);
    return () => removeListener();
  }, [addTextSpeedListener, callback]);
};

export const useTextSizeChange = (callback: (size: number) => void) => {
  const addTextSizeListener = useSettingsStore(
    (state) => state.addTextSizeListener
  );

  useEffect(() => {
    const removeListener = addTextSizeListener(callback);
    return () => removeListener();
  }, [addTextSizeListener, callback]);
};

export const useFullScreenChange = (
  callback: (isFullScreen: boolean) => void
) => {
  const addFullScreenListener = useSettingsStore(
    (state) => state.addFullScreenListener
  );

  useEffect(() => {
    const removeListener = addFullScreenListener(callback);
    return () => removeListener();
  }, [addFullScreenListener, callback]);
};

export const useChatBarTransparencyChange = (
  callback: (transparency: number) => void
) => {
  const addChatBarTransparencyListener = useSettingsStore(
    (state) => state.addChatBarTransparencyListener
  );

  useEffect(() => {
    const removeListener = addChatBarTransparencyListener(callback);
    return () => removeListener();
  }, [addChatBarTransparencyListener, callback]);
};
