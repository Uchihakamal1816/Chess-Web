import React, { useState } from 'react'; // Added React here
import axios from 'axios';
import Board from './components/Board';

function App() {
  const [puzzle, setPuzzle] = useState(null);
  const [rating, setRating] = useState(1500);
  const [loading, setLoading] = useState(false);

  const fetchPuzzle = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/puzzle?rating=${rating}`);
      setPuzzle(res.data);
    } catch (error) {
      console.error("Error fetching puzzle:", error);
      alert("Could not reach backend. Make sure Docker is running.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>♟️ Chess Puzzle Trainer</h1>
      <div style={{ marginBottom: "20px" }}>
        <label>Your Rating: </label>
        <input 
          type="number" 
          value={rating} 
          onChange={(e) => setRating(e.target.value)}
          style={{ padding: "5px", width: "80px", marginRight: "10px" }}
        />
        <button onClick={fetchPuzzle} disabled={loading} style={{ padding: "5px 15px" }}>
          {loading ? "Loading..." : "Get New Puzzle"}
        </button>
      </div>

      {puzzle && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p>Puzzle Rating: <strong>{puzzle.rating}</strong> | Themes: {puzzle.themes}</p>
          <Board puzzle={puzzle} onSolved={() => alert("Excellent! Puzzle Solved.")} />
        </div>
      )}
    </div>
  );
}

export default App;