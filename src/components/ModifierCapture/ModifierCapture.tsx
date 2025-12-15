import { useNavigate, useParams } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContext';
import { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL =
  'https://projetweb3-egb7ashnahhwh7fv.canadacentral-01.azurewebsites.net/api/captures';

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

function ModifierCapture() {
  const { id } = useParams();

  const { isLoggedIn, token } = useContext(LoginContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ICaptureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  const ChercherCapture = useCallback(async () => {
    if (!token || !id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data: ICaptureData = response.data;

      setFormData(data);
    } catch (err) {
      setError(
        "Erreur lors du chargement de la capture. L'ID est-il correct ?",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    ChercherCapture();
  }, [ChercherCapture]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | number | boolean = value;

    if (type === 'number') {
      newValue = parseFloat(value) || 0;
    } else if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    }

    setFormData((prev) => ({
      ...(prev as ICaptureData),
      [name]: newValue,
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const notesArray = e.target.value
      .split('\n')
      .filter((note) => note.trim() !== '');
    setFormData((prev) => ({
      ...(prev as ICaptureData),
      notes: notesArray,
    }));
  };

  const SoumettreModification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !token) return;

    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const dataToSend = {
        ...formData,
        tailleCm: Number(formData.tailleCm),
        poidsKg: Number(formData.poidsKg),
        temperatureEau: Number(formData.temperatureEau),
        dateCapture: new Date(formData.dateCapture).toISOString(),
      };

      await axios.put(`${API_BASE_URL}/${id}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setMessage('Capture modifiée avec succès !');
    } catch (err) {
      setError('Échec de la modification. Veuillez vérifier vos données.');
      console.error('Erreur de soumission :', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn || loading) {
    return (
      <div className="p-4 text-center">
        <p>Chargement des données de la capture...</p>
      </div>
    );
  }

  if (error && !formData) {
    return <div className="p-4 text-red-600">Erreur : {error}</div>;
  }

  if (!formData) {
    return (
      <div className="p-4 text-gray-600">Aucune donnée de capture trouvée.</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">
        Modifier la Capture #{id}
      </h2>

      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={SoumettreModification} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="espece"
              className="block text-sm font-medium text-gray-700"
            >
              Espèce Capturée
            </label>
            <input
              type="text"
              name="espece"
              id="espece"
              value={formData.espece || ''}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="dateCapture"
              className="block text-sm font-medium text-gray-700"
            >
              Date et Heure de la Capture
            </label>
            <input
              type="datetime-local"
              name="dateCapture"
              id="dateCapture"
              value={formData.dateCapture || ''}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="tailleCm"
              className="block text-sm font-medium text-gray-700"
            >
              Taille (cm)
            </label>
            <input
              type="number"
              name="tailleCm"
              id="tailleCm"
              value={formData.tailleCm || ''}
              onChange={handleChange}
              min="0"
              step="0.1"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="poidsKg"
              className="block text-sm font-medium text-gray-700"
            >
              Poids (kg)
            </label>
            <input
              type="number"
              name="poidsKg"
              id="poidsKg"
              value={formData.poidsKg || ''}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="lieu"
              className="block text-sm font-medium text-gray-700"
            >
              Lieu de Capture
            </label>
            <input
              type="text"
              name="lieu"
              id="lieu"
              value={formData.lieu || ''}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="technique"
              className="block text-sm font-medium text-gray-700"
            >
              Technique Utilisée
            </label>
            <input
              type="text"
              name="technique"
              id="technique"
              value={formData.technique || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="conditionsMeteo"
              className="block text-sm font-medium text-gray-700"
            >
              Conditions Météo
            </label>
            <input
              type="text"
              name="conditionsMeteo"
              id="conditionsMeteo"
              value={formData.conditionsMeteo || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="temperatureEau"
              className="block text-sm font-medium text-gray-700"
            >
              Température de l'Eau (°C)
            </label>
            <input
              type="number"
              name="temperatureEau"
              id="temperatureEau"
              value={formData.temperatureEau || ''}
              onChange={handleChange}
              step="0.1"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div className="flex items-center">
          <input
            id="remisALeau"
            name="remisALeau"
            type="checkbox"
            checked={formData.remisALeau}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label
            htmlFor="remisALeau"
            className="ml-2 block text-sm font-medium text-gray-700"
          >
            Le poisson a été remis à l'eau
          </label>
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Notes supplémentaires (une ligne par note)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes ? formData.notes.join('\n') : ''}
            onChange={handleNotesChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            {isSubmitting
              ? 'Modification en cours...'
              : 'Enregistrer les Modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ModifierCapture;
