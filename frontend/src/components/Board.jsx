import React, { useState, useEffect, useCallback, useRef } from "react";
import { Chessboard } from "react-chessboard";
import * as ChessJS from "chess.js";

const Chess = typeof ChessJS.Chess === "function" ? ChessJS.Chess : ChessJS.default;

export default function Board({ puzzle, onSolved }) {
  const [game, setGame] = useState(new Chess());
  const [moveIndex, setMoveIndex] = useState(0);
  const [evalScore, setEvalScore] = useState(0); // Centipawns
  const [feedback, setFeedback] = useState("Find the best move!");
  const engine = useRef(null);

  // --- Stockfish Setup (Origin Fix Included) ---
  useEffect(() => {
  const sfWorker = new Worker("/stockfish-17.1-8e4d048.js");
  engine.current = sfWorker;

  // 1. Start the engine
  sfWorker.postMessage("uci");

  sfWorker.onmessage = (e) => {
    const line = e.data;
    console.log("SF Engine:", line); // Watch this in F12 console!

    if (line === "uciok") {
      // 2. Set options ONLY after uciok
      sfWorker.postMessage("setoption name Threads value 4");
      sfWorker.postMessage("setoption name Hash value 128");
      sfWorker.postMessage("isready");
    }

    if (line === "readyok") {
      console.log("✅ Stockfish 17.1 is ready to analyze!");
      // 3. Now send the position
      sfWorker.postMessage(`position fen ${game.fen()}`);
      sfWorker.postMessage("go depth 12");
    }

    if (line.includes("score cp")) {
      const parts = line.split(" ");
      const scoreIndex = parts.indexOf("cp");
      const score = parseInt(parts[scoreIndex + 1]);
      setEvalScore(game.turn() === 'w' ? score : -score);
    }
  };

  return () => sfWorker.terminate();
}, [game.fen()]); // Re-run when the FEN changes
    // --- Evaluate on Game Change ---
  useEffect(() => {
    if (engine.current) {
      engine.current.postMessage(`position fen ${game.fen()}`);
      engine.current.postMessage("go depth 12");
    }
  }, [game]);

  // --- Puzzle Initialization ---
  useEffect(() => {
    if (puzzle) {
      const newGame = new Chess(puzzle.fen);
      newGame.move(puzzle.moves[0]);
      setGame(newGame);
      setMoveIndex(1);
      setFeedback("Your turn! Find the win.");
    }
  }, [puzzle]);

  // --- Eval Bar Calculation ---
  const getBarHeight = () => {
    // 0 score = 50%, +500 (5 pawns) = 100%, -500 = 0%
    const percentage = 50 + (evalScore / 20); 
    return Math.max(5, Math.min(95, percentage)); 
  };

  const makeMove = useCallback((move) => {
    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);
      if (!result) return null;

      const moveUCI = result.from + result.to + (result.promotion || "");
      const correctUCI = puzzle.moves[moveIndex];

      if (moveUCI === correctUCI) {
        setGame(gameCopy);
        setFeedback("✅ Correct move!");
        const nextIdx = moveIndex + 1;
        setMoveIndex(nextIdx);

        if (nextIdx < puzzle.moves.length) {
          setTimeout(() => {
            const gameAfterComp = new Chess(gameCopy.fen());
            gameAfterComp.move(puzzle.moves[nextIdx]);
            setGame(gameAfterComp);
            setMoveIndex(nextIdx + 1);
            setFeedback("Opponent responded. Keep going!");
          }, 600);
        } else {
          setFeedback("🏆 Puzzle Solved!");
          setTimeout(() => onSolved(), 500);
        }
      } else {
        // --- SMART FEEDBACK ---
        setFeedback(`❌ Bad move! Stockfish evaluates this as ${(evalScore/100).toFixed(1)}. Try a different idea.`);
        return null; // Piece snaps back
      }
      return result;
    } catch (e) { return null; }
  }, [game, moveIndex, puzzle, onSolved, evalScore]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px", justifyContent: "center" }}>
      
      {/* Evaluation Bar */}
      <div style={{
        width: "30px", height: "500px", background: "#403d39", 
        position: "relative", borderRadius: "4px", overflow: "hidden",
        border: "2px solid #222"
      }}>
        <div style={{
          position: "absolute", bottom: 0, width: "100%",
          height: `${getBarHeight()}%`, background: "#fff",
          transition: "height 0.5s ease-out"
        }} />
        <span style={{
          position: "absolute", top: "50%", width: "100%", textAlign: "center",
          fontSize: "10px", color: evalScore > 0 ? "#000" : "#fff", fontWeight: "bold", zIndex: 1
        }}>
          {(evalScore / 100).toFixed(1)}
        </span>
      </div>

      {/* Main Game Area */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ 
          marginBottom: "15px", padding: "10px 20px", borderRadius: "8px",
          background: feedback.includes("❌") ? "#ffdede" : "#e3f4e3",
          color: feedback.includes("❌") ? "#b00" : "#000",
          fontWeight: "bold", border: "1px solid"
        }}>
          {feedback}
        </div>

        <div style={{ width: "500px", maxWidth: "80vw" }}>
          <Chessboard 
            position={game.fen()} 
            onPieceDrop={(s, t) => makeMove({ from: s, to: t, promotion: "q" })} 
            boardOrientation={game.turn() === 'b' ? 'black' : 'white'}
          />
        </div>
      </div>
    </div>
  );
}