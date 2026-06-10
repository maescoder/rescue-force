"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, AlertCircle, CheckCircle2, ChevronRight, LogOut, Database } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [adoptions, setAdoptions] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then(res => res.json()),
      fetch('/api/adoptions').then(res => res.json()),
      fetch('/api/reports').then(res => res.json())
    ]).then(([s, a, r]) => {
      setStats(s);
      setAdoptions(a);
      setReports(r);
      setLoading(false);
    });
  }, []);

  const rescuedCount = stats.find(s => s.stat_key === 'rescued_count')?.stat_value || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-blue-500 selection:text-white font-sans relative overflow-hidden">
      
      {/* ── BACKGROUND GLOWS ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* ── SIDEBAR / NAV ── */}
      <nav className="relative z-50 p-6 flex justify-between items-center max-w-7xl mx-auto border-b border-white/10 mb-8">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-blue-400" />
          <span className="text-xl font-medium tracking-tight">RescueForce Command</span>
        </div>
        <a href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10">
          <LogOut className="w-4 h-4" /> Exit Terminal
        </a>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pb-24 relative z-10 space-y-8">
        
        {/* ── STATS ROW ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full transition-transform group-hover:scale-150" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-gray-400 font-medium">Total Rescued</h3>
            </div>
            <p className="text-5xl font-light tracking-tight">{rescuedCount}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full transition-transform group-hover:scale-150" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-gray-400 font-medium">Pending Adoptions</h3>
            </div>
            <p className="text-5xl font-light tracking-tight">{adoptions.length}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full transition-transform group-hover:scale-150" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-gray-400 font-medium">Active Emergencies</h3>
            </div>
            <p className="text-5xl font-light tracking-tight text-white">{reports.length}</p>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* ── REPORTS TABLE ── */}
          <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[500px]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-lg font-medium flex items-center gap-2"><Activity className="w-5 h-5 text-red-400" /> Live Incident Feed</h2>
            </div>
            <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-500">
                    <th className="p-4 font-medium">Urgency</th>
                    <th className="p-4 font-medium">Location</th>
                    <th className="p-4 font-medium">Type</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reports.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-gray-500">No active incidents.</td></tr>
                  )}
                  {reports.map((r, i) => (
                    <motion.tr initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + (i * 0.05) }} key={r.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${r.urgency === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : r.urgency === 'Medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                          {r.urgency}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-gray-200">{r.location}</td>
                      <td className="p-4 text-gray-400">{r.type}</td>
                      <td className="p-4 text-right">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 group-hover:text-white">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* ── ADOPTIONS TABLE ── */}
          <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[500px]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-lg font-medium flex items-center gap-2"><Users className="w-5 h-5 text-blue-400" /> Adoption Pipeline</h2>
            </div>
            <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-500">
                    <th className="p-4 font-medium">Applicant</th>
                    <th className="p-4 font-medium">Pet Type</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {adoptions.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-gray-500">No pending applications.</td></tr>
                  )}
                  {adoptions.map((a, i) => (
                    <motion.tr initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + (i * 0.05) }} key={a.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 font-medium text-gray-200">{a.applicant_name}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-blue-500/10 text-blue-400 border-blue-500/20">
                          {a.pet_type}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{new Date(a.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 group-hover:text-white">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

        </div>
      </main>
      
      {/* Scrollbar CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </div>
  );
}
