"use client";
import { useState } from "react";
import { ShieldCheck, UploadCloud, AlertTriangle, FileText, Cpu, Activity } from "lucide-react";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/analyze/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <header className="max-w-7xl mx-auto flex justify-between items-center pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl font-bold tracking-tight">IPsec AI Protocol Analyzer</h1>
        </div>
        <span className="text-xs bg-cyan-950 text-cyan-300 px-3 py-1 rounded-full border border-cyan-800">NTRO Framework v1.0</span>
      </header>

      <main className="max-w-7xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Panel */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-cyan-400" /> Capture Upload
            </h2>
            <p className="text-sm text-slate-400 mb-6">Upload network trace (.pcap or .pcapng) containing IKE negotiation and ESP traffic.</p>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <input 
                type="file" 
                accept=".pcap,.pcapng" 
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-950 file:text-cyan-300 hover:file:bg-cyan-900 cursor-pointer"
              />
              <button 
                type="submit" 
                disabled={loading || !file}
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white font-medium py-2 rounded-lg transition"
              >
                {loading ? "Analyzing Traffic & Running AI Models..." : "Run AI Security Assessment"}
              </button>
            </form>
          </div>

          {data && (
            <div className="mt-6 pt-4 border-t border-slate-800 text-sm text-slate-300">
              <p className="flex items-center gap-2 text-cyan-400 font-medium">
                <Cpu className="w-4 h-4" /> AI Confidence: {(data.ai_confidence * 100)}%
              </p>
            </div>
          )}
        </div>

        {/* Results & Metrics Panel */}
        <div className="lg:col-span-2 space-y-6">
          {data ? (
            <>
              {/* Scorecards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Security Score</p>
                  <p className="text-3xl font-bold text-emerald-400 mt-1">{data.security_score}/100</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Risk Level</p>
                  <p className="text-3xl font-bold text-amber-400 mt-1">{data.risk_level}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl col-span-2 md:col-span-1">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Operating Mode</p>
                  <p className="text-lg font-semibold text-cyan-300 mt-2">{data.protocol_summary.operating_mode}</p>
                </div>
              </div>

              {/* Protocol Characteristics */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" /> Inferred Protocol Characteristics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400 block">IKE Version</span>
                    <span className="font-medium">{data.protocol_summary.ike_version}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Encryption</span>
                    <span className="font-medium">{data.protocol_summary.encryption}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Authentication</span>
                    <span className="font-medium">{data.protocol_summary.authentication}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">DH Group</span>
                    <span className="font-medium">{data.protocol_summary.dh_group}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Forward Secrecy (PFS)</span>
                    <span className="font-medium text-emerald-400">{data.protocol_summary.pfs}</span>
                  </div>
                </div>
              </div>

              {/* Vulnerabilities & Threats */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Security Assessment Findings
                </h3>
                <div className="space-y-3">
                  {data.vulnerabilities.map((vuln, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium mt-0.5 ${vuln.severity === 'Medium' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-blue-950 text-blue-300 border border-blue-800'}`}>
                        {vuln.severity}
                      </span>
                      <div>
                        <h4 className="font-medium text-sm">{vuln.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{vuln.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full min-h-[350px] bg-slate-900 border border-slate-800 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-6">
              <FileText className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="font-medium text-slate-300">No Traffic Analyzed Yet</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-1">Upload an IPsec packet capture from the left panel to generate your AI security assessment report.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
    }
           
