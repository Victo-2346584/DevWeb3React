export interface ICapture {
  _id: string;
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
interface CaptureProps {
  capture: ICapture;
  Suprimer: (id: string) => void;
}

export default function Capture({ capture, Suprimer }: CaptureProps) {
  function SuprimerCapture(): void {
    Suprimer(capture._id);
  }
  /*Tailwinds générer par gemini*/
  const baseButtonClasses =
    'px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-200';
  const modifyButtonClasses = `${baseButtonClasses} bg-blue-500 hover:bg-blue-600 text-white`;
  const deleteButtonClasses = `${baseButtonClasses} bg-red-500 hover:bg-red-600 text-white ml-2`;

  return (
    <div className="border border-gray-300 rounded-xl p-6 m-4 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
      <h3 className="text-3xl font-extrabold text-gray-900 mb-4 border-b pb-2">
        {capture.espece}
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <p className="text-gray-700 flex items-center">
          <span className="font-semibold">Taille:</span> {capture.tailleCm} cm
        </p>
        <p className="text-gray-700 flex items-center">
          <span className="font-semibold">Poids:</span> {capture.poidsKg} kg
        </p>
        <p className="text-gray-700 flex items-center">
          <span className="font-semibold">Date:</span> {capture.dateCapture}
        </p>
        <p className="text-gray-700 flex items-center">
          <span className="font-semibold">Remis à l'eau:</span>{' '}
          <span
            className={`font-bold ml-1 ${
              capture.remisALeau ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {capture.remisALeau ? 'Oui' : 'Non'}
          </span>
        </p>
      </div>

      <hr className="my-4 border-gray-200" />

      <div className="space-y-3 text-gray-800">
        <p>
          <span className="font-semibold text-gray-900">Technique:</span>{' '}
          {capture.technique}
        </p>
        <p>
          <span className="font-semibold text-gray-900">Lieu:</span>{' '}
          {capture.lieu}
        </p>
        <p>
          <span className="font-semibold text-gray-900">Conditions météo:</span>{' '}
          {capture.conditionsMeteo}
        </p>
        <p>
          <span className="font-semibold text-gray-900">
            Température de l'eau:
          </span>{' '}
          <span className="text-blue-600 font-medium">
            {capture.temperatureEau}°C
          </span>
        </p>
      </div>

      {capture.notes && capture.notes.length > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-200 bg-gray-50 p-3 rounded-lg">
          <p className="font-bold text-lg text-gray-900 mb-2">Notes:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            {capture.notes.map((note, index) => (
              <li key={index} className="text-gray-600 leading-relaxed">
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <a href={`/modifier/${capture._id}`} className={modifyButtonClasses}>
          Modifier cette capture
        </a>
        <button onClick={SuprimerCapture} className={deleteButtonClasses}>
          Supprimer cette capture
        </button>
      </div>
    </div>
  );
}
