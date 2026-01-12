import duckdb
import os

class PuzzleDB:
    def __init__(self):
        # Path inside the Docker container
        self.db_path = "data/puzzles.db"
        self.csv_path = "data/puzzles.csv"
        
        # Connect to DuckDB (creates file if not exists)
        self.con = duckdb.connect(self.db_path)
        self._initialize_db()

    def _initialize_db(self):
        # Check if table exists
        tables = self.con.execute("SHOW TABLES").fetchall()
        if not any('puzzles' in table for table in tables):
            print("Indexing 4GB CSV. This happens only once...")
            # read_csv_auto is extremely memory efficient
            self.con.execute(f"CREATE TABLE puzzles AS SELECT * FROM read_csv_auto('{self.csv_path}')")
            self.con.execute("CREATE INDEX idx_rating ON puzzles (Rating)")
            print("Database Indexed Successfully.")

    def get_random_puzzle(self, rating, tolerance=100):
        query = """
            SELECT PuzzleId, FEN, Moves, Rating, Themes 
            FROM puzzles 
            WHERE Rating BETWEEN ? AND ? 
            ORDER BY RANDOM() LIMIT 1
        """
        res = self.con.execute(query, [rating - tolerance, rating + tolerance]).fetchone()
        if res:
            return {
                "id": res[0], "fen": res[1], 
                "moves": res[2].split(), "rating": res[3], "themes": res[4]
            }
        return None