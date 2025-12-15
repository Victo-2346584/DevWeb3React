function PagePrincipale() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Bienvenue</h1>

      <div className="flex flex-col items-center gap-4">
        <a
          href="/liste"
          className="w-60 text-center px-6 py-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer text-gray-800 font-medium border border-gray-200 hover:text-blue-600"
        >
          Voir les captures
        </a>
        <a
          href="/ajouter"
          className="w-60 text-center px-6 py-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer text-gray-800 font-medium border border-gray-200 hover:text-blue-600"
        >
          Ajouter une capture
        </a>
      </div>
    </div>
  );
}

export default PagePrincipale;
