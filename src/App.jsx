// App.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

export default function App() {
  const [started, setStarted] = useState(false);
  const [session, setSession] = useState(0);
  const [choices, setChoices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState("");
  const [musicOn, setMusicOn] = useState(true);
  const [showHowTo, setShowHowTo] = useState(false);
  const [randomStory, setRandomStory] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bgMusicRef = useRef(null);
  const clickSoundRef = useRef(null);

  const sessionNames = [
    "Main Theme",
    "Background & Time",
    "Main Character",
    "Supporting Character",
    "Adventure Goal"
  ];

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/generate-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previousChoices: choices })
      });
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = (cat) => {
    if (clickSoundRef.current) clickSoundRef.current.play();
    const newChoices = [...choices, cat];
    setChoices(newChoices);

    if (session < 4) {
      setSession(session + 1);
      setCategories([]);
    } else {
      generateStory(newChoices);
    }
  };

  const generateStory = async (finalChoices) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choices: finalChoices })
      });
      const data = await res.json();
      setStory(data.story || "Story generation failed");
    } catch (err) {
      console.error(err);
      setStory("Story generation failed");
    } finally {
      setLoading(false);
    }
  };

  const generateRandomStory = async () => {
    setChoices([]);
    setSession(5);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choices: ["Random","Random","Random","Random","Random"] })
      });
      const data = await res.json();
      setStory(data.story || "Story generation failed");
    } catch (err) {
      console.error(err);
      setStory("Story generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    if (clickSoundRef.current) clickSoundRef.current.play();
    setStarted(true);
  };

  const toggleMusic = () => {
    setMusicOn(!musicOn);
    if (bgMusicRef.current) {
      if (musicOn) bgMusicRef.current.pause();
      else bgMusicRef.current.play().catch(() => {});
    }
  };

  const copyStory = () => {
    if (!story) return;
    navigator.clipboard.writeText(`${story.title}\n\n${story.content}`);
    Swal.fire({
      icon: "success",
      title: "Copied!",
      text: "Story copied to clipboard",
      timer: 1500,
      showConfirmButton: false
    });
  };

  useEffect(() => {
    if (started) {
      if (randomStory) {
        generateRandomStory();
      } else if (session < 5) {
        fetchCategories();
      }

      if (musicOn && bgMusicRef.current) {
        bgMusicRef.current.play().catch(() => {});
      }
    }
  }, [started, session, musicOn, randomStory]);

  // Start screen
  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 p-6">
        <h1 className="text-4xl sm:text-6xl font-bold text-yellow-900 mb-4 text-center">Interactive Story</h1>
        <p className="text-base sm:text-lg text-yellow-800 mb-6 text-center max-w-md">
          Build your own adventure by selecting themes, characters, and goals!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            className="flex-1 bg-yellow-500 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:bg-yellow-600 transition"
            onClick={handleStart}
          >
            Start
          </button>

          <button
            className={`flex-1 bg-yellow-300 px-6 py-4 rounded-xl text-lg font-semibold shadow-lg hover:bg-yellow-400 transition ${
              randomStory ? "ring-4 ring-yellow-500" : ""
            }`}
            onClick={() => {
              if (clickSoundRef.current) clickSoundRef.current.play();
              setRandomStory(!randomStory);
            }}
          >
            Random Story {randomStory ? "ON" : "OFF"}
          </button>
        </div>

        {/* ❓ How to Play */}
        <button
          className="fixed bottom-4 right-4 bg-yellow-400 w-14 h-14 rounded-full text-2xl shadow-lg hover:bg-yellow-500 transition flex items-center justify-center"
          onClick={() => {
            if (clickSoundRef.current) clickSoundRef.current.play();
            setShowHowTo(true);
          }}
          title="How to Play"
        >
          ❓
        </button>

        <AnimatePresence>
          {showHowTo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5 }}
                className="bg-yellow-100 p-6 rounded-2xl shadow-2xl max-w-md text-yellow-900"
              >
                <h2 className="text-2xl font-bold mb-4">How to Play</h2>
                <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
                  <li>Click "Start" to begin your interactive adventure.</li>
                  <li>Select categories step by step to build your story.</li>
                  <li>Use the "Random Story" toggle to generate a story instantly.</li>
                  <li>View your choices in the sidebar history.</li>
                  <li>After finishing, copy your story or share it!</li>
                </ul>
                <button
                  className="mt-4 bg-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
                  onClick={() => {
                    if (clickSoundRef.current) clickSoundRef.current.play();
                    setShowHowTo(false);
                  }}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audio */}
        <audio ref={bgMusicRef} src="/music/bg.mp3" loop />
        <audio ref={clickSoundRef} src="/music/click.wav" />
      </div>
    );
  }

  // Main screen
  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-yellow-100 p-4 shadow-lg flex flex-col`}
      >
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-yellow-900">Your Choices</h2>
        <ul className="space-y-2 flex-1 overflow-y-auto text-sm sm:text-base">
          {choices.map((c, i) => (
            <li key={i}>
              <span className="font-semibold">{sessionNames[i]}:</span> {c}
            </li>
          ))}
        </ul>
        <button
          className="mt-4 bg-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
          onClick={toggleMusic}
        >
          {musicOn ? "Pause Music" : "Play Music"}
        </button>
        <button
          className="mt-2 bg-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
          onClick={() => window.location.reload()}
        >
          Restart Game
        </button>
      </div>

      {/* Toggle Sidebar (mobile only) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-yellow-400 px-3 py-2 rounded-lg shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "Close" : "Choices"}
      </button>

      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-yellow-900 drop-shadow-lg text-center">
          Interactive Story
        </h1>

        {/* Progress Bar */}
        {!story && (
          <div className="w-full max-w-lg h-3 sm:h-4 bg-yellow-200 rounded-full mb-6">
            <div
              className="h-full bg-yellow-500 rounded-full transition-all"
              style={{ width: `${(session / 5) * 100}%` }}
            />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center mt-10">
            <div className="loader ease-linear rounded-full border-4 sm:border-8 border-t-4 sm:border-t-8 border-gray-200 h-12 w-12 sm:h-16 sm:w-16 mb-4"></div>
            <p className="text-base sm:text-lg font-semibold">Generating...</p>
          </div>
        )}

        {/* Categories */}
        {!loading && !story && categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
            <AnimatePresence>
              {categories.map((cat, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleChoice(cat)}
                  title={`Select ${cat}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-yellow-200 p-4 rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105 font-semibold text-yellow-900 text-center text-sm sm:text-base"
                >
                  {cat}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Story */}
        {story && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 w-full max-w-3xl p-4 sm:p-6 bg-white rounded-2xl shadow-2xl"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center text-yellow-900">{story.title}</h2>
            <p className="text-sm sm:text-base md:text-lg whitespace-pre-wrap">{story.content}</p>
            <button
              className="mt-4 bg-yellow-400 px-6 py-2 rounded-lg hover:bg-yellow-500 transition w-full sm:w-auto"
              onClick={copyStory}
            >
              Copy Story
            </button>
          </motion.div>
        )}

        <style>{`
          .loader {
            border-top-color: #f59e0b;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}</style>

        {/* Audio */}
        <audio ref={bgMusicRef} src="/music/bg.mp3" loop />
        <audio ref={clickSoundRef} src="/music/click.wav" />
      </div>
    </div>
  );
}