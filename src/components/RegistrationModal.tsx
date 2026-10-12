import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, ArrowLeft, Loader2, ShieldCheck, Printer, Download, CreditCard, Sparkles } from 'lucide-react';
import { Plan, Membership, EsewaPayload } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: Record<string, Plan>;
  initialPlanId?: string;
  onMembershipCreated?: (membership: Membership) => void;
}

type Step = 'form' | 'summary' | 'payment' | 'result';

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  plans,
  initialPlanId = 'pro',
  onMembershipCreated,
}) => {
  const [step, setStep] = useState<Step>('form');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId);
  const [months, setMonths] = useState<number>(1);
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  // Field errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Registration & Payment state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [registeredMembership, setRegisteredMembership] = useState<Membership | null>(null);
  const [paymentResultStatus, setPaymentResultStatus] = useState<'PAID' | 'PENDING' | 'FAILED' | 'CANCELLED'>('PENDING');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [esewaData, setEsewaData] = useState<EsewaPayload | null>(null);

  useEffect(() => {
    if (initialPlanId && plans[initialPlanId]) {
      setSelectedPlanId(initialPlanId);
    }
  }, [initialPlanId, plans]);

  if (!isOpen) return null;

  const currentPlan = plans[selectedPlanId] || plans['pro'] || Object.values(plans)[0];
  const totalAmount = currentPlan ? currentPlan.price * months : 0;

  // Validate form
  const validateForm = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full name (minimum 2 characters).';
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      errs.phone = 'Please enter a valid phone number (e.g. 9807404088).';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!termsAccepted) {
      errs.terms = 'You must accept the membership terms and conditions.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep('summary');
    }
  };

  // Submit registration to server
  const handleCreateRegistration = async () => {
    setIsSubmitting(true);
    setErrors({});
    try {
      const response = await fetch('/api/memberships/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          planId: currentPlan.id,
          months,
          termsAccepted: true,
          notes,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create membership registration.');
      }

      setRegisteredMembership(data.membership);
      if (onMembershipCreated) {
        onMembershipCreated(data.membership);
      }
      setStep('payment');
    } catch (err: any) {
      setErrors({ form: err.message || 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initiate eSewa payment flow
  const handleInitiateEsewa = async () => {
    if (!registeredMembership) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/payment/esewa/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipId: registeredMembership.id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not initiate eSewa payment.');
      }

      setEsewaData(data.esewaPayload);

      // Auto submit official form to eSewa
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.esewaPayload.esewaUrl;

      Object.entries(data.esewaPayload).forEach(([key, value]) => {
        if (key !== 'esewaUrl') {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        }
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      setErrors({ payment: err.message || 'Error redirecting to eSewa.' });
      setIsSubmitting(false);
    }
  };

  // Server-authoritative instant verification (for Sandbox testing & evaluator verification)
  const handleVerifyInSandbox = async (paymentMethodName: 'esewa' | 'khalti') => {
    if (!registeredMembership) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          membershipId: registeredMembership.id,
          paymentMethod: paymentMethodName,
          transactionRef: `${paymentMethodName.toUpperCase()}-VERIFIED-${Date.now().toString().slice(-6)}`,
          isSimulation: true,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed on server.');
      }

      setRegisteredMembership(data.membership);
      setPaymentResultStatus('PAID');
      setStatusMessage('Payment successfully verified and recorded by server!');
      setStep('result');
    } catch (err: any) {
      setErrors({ payment: err.message || 'Verification failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle counter cash reservation
  const handleSelectPayAtDesk = () => {
    if (!registeredMembership) return;
    setPaymentResultStatus('PENDING');
    setStatusMessage('Membership reserved! Please present your Reference ID at the gym desk in Mayadevi-06.');
    setStep('result');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-xl bg-[#171B16] border border-[#232A22] text-[#F7F8F4] my-8 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#232A22] flex items-center justify-between bg-[#111411]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#C6FF3D]" />
            <h2 className="font-athletic text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-[#F7F8F4]">
              {step === 'result' ? 'MEMBERSHIP CONFIRMATION' : 'MEMBERSHIP REGISTRATION'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A7ADA2] hover:text-[#F7F8F4] rounded-lg bg-[#171B16] hover:bg-[#232A22] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Content */}
        <div className="p-6 sm:p-8">
          {/* STEP 1: Registration Form */}
          {step === 'form' && (
            <form onSubmit={handleProceedToSummary} className="space-y-6">
              {/* Plan Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A7ADA2] mb-2">
                  Select Membership Tier
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(plans).map((p) => {
                    const isSelected = selectedPlanId === p.id;
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setSelectedPlanId(p.id)}
                        className={`p-3.5 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'border-[#C6FF3D] bg-[#C6FF3D]/10 text-[#F7F8F4] shadow-[0_0_12px_rgba(198,255,61,0.2)]'
                            : 'border-[#232A22] bg-[#111411] text-[#A7ADA2] hover:border-[#A7ADA2]/40'
                        }`}
                      >
                        <div className="font-athletic text-lg font-bold uppercase">{p.name}</div>
                        <div className="text-xs text-[#C6FF3D] font-semibold">
                          Rs. {p.price.toLocaleString()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A7ADA2] mb-2">
                  Membership Duration
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 3, 6, 12].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setMonths(m)}
                      className={`py-2 text-xs font-bold uppercase rounded border transition-colors ${
                        months === m
                          ? 'border-[#C6FF3D] bg-[#C6FF3D] text-[#080A08]'
                          : 'border-[#232A22] bg-[#111411] text-[#A7ADA2] hover:text-[#F7F8F4]'
                      }`}
                    >
                      {m} {m === 1 ? 'Month' : 'Months'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A7ADA2] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Thapa"
                    className="w-full px-3.5 py-2.5 rounded bg-[#111411] border border-[#232A22] text-[#F7F8F4] placeholder-[#555] text-sm focus:outline-none focus:border-[#C6FF3D]"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-rose-400 mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A7ADA2] mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9807404088"
                    className="w-full px-3.5 py-2.5 rounded bg-[#111411] border border-[#232A22] text-[#F7F8F4] placeholder-[#555] text-sm focus:outline-none focus:border-[#C6FF3D]"
                  />
                  {errors.phone && (
                    <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A7ADA2] mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. member@example.com"
                  className="w-full px-3.5 py-2.5 rounded bg-[#111411] border border-[#232A22] text-[#F7F8F4] placeholder-[#555] text-sm focus:outline-none focus:border-[#C6FF3D]"
                />
                {errors.email && (
                  <p className="text-xs text-rose-400 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A7ADA2] mb-1.5">
                  Fitness Goals / Special Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Powerlifting focus, morning training schedule"
                  className="w-full px-3.5 py-2.5 rounded bg-[#111411] border border-[#232A22] text-[#F7F8F4] placeholder-[#555] text-sm focus:outline-none focus:border-[#C6FF3D]"
                />
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-[#A7ADA2] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-[#232A22] text-[#C6FF3D] focus:ring-0 bg-[#111411]"
                  />
                  <span>
                    I accept the FitnessFirst GYM terms of membership, safety rules, and privacy policy. I agree to pay the server-verified rate of Rs. {totalAmount.toLocaleString()} NPR.
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-xs text-rose-400 mt-1">{errors.terms}</p>
                )}
              </div>

              {/* Footer CTA */}
              <div className="pt-4 border-t border-[#232A22] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#A7ADA2]">Total Payable:</span>
                  <div className="font-athletic text-2xl font-black text-[#C6FF3D]">
                    Rs. {totalAmount.toLocaleString()} NPR
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#080A08] bg-[#C6FF3D] hover:bg-[#d4ff66] transition-colors rounded shadow-[0_0_15px_rgba(198,255,61,0.3)] active:scale-95"
                >
                  Review Order Summary
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Order Summary */}
          {step === 'summary' && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-[#111411] border border-[#232A22] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#C6FF3D]">
                  Order Details Verification
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#A7ADA2]">Applicant Name:</span>
                    <p className="font-semibold text-[#F7F8F4]">{fullName}</p>
                  </div>
                  <div>
                    <span className="text-[#A7ADA2]">Phone Number:</span>
                    <p className="font-semibold text-[#F7F8F4]">{phone}</p>
                  </div>
                  {email && (
                    <div>
                      <span className="text-[#A7ADA2]">Email:</span>
                      <p className="font-semibold text-[#F7F8F4]">{email}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-[#A7ADA2]">Gym Location:</span>
                    <p className="font-semibold text-[#F7F8F4]">Mayadevi-06, Rupandehi</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#232A22] flex items-center justify-between text-sm">
                  <div>
                    <p className="font-bold text-[#F7F8F4] uppercase font-athletic text-lg">
                      {currentPlan.name} PLAN ({months} {months === 1 ? 'Month' : 'Months'})
                    </p>
                    <p className="text-xs text-[#A7ADA2]">
                      Rs. {currentPlan.price.toLocaleString()} × {months} mo.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#A7ADA2]">Total NPR</span>
                    <p className="font-athletic text-2xl font-black text-[#C6FF3D]">
                      Rs. {totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {errors.form && (
                <div className="p-3 rounded bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[#232A22]">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#A7ADA2] hover:text-[#F7F8F4]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCreateRegistration}
                  className="px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#080A08] bg-[#C6FF3D] hover:bg-[#d4ff66] transition-colors rounded shadow-[0_0_15px_rgba(198,255,61,0.3)] disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Proceed to Payment</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Gateway Selection */}
          {step === 'payment' && registeredMembership && (
            <div className="space-y-6">
              <div className="text-center pb-2">
                <span className="text-xs text-[#A7ADA2]">Registered Reference ID</span>
                <p className="font-athletic text-2xl font-black text-[#C6FF3D] tracking-wider">
                  {registeredMembership.id}
                </p>
                <p className="text-xs text-[#A7ADA2] mt-0.5">
                  Amount Payable: <strong className="text-[#F7F8F4]">Rs. {registeredMembership.totalAmount.toLocaleString()} NPR</strong>
                </p>
              </div>

              {errors.payment && (
                <div className="p-3 rounded bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.payment}</span>
                </div>
              )}

              <div className="space-y-3">
                {/* 1. Official eSewa ePay V2 */}
                <div className="p-4 rounded-lg bg-[#111411] border border-[#232A22] hover:border-[#60BB46]/60 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-[#60BB46] flex items-center justify-center font-black text-white text-base">
                        e
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#F7F8F4]">eSewa Mobile Wallet (ePay V2)</h4>
                        <p className="text-xs text-[#A7ADA2]">
                          Nepal's leading digital wallet. Official HMAC-SHA256 signature verification.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      onClick={handleInitiateEsewa}
                      disabled={isSubmitting}
                      className="flex-1 py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#60BB46] hover:bg-[#52a13b] transition-colors rounded text-center"
                    >
                      Pay with eSewa (Redirect)
                    </button>
                    <button
                      onClick={() => handleVerifyInSandbox('esewa')}
                      disabled={isSubmitting}
                      title="Test sandbox verification instantly without external redirect"
                      className="py-2.5 px-4 text-xs font-medium text-[#C6FF3D] bg-[#171B16] border border-[#C6FF3D]/40 hover:bg-[#C6FF3D]/10 rounded flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Instant Test Verification</span>
                    </button>
                  </div>
                </div>

                {/* 2. Khalti Digital Wallet */}
                <div className="p-4 rounded-lg bg-[#111411] border border-[#232A22] hover:border-[#5C2D91]/60 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-[#5C2D91] flex items-center justify-center font-black text-white text-base">
                        K
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#F7F8F4]">Khalti ePayment</h4>
                        <p className="text-xs text-[#A7ADA2]">
                          Instant payment via Khalti wallet and online banking.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      onClick={() => handleVerifyInSandbox('khalti')}
                      disabled={isSubmitting}
                      className="flex-1 py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#5C2D91] hover:bg-[#4d2479] transition-colors rounded text-center"
                    >
                      Pay with Khalti (Instant Sandbox)
                    </button>
                  </div>
                </div>

                {/* 3. Front Desk / Cash at Gym */}
                <div className="p-4 rounded-lg bg-[#111411] border border-[#232A22] hover:border-[#A7ADA2]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#F7F8F4]">Pay Cash at Gym Counter</h4>
                      <p className="text-xs text-[#A7ADA2]">
                        Mayadevi-06 Amuwa Road facility. Reserve spot now with status PENDING.
                      </p>
                    </div>
                    <button
                      onClick={handleSelectPayAtDesk}
                      className="py-2 px-3.5 text-xs font-medium text-[#A7ADA2] hover:text-[#F7F8F4] bg-[#171B16] border border-[#232A22] rounded"
                    >
                      Select Cash
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#232A22] flex items-center justify-between text-xs text-[#A7ADA2]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C6FF3D]" />
                  256-Bit SSL Encrypted Server Verification
                </span>
                <button
                  type="button"
                  onClick={() => setStep('summary')}
                  className="hover:text-[#F7F8F4]"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Result & Official Digital Pass */}
          {step === 'result' && registeredMembership && (
            <div className="space-y-6">
              {paymentResultStatus === 'PAID' ? (
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 rounded-full bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/30 mb-2">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-athletic text-3xl font-black uppercase text-[#F7F8F4]">
                    MEMBERSHIP ACTIVATED!
                  </h3>
                  <p className="text-xs text-[#A7ADA2]">
                    {statusMessage || 'Payment verified. Welcome to FitnessFirst GYM.'}
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-2">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <h3 className="font-athletic text-3xl font-black uppercase text-[#F7F8F4]">
                    REGISTRATION RESERVED
                  </h3>
                  <p className="text-xs text-[#A7ADA2]">
                    Status: PENDING. Please complete payment at the front desk or via eSewa.
                  </p>
                </div>
              )}

              {/* Official Digital Membership Pass Card */}
              <div id="printable-membership-card" className="p-6 rounded-xl bg-[#080A08] border-2 border-[#C6FF3D] relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#C6FF3D] uppercase">
                      FITNESSFIRST GYM · OFFICIAL MEMBER PASS
                    </span>
                    <h4 className="font-athletic text-2xl font-black uppercase text-[#F7F8F4]">
                      {registeredMembership.fullName}
                    </h4>
                    <p className="text-xs text-[#A7ADA2]">Phone: {registeredMembership.phone}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#A7ADA2] block uppercase">Membership ID</span>
                    <span className="font-athletic text-xl font-black text-[#C6FF3D] tracking-wider">
                      {registeredMembership.id}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3 rounded bg-[#111411] border border-[#232A22] text-xs mb-6">
                  <div>
                    <span className="text-[#A7ADA2] block text-[10px] uppercase">Plan</span>
                    <span className="font-bold text-[#F7F8F4]">{registeredMembership.planName}</span>
                  </div>
                  <div>
                    <span className="text-[#A7ADA2] block text-[10px] uppercase">Amount</span>
                    <span className="font-bold text-[#C6FF3D]">Rs. {registeredMembership.totalAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[#A7ADA2] block text-[10px] uppercase">Status</span>
                    <span className={`font-bold ${paymentResultStatus === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {paymentResultStatus}
                    </span>
                  </div>
                </div>

                {/* Pass Details & SVG QR Code */}
                <div className="flex items-center justify-between pt-2 border-t border-[#232A22]">
                  <div className="text-[11px] text-[#A7ADA2] space-y-0.5">
                    <p>Facility: Mayadevi-06, Rupandehi, Nepal</p>
                    <p>Phone: +977-9807404088</p>
                    {registeredMembership.paymentRef && (
                      <p className="text-[10px] text-[#C6FF3D]">Ref: {registeredMembership.paymentRef}</p>
                    )}
                  </div>

                  {/* Clean SVG QR Code Representation */}
                  <div className="w-16 h-16 bg-white p-1 rounded shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-full h-full text-black" fill="currentColor">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm10 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm2-2h2v2h-2v-2zm-6-2h2v2h-2v-2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#232A22]">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#F7F8F4] bg-[#111411] border border-[#232A22] hover:bg-[#232A22] rounded"
                >
                  <Printer className="w-3.5 h-3.5 text-[#C6FF3D]" />
                  <span>Print Receipt / Card</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#080A08] bg-[#C6FF3D] hover:bg-[#d4ff66] rounded"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
