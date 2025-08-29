export default function StoryResult({ story, onRestart }) {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg text-black">
      <h2 className="text-2xl font-bold mb-4">Cerita Akhirmu</h2>
      <p className="mb-6 whitespace-pre-line">{story}</p>
      <button
        onClick={onRestart}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        Mulai Lagi
      </button>
    </div>
  );
}