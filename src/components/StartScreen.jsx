export default function StartScreen({ onStart }) {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-5xl font-bold">🌌 Interactive Story</h1>
      <p className="text-lg">Ciptakan cerita unikmu sendiri dengan kategori pilihanmu!</p>
      <button
        onClick={onStart}
        className="px-8 py-3 bg-white text-purple-700 font-semibold rounded-lg shadow-lg hover:bg-purple-100 transition"
      >
        Mulai
      </button>
    </div>
  );
}