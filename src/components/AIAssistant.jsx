import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Sparkles, Loader, AlertTriangle } from 'lucide-react';

export default function AIAssistant({ activeAlerts }) {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateAnalysis = async () => {
    if (activeAlerts.length === 0) {
      setError('No active alerts to analyze.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setAnalysis('');

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('VITE_GEMINI_API_KEY is not defined in your environment variables. Please add it to .env.local');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const simplifiedAlerts = activeAlerts.map(a => ({
        vehicle: a.vehicle,
        severity: a.severity,
        issue: a.label,
        temp: a.tempReading ? `${a.tempReading}°C` : 'N/A',
        location: a.location,
        duration: a.timestamp
      }));

      const prompt = `
        You are VaxSafe AI, an expert cold chain logistics assistant.
        Analyze the following active alerts from our vaccine delivery fleet:
        ${JSON.stringify(simplifiedAlerts, null, 2)}
        
        Provide:
        1. A brief "Root Cause Hypothesis" summarizing the likely systemic cause (if any) of these issues.
        2. Exactly 3 "Actionable Recommendations" for the operations team.
        
        Keep your response brief and professional. Do not use markdown headers (like #), just use bold text (**text**) and bullet points (*).
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      setAnalysis(response);
    } catch (err) {
      setError(err.message || 'An error occurred while generating analysis.');
    } finally {
      setLoading(false);
    }
  };

  // Simple parser to render bold text and line breaks without a markdown library
  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <div key={i} style={{ height: 8 }} />;
      
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={i} style={{ marginBottom: 4, lineHeight: 1.5, fontSize: '0.88rem', color: '#334155' }}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} style={{ color: '#1e293b' }}>{part.slice(2, -2)}</strong>;
            }
            return <span key={j}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="glass-card" style={{ marginTop: 24, border: '1px solid #c7d2fe', background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)' }}>
      <div className="card-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4f46e5' }}>
          <Sparkles size={18} />
          Gemini AI Root Cause Analysis
        </h3>
        <button 
          className="btn" 
          onClick={generateAnalysis} 
          disabled={loading || activeAlerts.length === 0}
          style={{ background: '#4f46e5', color: '#fff' }}
        >
          {loading ? <Loader size={14} className="spin" /> : 'Generate Analysis'}
        </button>
      </div>
      <div className="card-body" style={{ minHeight: 120 }}>
        {error && (
          <div style={{ padding: 16, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#ef4444', fontSize: '0.85rem', display: 'flex', gap: 8 }}>
            <AlertTriangle size={16} />
            {error}
          </div>
        )}
        
        {!error && !analysis && !loading && (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>
            {activeAlerts.length === 0 
              ? 'No active alerts to analyze.' 
              : 'Click "Generate Analysis" to query Gemini.'}
          </div>
        )}

        {loading && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#6366f1', gap: 12 }}>
            <Loader size={24} className="spin" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Analyzing fleet telemetry...</span>
          </div>
        )}

        {analysis && !loading && (
          <div className="animate-in" style={{ padding: '8px 0' }}>
            {renderText(analysis)}
          </div>
        )}
      </div>
    </div>
  );
}
