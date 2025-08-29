import { useState, useEffect } from "react";

export default function CategorySelection({ selectedCategories, setSelectedCategories, onComplete }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [selectedCategories]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedCategories }),
      });
      const data = await res.json();
      setCategories(data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (category) => {
    const newSelected = [...selectedCategories, category];
    setSelectedCategories(newSelected);

    if (newSelected.length >= 10) {
      try {
        const res = await fetch("http://localhost:5000/story", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selectedCategories: newSelected }),
        });
        const data = await res.json();
        onComplete(data.story);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl shadow-lg text-black mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Pilih kategori ceritamu ({selectedCategories.length}/10)
      </h2>

      {loading ? (
        <p>Loading kategori...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
              onClick={() => handleSelect(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {selectedCategories.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-1">Kategori terpilih:</h3>
          <p>{selectedCategories.join(" -> ")}</p>
        </div>
      )}
    </div>
  );
}