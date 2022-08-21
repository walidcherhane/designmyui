import { createContext, useContext} from "react";
import { inferQueryOutput, trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

interface AuthInterface {
  user: inferQueryOutput<"users.me">;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext({} as AuthInterface);

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  return authContext;
};

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const { data: user, isLoading } = trpc.useQuery(["users.me"]);
  const session = useSession();
  return (
    <AuthContext.Provider
      value={{
        isLoading,
        user: user && session.status === "authenticated" ? user : null,
        isAuthenticated: session.status === "authenticated" && user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
