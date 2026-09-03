from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import uuid
from typing import List

app = FastAPI(title="IPsec AI Analyzer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "/tmp/ipsec_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "IPsec AI Analyzer Backend is Running", "status": "healthy"}

@app.post("/api/analyze/upload")
async def upload_pcap(file: UploadFile = File(...)):
    if not file.filename.endswith(('.pcap', '.pcapng')):
        raise HTTPException(status_code=400, detail="Invalid file format. Only .pcap and .pcapng files are supported.")
    
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Trigger mock AI & Security Analysis pipeline
    analysis_result = {
        "scan_id": file_id,
        "filename": file.filename,
        "security_score": 68,
        "risk_level": "Medium",
        "protocol_summary": {
            "ipsec_version": "IPsec (ESP/IKEv2)",
            "ike_version": "IKEv2",
            "operating_mode": "Tunnel Mode",
            "encryption": "AES-CBC-128",
            "authentication": "HMAC-SHA256",
            "dh_group": "MODP 2048-bit (Group 14)",
            "pfs": "Enabled"
        },
        "traffic_breakdown": {
            "Web Browsing (HTTPS)": 45.2,
            "Video Streaming": 30.1,
            "VoIP": 15.0,
            "ICMP/Control": 9.7
        },
        "vulnerabilities": [
            {"severity": "Medium", "title": "Legacy Cipher Suite Detected", "description": "AES-CBC with static padding can be vulnerable to side-channel or padding oracle attacks if not carefully implemented."},
            {"severity": "Low", "title": "Extended Key Lifetime", "description": "SA key lifetime is configured to 24 hours, exceeding recommended best practice of 8 hours."}
        ],
        "ai_confidence": 0.94
    }
    
    return analysis_result

@app.get("/api/reports/{scan_id}")
def generate_report(scan_id: str):
    return {
        "scan_id": scan_id,
        "report_type": "Executive & Technical Assessment",
        "status": "Generated Successfully",
        "download_url": f"/downloads/{scan_id}_report.pdf"
    }
  
