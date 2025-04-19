import Backdrop from "@/assets/images/loading-backdrop.png";
import Logo from "@/assets/images/logo.webp";

export const LoadingScene = () => {
  return (
    <div
      className="flex flex-col gap-5 items-center justify-center min-h-screen bg-charcoal"
      style={{
        backgroundImage: `url(${Backdrop})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img src={Logo} alt="Logo" className="size-64 mt-6" />

      <p className="text-white text-2xl animate-pulse">Loading ... </p>
    </div>
  );
};
