import {
  useContext,
  useEffect,
  useState,
  useCallback,
  type ChangeEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { LoginContext } from '../../contexts/LoginContext';
import Capture, { type ICapture } from '../Capture';

const API_BASE_URL =
  'https://projetweb3-egb7ashnahhwh7fv.canadacentral-01.azurewebsites.net/api/captures';

type FilterType = 'none' | 'espece' | 'dateAvant' | 'dateApres';

export default function ListeCapture() {
  const [captures, setCapture] = useState<ICapture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { isLoggedIn, token } = useContext(LoginContext);
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState<FilterType>('none');
  const [filterValue, setFilterValue] = useState<string>('');
  async function SuprimerCapture(id: string) {
    await axios.delete(`${API_BASE_URL}/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await fetchCaptures;
  }
  const fetchCaptures = useCallback(async () => {
    if (!isLoggedIn || !token) {
      return;
    }

    setLoading(true);
    setError('');

    let apiUrl = `${API_BASE_URL}/all`;
    const isFilterActive = filterType !== 'none' && filterValue.trim() !== '';

    if (isFilterActive) {
      let paramValue = filterValue.trim();
      if (filterType === 'espece') {
        paramValue = encodeURIComponent(paramValue);
      }
      if (filterType == 'espece') {
        apiUrl = `${API_BASE_URL}/espece/${paramValue}`;
      } else if (filterType == 'dateAvant') {
        apiUrl = `${API_BASE_URL}/avant/${paramValue}`;
      } else if (filterType == 'dateApres') {
        apiUrl = `${API_BASE_URL}/apres/${paramValue}`;
      }
    }

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.captures || response.data;

      setCapture(data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        `Erreur lors du chargement ou du filtrage: ${axiosError.message}`,
      );
      setCapture([]);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, token, filterType, filterValue]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchCaptures();
    }
  }, [fetchCaptures, isLoggedIn, token]);
  /*
   * Code généré par : Google. (2024). gemini (version 3 août 2023) [Modèle massif de
   * langage]. https://gemini.google.com/app?hl=fr
   * */
  const handleFilterTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newFilterType = e.target.value as FilterType;
    setFilterType(newFilterType);
    setFilterValue('');
  };
  /*
   * Code généré par : Google. (2024). gemini (version 3 août 2023) [Modèle massif de
   * langage]. https://gemini.google.com/app?hl=fr
   * */
  const handleApplyFilter = () => {
    if (filterType === 'none') {
      fetchCaptures();
    }
  };
  /*
   * Code généré par : Google. (2024). gemini (version 3 août 2023) [Modèle massif de
   * langage]. https://gemini.google.com/app?hl=fr
   * */
  const renderFilterControl = () => {
    switch (filterType) {
      case 'espece':
        return (
          <input
            type="text"
            placeholder="Entrez le nom de l'espèce"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm w-full md:w-60"
            required
          />
        );
      case 'dateAvant':
      case 'dateApres':
        return (
          <input
            type="date"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm w-full md:w-60"
            required
          />
        );
      case 'none':
      default:
        return (
          <p className="text-gray-500 hidden md:block">
            Sélectionnez un filtre pour saisir la valeur.
          </p>
        );
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Liste des Captures
      </h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Filtrage</h2>
        <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
          <select
            value={filterType}
            onChange={handleFilterTypeChange}
            className="p-2 border border-gray-300 rounded-lg shadow-sm w-full md:w-56 bg-white font-medium"
          >
            <option value="none">Toutes les captures</option>
            <option value="espece">Par Espèce (Nom Exact)</option>
            <option value="dateAvant">
              Date de capture AVANT (YYYY-MM-DD)
            </option>
            <option value="dateApres">
              Date de capture APRÈS (YYYY-MM-DD)
            </option>
          </select>

          {renderFilterControl()}
        </div>
      </div>
      <a
        href="/ajouter"
        className="inline-block w-full md:w-60 text-center px-6 py-3 mb-6 bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer text-gray-800 font-medium border border-gray-200 hover:text-blue-600"
      >
        Ajouter une capture
      </a>

      {loading && <p className="text-gray-600">Veuillez patienter...</p>}
      {error && <p className="text-red-600 font-medium">Erreur : {error}</p>}

      {!loading && !error && captures.length === 0 && (
        <p className="text-gray-600">
          Aucune capture trouvée correspondant à vos critères de recherche.
        </p>
      )}

      {!loading && captures.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {captures.map((capture) => (
            <Capture
              key={capture._id}
              capture={capture}
              Suprimer={SuprimerCapture}
            />
          ))}
        </div>
      )}
    </div>
  );
}
