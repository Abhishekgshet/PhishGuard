import sqlite3


def create_table():

    connection = sqlite3.connect("phishguard.db")

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            risk_score INTEGER,
            status TEXT,
            warnings TEXT
        )
    """)

    connection.commit()

    connection.close()


def save_scan(url, risk_score, status, warnings):

    connection = sqlite3.connect("phishguard.db")

    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO scans
        (url, risk_score, status, warnings)
        VALUES (?, ?, ?, ?)
    """, (
        url,
        risk_score,
        status,
        ", ".join(warnings)
    ))

    connection.commit()

    connection.close()


def get_scans():

    connection = sqlite3.connect("phishguard.db")

    cursor = connection.cursor()

    cursor.execute("""
        SELECT id, url, risk_score, status, warnings
        FROM scans
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    connection.close()

    scans = []

    for row in rows:

        scan = {
            "id": row[0],
            "url": row[1],
            "risk_score": row[2],
            "status": row[3],
            "warnings": row[4]
        }

        scans.append(scan)

    return scans

def get_stats():

    connection = sqlite3.connect("phishguard.db")

    cursor = connection.cursor()

    cursor.execute("SELECT COUNT(*) FROM scans")
    total = cursor.fetchone()[0]

    cursor.execute(
        "SELECT COUNT(*) FROM scans WHERE status = ?",
        ("Low Risk",)
    )
    low_risk = cursor.fetchone()[0]

    cursor.execute(
        "SELECT COUNT(*) FROM scans WHERE status = ?",
        ("Suspicious",)
    )
    suspicious = cursor.fetchone()[0]

    cursor.execute(
        "SELECT COUNT(*) FROM scans WHERE status = ?",
        ("High Risk",)
    )
    high_risk = cursor.fetchone()[0]

    connection.close()

    return {
        "total": total,
        "low_risk": low_risk,
        "suspicious": suspicious,
        "high_risk": high_risk
    }

def search_scans(search="", status=""):

    connection = sqlite3.connect("phishguard.db")

    cursor = connection.cursor()

    query = """
        SELECT id, url, risk_score, status, warnings
        FROM scans
        WHERE 1=1
    """

    values = []

    if search != "":
        query += " AND url LIKE ?"
        values.append("%" + search + "%")

    if status != "":
        query += " AND status = ?"
        values.append(status)

    query += " ORDER BY id DESC"

    cursor.execute(query, values)

    rows = cursor.fetchall()

    connection.close()

    scans = []

    for row in rows:

        scan = {
            "id": row[0],
            "url": row[1],
            "risk_score": row[2],
            "status": row[3],
            "warnings": row[4]
        }

        scans.append(scan)

    return scans

def delete_scan(scan_id):

    connection = sqlite3.connect("phishguard.db")

    cursor = connection.cursor()

    cursor.execute(
        "DELETE FROM scans WHERE id = ?",
        (scan_id,)
    )

    connection.commit()

    deleted = cursor.rowcount

    connection.close()

    return deleted

def update_scan(scan_id, status):

    connection = sqlite3.connect("phishguard.db")

    cursor = connection.cursor()

    cursor.execute(
        "UPDATE scans SET status = ? WHERE id = ?",
        (status, scan_id)
    )

    connection.commit()

    updated = cursor.rowcount

    connection.close()

    return updated