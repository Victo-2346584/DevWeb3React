import axios from 'axios';
import { createContext, useState, type ReactNode } from 'react';

// --- Constantes de Stockage ---
const TOKEN_STORAGE_KEY = 'authToken';

export type LoginContextType = {
  isLoggedIn: boolean;
  token: string;
  login: (courriel: string, motPasse: string) => Promise<boolean>;
  logout: () => void;
};

export const LoginContext = createContext<LoginContextType>({
  isLoggedIn: false,
  token: '',
  login: () => new Promise<boolean>(() => false),
  logout: () => {},
});

type LoginProviderProps = {
  children: ReactNode;
};

export default function LoginProvider(props: LoginProviderProps) {
  const initialToken = localStorage.getItem(TOKEN_STORAGE_KEY) || '';

  const [token, setToken] = useState<string>(initialToken);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!initialToken);

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);

    setToken('');
    setIsLoggedIn(false);
  }

  function login(courriel: string, motPasse: string): Promise<boolean> {
    return axios
      .post(
        'https://projetweb3-egb7ashnahhwh7fv.canadacentral-01.azurewebsites.net/api/generatetoken/',
        {
          utilisateur: {
            courriel: courriel,
            motPasse: motPasse,
          },
        },
      )
      .then((response) => {
        const { token: newToken } = response.data; // Renommer pour éviter le conflit

        if (newToken) {
          setIsLoggedIn(true);
          setToken(newToken);

          localStorage.setItem(TOKEN_STORAGE_KEY, newToken);

          return true;
        } else {
          logout();
          return false;
        }
      })
      .catch((error) => {
        console.error("Erreur d'authentification:", error);
        logout();
        return false;
      });
  }

  const values = { isLoggedIn, token, login, logout };

  return (
    <LoginContext.Provider value={values}>
      {props.children}
    </LoginContext.Provider>
  );
}
