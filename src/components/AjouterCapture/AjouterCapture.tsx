import {
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContext';
import axios from 'axios';

const CAPTURE_API_URL =
  'https://projetweb3-egb7ashnahhwh7fv.canadacentral-01.azurewebsites.net/api/captures/add';
const ESPECE_API_URL =
  'https://projetweb3-egb7ashnahhwh7fv.canadacentral-01.azurewebsites.net/api/espece-poisson/all';

interface ICaptureData {
  espece: string;
  tailleCm: number;
  poidsKg: number;
  dateCapture: string;
  remisALeau: boolean;
  technique: string;
  lieu: string;
  conditionsMeteo: string;
  temperatureEau: number;
  notes: string[];
}

const initialCaptureState: ICaptureData = {
  espece: '',
  tailleCm: 0,
  poidsKg: 0,
  dateCapture: new Date().toISOString().substring(0, 16),
  remisALeau: true,
  technique: '',
  lieu: '',
  conditionsMeteo: '',
  temperatureEau: 0,
  notes: [],
};

function AjouterCapture() {
  const [captureData, setCaptureData] =
    useState<ICaptureData>(initialCaptureState);
  const [notesInput, setNotesInput] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [especeOptions, setEspeceOptions] = useState<string[]>([]);
  const [loadingSpecies, setLoadingSpecies] = useState(true);
  const [speciesError, setSpeciesError] = useState('');
  const { isLoggedIn, token } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('Non connecté, redirection vers /login');
      navigate('/login');
      return;
    }
    setLoadingSpecies(true);

    axios
      .get(ESPECE_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        if (data) {
          const nomsFrancais = data.especes.map(
            (espece: { Nom_francais: string }) => espece.Nom_francais,
          );
          setEspeceOptions(nomsFrancais.sort());
        } else {
          setSpeciesError(
            "Structure des données d'espèces inattendue (clé 'especes' manquante ou invalide).",
          );
        }
      })
      .catch((error) => {
        setSpeciesError(`Échec du chargement des espèces: ${error.message}`);
      })
      .finally(() => {
        setLoadingSpecies(false);
      });
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setCaptureData((prevData) => ({
      ...prevData,
      [name]: type === 'number' || type === 'range' ? parseFloat(value) : value,
    }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCaptureData((prevData) => ({
      ...prevData,
      remisALeau: e.target.checked,
    }));
  };

  const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNotesInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    const preparedCaptureData = {
      ...captureData,
      tailleCm: Number(captureData.tailleCm),
      poidsKg: Number(captureData.poidsKg),
      temperatureEau: Number(captureData.temperatureEau),
      dateCapture: new Date(captureData.dateCapture).toISOString(),
      notes: notesInput
        .split(',')
        .map((note) => note.trim())
        .filter((note) => note.length > 0),
    };

    const requestBody = {
      capture: preparedCaptureData,
    };

    fetch(CAPTURE_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || response.statusText);
          });
        }
        return response.status;
      })
      .then((result) => {
        if (result == 201) {
          setMessage(`Capture ajoutée avec succès!`);
        }
        setCaptureData(initialCaptureState);
        setNotesInput('');
      })
      .catch((error) => {
        setMessage(`Erreur lors de l'ajout: ${error.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const isFormDisabled = isLoading || loadingSpecies || !captureData.espece;
  const messageClasses = message.includes('succès')
    ? 'bg-green-100 border-green-400 text-green-700'
    : 'bg-red-100 border-red-400 text-red-700';

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-white shadow-xl rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center pb-2">
        Ajouter une Nouvelle Capture
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="espece"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Espèce :
          </label>
          {loadingSpecies && (
            <div className="text-blue-500 p-3 border border-gray-300 rounded-lg text-center">
              Chargement des espèces...
            </div>
          )}
          {speciesError && !loadingSpecies && (
            <div className="bg-red-100 border-red-400 text-red-700 p-3 border rounded-lg text-sm">
              Erreur: {speciesError}
            </div>
          )}
          {!loadingSpecies && !speciesError && (
            <select
              id="espece"
              name="espece"
              value={captureData.espece}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              disabled={loadingSpecies}
            >
              <option value="" disabled>
                Sélectionner l'espèce...
              </option>
              {especeOptions.map((espece) => (
                <option key={espece} value={espece}>
                  {espece}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label
            htmlFor="dateCapture"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date et Heure de Capture :
          </label>
          <input
            type="datetime-local"
            id="dateCapture"
            name="dateCapture"
            value={captureData.dateCapture.substring(0, 16)}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="tailleCm"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Taille (cm) :
            </label>
            <input
              type="number"
              id="tailleCm"
              name="tailleCm"
              value={captureData.tailleCm}
              onChange={handleChange}
              min="0"
              step="0.1"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>
          <div>
            <label
              htmlFor="poidsKg"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Poids (kg) :
            </label>
            <input
              type="number"
              id="poidsKg"
              name="poidsKg"
              value={captureData.poidsKg}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="lieu"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lieu de Capture :
            </label>
            <input
              type="text"
              id="lieu"
              name="lieu"
              value={captureData.lieu}
              onChange={handleChange}
              required
              placeholder="Ex: Rivière Montmorency"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>
          <div>
            <label
              htmlFor="technique"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Technique :
            </label>
            <input
              type="text"
              id="technique"
              name="technique"
              value={captureData.technique}
              onChange={handleChange}
              required
              placeholder="Ex: Mouche sèche"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="conditionsMeteo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Conditions Météo :
            </label>
            <select
              id="conditionsMeteo"
              name="conditionsMeteo"
              value={captureData.conditionsMeteo}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            >
              <option value="">Sélectionner...</option>
              <option value="Ensoleillé">Ensoleillé</option>
              <option value="Partiellement nuageux">
                Partiellement nuageux
              </option>
              <option value="Nuageux">Nuageux</option>
              <option value="Pluie légère">Pluie légère</option>
              <option value="Pluie forte">Pluie forte</option>
              <option value="Orage">Orage</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="temperatureEau"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Température Eau (°C) :
            </label>
            <input
              type="number"
              id="temperatureEau"
              name="temperatureEau"
              value={captureData.temperatureEau}
              onChange={handleChange}
              min="0"
              step="0.5"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Notes (séparer par des virgules) :
          </label>
          <textarea
            id="notes"
            name="notes"
            value={notesInput}
            onChange={handleNotesChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 resize-y"
            placeholder="Ex: Très belle couleur, combattant féroce"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="remisALeau"
            name="remisALeau"
            checked={captureData.remisALeau}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="remisALeau"
            className="ml-2 block text-sm font-medium text-gray-700"
          >
            Remis à l'eau
          </label>
        </div>
        <button
          type="submit"
          disabled={isFormDisabled}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-300 ease-in-out ${
            isFormDisabled
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300'
          }`}
        >
          {isLoading ? 'Envoi en cours...' : 'Soumettre la Capture'}
        </button>
      </form>
      {message && (
        <div
          className={`mt-6 p-4 border rounded-md text-sm font-medium text-center ${messageClasses}`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default AjouterCapture;
