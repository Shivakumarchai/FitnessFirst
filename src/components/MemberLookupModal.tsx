import React, { useState } from 'react';
import { X, Search, Ticket, CheckCircle, AlertCircle, Loader2, Printer } from 'lucide-react';
import { Membership } from '../types';

interface MemberLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemberLookupModal: React.FC<MemberLookupModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Membership[] | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res = await fetch(`/api/memberships/lookup?query=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to search memberships.');
      setResults(data);
      if (data.length === 0) {
        setError('No active membership found for that ID or phone number.');
      }
    } catch (err: any) {
      setError(err.message || 'Error looking up membership.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-xl bg-[#171B16] border border-[#232A22] text-[#F7F8F4] my-8 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#232A22] flex items-center justify-between bg-[#111411]">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#C6FF3D]" />
            <h2 className="font-athletic text-2xl font-bold uppercase text-[#F7F8F4]">
              MEMBERSHIP PASS LOOKUP
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A7ADA2] hover:text-[#F7F8F4] rounded-lg bg-[#171B16] hover:bg-[#232A22]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-xs text-[#A7ADA2]">
            Enter your Phone Number (e.g. <strong className="text-[#F7F8F4]">9807404088</strong>) or Membership ID (e.g. <strong className="text-[#F7F8F4]">FF-2026-XXXX</strong>) to retrieve your official pass.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by phone number or ID..."
              className="flex-1 px-4 py-2.5 rounded bg-[#111411] border border-[#232A22] text-[#F7F8F4] placeholder-[#555] text-sm focus:outline-none focus:border-[#C6FF3D]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#080A08] bg-[#C6FF3D] hover:bg-[#d4ff66] rounded flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Lookup</span>
            </button>
          </form>

          {error && (
            <div className="p-3.5 rounded bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Results List */}
          {results && results.length > 0 && (
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C6FF3D]">
                Found Records ({results.length})
              </h3>

              {results.map((m) => (
                <div
                  key={m.id}
                  className="p-5 rounded-lg bg-[#080A08] border border-[#232A22] hover:border-[#C6FF3D]/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-athletic text-xl font-bold uppercase text-[#F7F8F4]">
                        {m.fullName}
                      </h4>
                      <p className="text-xs text-[#A7ADA2]">{m.phone} · {m.planName} Plan</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        m.status === 'PAID'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-[#232A22] text-[#A7ADA2] mb-3">
                    <div>
                      <span>Membership ID:</span>
                      <p className="font-mono font-bold text-[#C6FF3D]">{m.id}</p>
                    </div>
                    <div>
                      <span>Total Paid:</span>
                      <p className="font-bold text-[#F7F8F4]">Rs. {m.totalAmount.toLocaleString()} NPR</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#A7ADA2]">
                    <span>Valid For: {m.months} Month(s)</span>
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1 text-xs text-[#C6FF3D] hover:underline"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Pass</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
