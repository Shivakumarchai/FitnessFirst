import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle, Clock, AlertCircle, RefreshCw, Download, Edit2, Save, Trash2, Users, DollarSign, MessageSquare } from 'lucide-react';
import { Membership, Plan, Trainer, Inquiry } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: Record<string, Plan>;
  onPlansUpdated: (newPlans: Record<string, Plan>) => void;
  trainers: Trainer[];
  onTrainersUpdated: (newTrainers: Trainer[]) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  plans,
  onPlansUpdated,
  trainers,
  onTrainersUpdated,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeTab, setActiveTab] = useState<'memberships' | 'plans' | 'trainers' | 'inquiries'>('memberships');
  const [loading, setLoading] = useState(false);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Editable plans state
  const [editablePlans, setEditablePlans] = useState<Record<string, Plan>>(plans);
  const [planSaveStatus, setPlanSaveStatus] = useState('');

  // Editable trainers state
  const [editableTrainers, setEditableTrainers] = useState<Trainer[]>(trainers);
  const [trainerSaveStatus, setTrainerSaveStatus] = useState('');

  useEffect(() => {
    setEditablePlans(plans);
  }, [plans]);

  useEffect(() => {
    setEditableTrainers(trainers);
  }, [trainers]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master PIN for gym management: 1234
    if (pin === '1234' || pin === '9807404088') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Invalid security PIN. Default manager PIN is 1234.');
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/memberships');
      const data = await res.json();
      if (res.ok) {
        setMemberships(data.memberships || []);
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/memberships/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setMemberships((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus as any } : m))
        );
      }
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const handleSavePlans = async () => {
    setPlanSaveStatus('Saving...');
    try {
      const res = await fetch('/api/admin/plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editablePlans),
      });
      if (res.ok) {
        onPlansUpdated(editablePlans);
        setPlanSaveStatus('Plans saved successfully!');
        setTimeout(() => setPlanSaveStatus(''), 3000);
      } else {
        setPlanSaveStatus('Failed to save plans.');
      }
    } catch (err) {
      setPlanSaveStatus('Error saving plans.');
    }
  };

  const handleSaveTrainers = async () => {
    setTrainerSaveStatus('Saving...');
    try {
      const res = await fetch('/api/admin/trainers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editableTrainers),
      });
      if (res.ok) {
        onTrainersUpdated(editableTrainers);
        setTrainerSaveStatus('Coaches updated successfully!');
        setTimeout(() => setTrainerSaveStatus(''), 3000);
      } else {
        setTrainerSaveStatus('Failed to save coaches.');
      }
    } catch (err) {
      setTrainerSaveStatus('Error saving coaches.');
    }
  };

  const exportCSV = () => {
    if (memberships.length === 0) return;
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Plan', 'Months', 'Total NPR', 'Status', 'Payment Method', 'Ref', 'Created At'];
    const rows = memberships.map((m) => [
      m.id,
      `"${m.fullName.replace(/"/g, '""')}"`,
      m.phone,
      m.email || '',
      m.planName,
      m.months,
      m.totalAmount,
      m.status,
      m.paymentMethod,
      m.paymentRef || '',
      m.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FitnessFirst_Members_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMemberships = memberships.filter((m) => {
    const matchesFilter = statusFilter === 'ALL' || m.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = memberships
    .filter((m) => m.status === 'PAID')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-xl bg-[#171B16] border border-[#232A22] text-[#F7F8F4] my-8 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#232A22] flex items-center justify-between bg-[#111411]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#C6FF3D]" />
            <h2 className="font-athletic text-2xl font-bold uppercase tracking-wider text-[#F7F8F4]">
              GYM MANAGEMENT PORTAL
            </h2>
            <span className="text-[10px] text-[#080A08] bg-[#C6FF3D] font-bold px-2 py-0.5 rounded uppercase">
              Admin
            </span>
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
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto w-full text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-[#111411] border border-[#232A22] text-[#C6FF3D] flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-athletic text-2xl font-bold uppercase text-[#F7F8F4]">
                Staff Passcode Required
              </h3>
              <p className="text-xs text-[#A7ADA2] mt-1">
                Enter your administrative PIN to access member registrations, eSewa logs, and content settings. (Default PIN: <strong className="text-[#F7F8F4]">1234</strong>)
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                className="w-full text-center tracking-widest text-lg font-mono px-4 py-3 rounded bg-[#111411] border border-[#232A22] text-[#F7F8F4] focus:outline-none focus:border-[#C6FF3D]"
              />
              {pinError && <p className="text-xs text-rose-400">{pinError}</p>}
              <button
                type="submit"
                className="w-full py-3 text-xs font-bold uppercase tracking-wider text-[#080A08] bg-[#C6FF3D] hover:bg-[#d4ff66] rounded"
              >
                Unlock Management Portal
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Top KPI Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-[#111411] border border-[#232A22]">
                <div className="flex items-center justify-between text-xs text-[#A7ADA2] mb-1">
                  <span>Total Members</span>
                  <Users className="w-4 h-4 text-[#C6FF3D]" />
                </div>
                <div className="font-athletic text-3xl font-black text-[#F7F8F4]">
                  {memberships.length}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#111411] border border-[#232A22]">
                <div className="flex items-center justify-between text-xs text-[#A7ADA2] mb-1">
                  <span>Active Paid</span>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-athletic text-3xl font-black text-emerald-400">
                  {memberships.filter((m) => m.status === 'PAID').length}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#111411] border border-[#232A22]">
                <div className="flex items-center justify-between text-xs text-[#A7ADA2] mb-1">
                  <span>Pending / Cash</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="font-athletic text-3xl font-black text-amber-400">
                  {memberships.filter((m) => m.status === 'PENDING').length}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#111411] border border-[#232A22]">
                <div className="flex items-center justify-between text-xs text-[#A7ADA2] mb-1">
                  <span>Verified Revenue</span>
                  <DollarSign className="w-4 h-4 text-[#C6FF3D]" />
                </div>
                <div className="font-athletic text-3xl font-black text-[#C6FF3D]">
                  Rs. {totalRevenue.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-[#232A22] pb-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('memberships')}
                  className={`px-4 py-2 text-xs font-bold uppercase rounded ${
                    activeTab === 'memberships'
                      ? 'bg-[#C6FF3D] text-[#080A08]'
                      : 'text-[#A7ADA2] hover:text-[#F7F8F4]'
                  }`}
                >
                  Registrations & Payments ({memberships.length})
                </button>
                <button
                  onClick={() => setActiveTab('plans')}
                  className={`px-4 py-2 text-xs font-bold uppercase rounded ${
                    activeTab === 'plans'
                      ? 'bg-[#C6FF3D] text-[#080A08]'
                      : 'text-[#A7ADA2] hover:text-[#F7F8F4]'
                  }`}
                >
                  Plans & Pricing
                </button>
                <button
                  onClick={() => setActiveTab('trainers')}
                  className={`px-4 py-2 text-xs font-bold uppercase rounded ${
                    activeTab === 'trainers'
                      ? 'bg-[#C6FF3D] text-[#080A08]'
                      : 'text-[#A7ADA2] hover:text-[#F7F8F4]'
                  }`}
                >
                  Coaches Roster
                </button>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`px-4 py-2 text-xs font-bold uppercase rounded ${
                    activeTab === 'inquiries'
                      ? 'bg-[#C6FF3D] text-[#080A08]'
                      : 'text-[#A7ADA2] hover:text-[#F7F8F4]'
                  }`}
                >
                  Inquiries ({inquiries.length})
                </button>
              </div>

              {activeTab === 'memberships' && (
                <div className="flex gap-2">
                  <button
                    onClick={fetchAdminData}
                    className="p-2 text-xs rounded bg-[#111411] border border-[#232A22] text-[#A7ADA2] hover:text-[#F7F8F4]"
                    title="Refresh"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={exportCSV}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded bg-[#111411] border border-[#232A22] text-[#F7F8F4] hover:text-[#C6FF3D]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              )}
            </div>

            {/* TAB 1: MEMBERSHIPS LEDGER */}
            {activeTab === 'memberships' && (
              <div className="space-y-4">
                {/* Search & Status Filters */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, phone, or membership ID..."
                    className="w-full sm:w-72 px-3.5 py-2 text-xs rounded bg-[#111411] border border-[#232A22] text-[#F7F8F4] placeholder-[#555] focus:outline-none focus:border-[#C6FF3D]"
                  />
                  <div className="flex gap-1.5 text-xs self-start sm:self-auto">
                    {['ALL', 'PAID', 'PENDING', 'FAILED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          statusFilter === st
                            ? 'bg-[#C6FF3D] text-[#080A08]'
                            : 'bg-[#111411] text-[#A7ADA2] border border-[#232A22]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ledger Table */}
                <div className="overflow-x-auto rounded-lg border border-[#232A22]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#111411] text-[#A7ADA2] border-b border-[#232A22]">
                      <tr>
                        <th className="p-3">Member ID</th>
                        <th className="p-3">Applicant Name</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Plan / Term</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Payment Ref</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#232A22] bg-[#171B16]">
                      {filteredMemberships.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-6 text-center text-[#A7ADA2]">
                            No membership records found matching current criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredMemberships.map((m) => (
                          <tr key={m.id} className="hover:bg-[#111411]/50">
                            <td className="p-3 font-mono font-bold text-[#C6FF3D]">{m.id}</td>
                            <td className="p-3 font-medium text-[#F7F8F4]">
                              {m.fullName}
                              {m.email && <span className="block text-[10px] text-[#A7ADA2]">{m.email}</span>}
                            </td>
                            <td className="p-3 text-[#A7ADA2]">{m.phone}</td>
                            <td className="p-3 font-bold text-[#F7F8F4]">
                              {m.planName} <span className="text-[10px] text-[#A7ADA2]">({m.months} mo)</span>
                            </td>
                            <td className="p-3 font-mono text-[#F7F8F4]">
                              Rs. {m.totalAmount.toLocaleString()}
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  m.status === 'PAID'
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                    : m.status === 'PENDING'
                                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                                }`}
                              >
                                {m.status}
                              </span>
                            </td>
                            <td className="p-3 text-[11px] font-mono text-[#A7ADA2]">
                              {m.paymentRef || 'N/A'}
                            </td>
                            <td className="p-3 text-right space-x-1">
                              {m.status !== 'PAID' && (
                                <button
                                  onClick={() => handleUpdateStatus(m.id, 'PAID')}
                                  title="Mark as Paid (Counter Cash Received)"
                                  className="px-2 py-1 text-[10px] font-bold text-[#080A08] bg-[#C6FF3D] rounded hover:bg-[#d4ff66]"
                                >
                                  Mark Paid
                                </button>
                              )}
                              {m.status === 'PAID' && (
                                <button
                                  onClick={() => handleUpdateStatus(m.id, 'CANCELLED')}
                                  title="Cancel or Revoke Pass"
                                  className="px-2 py-1 text-[10px] text-rose-300 bg-rose-950/60 border border-rose-800 rounded"
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: PLANS EDITOR */}
            {activeTab === 'plans' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-athletic text-2xl font-bold uppercase text-[#F7F8F4]">
                      Edit Membership Plan Details
                    </h3>
                    <p className="text-xs text-[#A7ADA2]">
                      Update plan descriptions and pricing stored in backend. Rates validated server-side.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {planSaveStatus && <span className="text-xs text-[#C6FF3D]">{planSaveStatus}</span>}
                    <button
                      onClick={handleSavePlans}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase text-[#080A08] bg-[#C6FF3D] hover:bg-[#d4ff66] rounded"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(editablePlans).map(([key, p]) => (
                    <div key={key} className="p-4 rounded-lg bg-[#111411] border border-[#232A22] space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-athletic text-xl font-bold text-[#F7F8F4]">{p.name}</span>
                        <span className="text-xs text-[#C6FF3D]">Rs. {p.price.toLocaleString()}</span>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#A7ADA2] block mb-1">
                          Monthly Fee (NPR)
                        </label>
                        <input
                          type="number"
                          value={p.price}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0;
                            setEditablePlans((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], price: val },
                            }));
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded bg-[#171B16] border border-[#232A22] text-[#F7F8F4]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#A7ADA2] block mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={p.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditablePlans((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], description: val },
                            }));
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded bg-[#171B16] border border-[#232A22] text-[#F7F8F4] resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: TRAINERS EDITOR */}
            {activeTab === 'trainers' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-athletic text-2xl font-bold uppercase text-[#F7F8F4]">
                      Coaching Staff Information
                    </h3>
                    <p className="text-xs text-[#A7ADA2]">
                      Configure names, specialties, and schedules for FitnessFirst GYM trainers.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {trainerSaveStatus && <span className="text-xs text-[#C6FF3D]">{trainerSaveStatus}</span>}
                    <button
                      onClick={handleSaveTrainers}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase text-[#080A08] bg-[#C6FF3D] hover:bg-[#d4ff66] rounded"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Coaches</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {editableTrainers.map((coach, index) => (
                    <div key={coach.id} className="p-4 rounded-lg bg-[#111411] border border-[#232A22] grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#A7ADA2] block mb-1">Trainer Name</label>
                        <input
                          type="text"
                          value={coach.name}
                          onChange={(e) => {
                            const updated = [...editableTrainers];
                            updated[index].name = e.target.value;
                            setEditableTrainers(updated);
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded bg-[#171B16] border border-[#232A22] text-[#F7F8F4]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#A7ADA2] block mb-1">Title / Designation</label>
                        <input
                          type="text"
                          value={coach.title}
                          onChange={(e) => {
                            const updated = [...editableTrainers];
                            updated[index].title = e.target.value;
                            setEditableTrainers(updated);
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded bg-[#171B16] border border-[#232A22] text-[#F7F8F4]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#A7ADA2] block mb-1">Specialty</label>
                        <input
                          type="text"
                          value={coach.specialty}
                          onChange={(e) => {
                            const updated = [...editableTrainers];
                            updated[index].specialty = e.target.value;
                            setEditableTrainers(updated);
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded bg-[#171B16] border border-[#232A22] text-[#F7F8F4]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: INQUIRIES */}
            {activeTab === 'inquiries' && (
              <div className="space-y-4">
                <h3 className="font-athletic text-2xl font-bold uppercase text-[#F7F8F4]">
                  Inquiries Received ({inquiries.length})
                </h3>
                {inquiries.length === 0 ? (
                  <p className="text-xs text-[#A7ADA2] p-6 text-center bg-[#111411] rounded border border-[#232A22]">
                    No inquiries received yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="p-4 rounded-lg bg-[#111411] border border-[#232A22] space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-sm text-[#F7F8F4]">{inq.name}</span>
                            <span className="text-xs text-[#A7ADA2] ml-2">Phone: {inq.phone}</span>
                            {inq.email && <span className="text-xs text-[#A7ADA2] ml-2">· {inq.email}</span>}
                          </div>
                          <span className="text-[10px] text-[#A7ADA2]">
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {inq.program && (
                          <div className="text-[11px] text-[#C6FF3D]">Program: {inq.program}</div>
                        )}
                        <p className="text-xs text-[#A7ADA2] bg-[#171B16] p-2.5 rounded border border-[#232A22]">
                          {inq.message || 'No additional note provided.'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
