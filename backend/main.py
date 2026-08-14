from fastapi import FastAPI
from backend.database import create_table, save_scan, get_scans
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.detector import analyze_url
from backend.database import (
    create_table,
    save_scan,
    get_scans,
    get_stats,
    search_scans,
    delete_scan,
    update_scan
)


app = FastAPI()
create_table()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)


class URLRequest(BaseModel):
    url: str


@app.get("/")
def home():

    return {
        "message": "PhishGuard API is running"
    }


@app.delete("/scans/{scan_id}")
def delete(scan_id: int):

    deleted = delete_scan(scan_id)

    if deleted == 0:
        return {
            "message": "Scan not found"
        }

    return {
        "message": "Scan deleted successfully"
    }

@app.post("/analyze")
def analyze(request: URLRequest):

    result = analyze_url(request.url)

    save_scan(
        request.url,
        result["risk_score"],
        result["status"],
        result["warnings"]
    )

    return {
        "url": request.url,
        "analysis": result
    }

@app.get("/history")
def history():

    scans = get_scans()

    return {
        "scans": scans
    }

@app.get("/stats")
def stats():

    return get_stats()


@app.get("/search")
def search(search: str = "", status: str = ""):

    scans = search_scans(search, status)

    return {
        "scans": scans
    }

@app.put("/scans/{scan_id}")
def update(scan_id: int, status: str):

    updated = update_scan(scan_id, status)

    if updated == 0:
        return {
            "message": "Scan not found"
        }

    return {
        "message": "Scan updated successfully"
    }