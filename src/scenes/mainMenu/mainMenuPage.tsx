import Backdrop from "@/assets/images/game-backdrop.webp";
import TextLogo from "@/assets/images/dnd-d2.png";
import Logo from "@/assets/images/logo.webp";
import ElfWorrior from "@/assets/images/dnd-elf.webp";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export const MainMenuPage = () => {
  const navigate = useNavigate();

  const menuOptions = [
    {
      label: "New Game",
      action: () => navigate("/story/start", { replace: true }),
    },
    {
      label: "Load Game",
      action: () => console.log("Load Game"),
      disabled: true,
    },
    {
      label: "Settings",
      action: () => console.log("Settings"),
    },
    {
      label: "Log Out",
      action: () => console.log("Exit"),
    },
  ];

  return (
    <div
      className="flex flex-col gap-5 min-h-screen bg-charcoal relative"
      style={{
        backgroundImage: `url(${Backdrop})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img
        src={Logo}
        alt="Logo"
        className="size-96 mt-6 opacity-45 drop-shadow-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />

      <img
        src={ElfWorrior}
        alt="Elf Warrior"
        className="mt-6 h-7/8 absolute bottom-0 lft-1/10"
      />

      {/* menu */}
      <div className="w-md h-screen absolute bg-black/50 z-10 right-0 flex flex-col items-center">
        <img
          src={TextLogo}
          alt="Logo"
          className="w-72 h-28 object-contain mt-14"
        />

        <div className="flex flex-col gap-8 mt-10 h-full pt-6 -translate-x-28">
          {menuOptions.map((option, index) => (
            <Button
              key={index}
              className="w-72 pt-4 pb-3 h-auto hover:scale-105 active:scale-95 hover:brightness-110 active:brightness-90 transition-all duration-300 ease-in-out text-3xl rounded-xl
              "
              onClick={option.action}
              disabled={option.disabled}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
