import sqlite3
import os

db_path = os.path.join("backend", "sql_app.db")

if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    print("Adding seeker_notes column to interviews table...")
    cursor.execute("ALTER TABLE interviews ADD COLUMN seeker_notes TEXT")
    conn.commit()
    print("Successfully added seeker_notes column.")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e).lower():
        print("Column seeker_notes already exists.")
    else:
        print(f"Error: {e}")
finally:
    conn.close()
