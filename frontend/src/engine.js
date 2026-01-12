// This helper handles the "Worker" communication with Stockfish
class Engine {
  constructor() {
    this.stockfish = new Worker("/stockfish-17.1-asm-341ff22.js"); // Uses the public worker file
    this.onMessage = (callback) => {
      this.stockfish.addEventListener("message", (e) => {
        callback(e.data);
      });
    };
  }

  evaluate(fen) {
    this.stockfish.postMessage(`position fen ${fen}`);
    this.stockfish.postMessage("go depth 12"); // Depth 12 is fast and accurate
  }

  stop() {
    this.stockfish.postMessage("stop");
  }
}

export default Engine;