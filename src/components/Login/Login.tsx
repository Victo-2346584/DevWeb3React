import { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../contexts/LoginContext';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';

function Login() {
  const intl = useIntl();
  const [courriel, setcourriel] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();
  const { login, isLoggedIn } = useContext(LoginContext);

  async function SeConnecter() {
    console.log([courriel, password]);
    await login(courriel, password)
      .then((reussi) => {
        if (reussi) setErreur('');
      })
      .catch(() =>
        setErreur(
          intl.formatMessage({
            id: 'Login.erreur',
            defaultMessage: 'Login incorrect',
          }),
        ),
      );
  }

  useEffect(() => {
    if (isLoggedIn) navigate('/');
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl p-8 shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-2">Bienvenue</h2>
        <p className="text-slate-300 mb-8">Connectez-vous pour continuer</p>

        <form
          className="space-y-6"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              SeConnecter();
            }
          }}
        >
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Adresse e-mail
            </label>
            <input
              type="email"
              onChange={(e) => setcourriel(e.target.value)}
              className="w-full rounded-lg bg-slate-800/80 border border-slate-600 px-4 py-3
                         text-white placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         transition"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-slate-800/80 border border-slate-600 px-4 py-3
                         text-white placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         transition"
            />
          </div>

          {erreur && (
            <p className="text-red-400 text-sm font-medium">{erreur}</p>
          )}

          <button
            type="button"
            onClick={SeConnecter}
            className="w-full rounded-lg bg-indigo-600 py-3 text-white font-semibold
                       hover:bg-indigo-500 active:bg-indigo-700
                       transition shadow-lg shadow-indigo-600/30"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
