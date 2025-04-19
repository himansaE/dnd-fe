import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { setAuthToken } from "../lib/http";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const updateToken = async () => {
      if (isSignedIn) {
        const token = await getToken();
        setAuthToken(token);
      } else {
        setAuthToken(null);
      }
    };

    updateToken();
    // Re-run when auth state changes
  }, [isSignedIn, getToken]);

  return <>{children}</>;
};
