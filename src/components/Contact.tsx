import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [program, setProgram] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setStatus('error');
      setStatusMsg('Please provide your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, message, program }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry.');

      setStatus('success');
      setStatusMsg(data.message || 'Thank you! We will get in touch with you shortly.');
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setProgram('');
    } catch (err: any) {
      setStatus('error');
      setStatusMsg(err.message || 'An error occurred while sending your message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32 bg-[#111411] border-t border-[#232A22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-[2px] w-5 bg-[#C6FF3D]" />
              <span className="text-xs font-bold tracking-widest text-[#C6FF3D] uppercase">
                GET IN TOUCH
              </span>
            </div>
            <h2 className="font-athletic text-4xl sm:text-5xl font-black uppercase text-[#F7F8F4] tracking-tight leading-none">
              CONTACT & LOCATION
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#A7ADA2] max-w-md">
            Visit our training facility in Mayadevi, Rupandehi or contact our coaches directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Official Business Info & Map */}
          <div className="lg:col-span-6 space-y-8">
            <div className="p-6 rounded-xl bg-[#171B16] border border-[#232A22] space-y-5">
              <h3 className="font-athletic text-2xl font-bold uppercase text-[#F7F8F4]">
                FITNESSFIRST GYM
              </h3>

              <div className="space-y-4 text-sm">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C6FF3D] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#A7ADA2] block uppercase tracking-wider">Address</span>
                    <p className="text-[#F7F8F4] font-medium">
                      Mayadevi Rural Municipality–06, Rupandehi, Amuwa Road, Nepal
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#C6FF3D] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#A7ADA2] block uppercase tracking-wider">Phone</span>
                    <a
                      href="tel:+9779807404088"
                      className="text-[#F7F8F4] font-semibold hover:text-[#C6FF3D] transition-colors"
                    >
                      +977-9807404088
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#C6FF3D] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#A7ADA2] block uppercase tracking-wider">Email</span>
                    <a
                      href="mailto:shivarajachai@gmail.com"
                      className="text-[#F7F8F4] font-semibold hover:text-[#C6FF3D] transition-colors"
                    >
                      shivarajachai@gmail.com
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#C6FF3D] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#A7ADA2] block uppercase tracking-wider">Training Hours</span>
                    <p className="text-[#F7F8F4]">Sunday – Friday: 5:30 AM – 9:30 PM</p>
                    <p className="text-[#A7ADA2] text-xs">Saturday: 6:00 AM – 7:00 PM</p>
                  </div>
                </div>
              </div>

              {/* One-Click Google Maps & Directions */}
              <div className="pt-4 border-t border-[#232A22] flex flex-wrap gap-3">
                <a
                  href="https://www.google.com/maps?q=27.5190771,83.3925082"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#F7F8F4] hover:text-[#080A08] bg-[#111411] hover:bg-[#C6FF3D] border border-[#232A22] rounded transition-colors text-center"
                >
                  <MapPin className="w-4 h-4 text-[#C6FF3D] group-hover:text-[#080A08]" />
                  <span>View on Google Maps</span>
                </a>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=27.5190771%2C83.3925082"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#080A08] bg-[#C6FF3D] hover:bg-[#d4ff66] rounded transition-colors text-center shadow-[0_0_15px_rgba(198,255,61,0.25)]"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

            {/* Embedded Interactive Google Map with exact Lat/Lng */}
            <div className="rounded-xl overflow-hidden border border-[#232A22] h-64 bg-[#080A08] relative">
              <iframe
                title="FitnessFirst GYM Location Map"
                src="https://maps.google.com/maps?q=27.5190771,83.3925082&hl=en&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(110%)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute top-2 left-2 bg-[#080A08]/90 text-[10px] text-[#C6FF3D] font-mono px-2 py-1 rounded border border-[#232A22]">
                Coordinates: 27.5190771, 83.3925082
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-xl bg-[#171B16] border border-[#232A22]">
            <h3 className="font-athletic text-2xl font-bold uppercase text-[#F7F8F4] mb-2">
              SEND AN INQUIRY
            </h3>
            <p className="text-xs sm:text-sm text-[#A7ADA2] mb-6">
              Have questions regarding membership, training sessions, or private coaching? Leave your message below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A7ADA2] mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sunil Sharma"
                  className="w-full px-3.5 py-2.5 rounded bg-[#111411] border border-[#232A22] text-[#F7F8F4] placeholder-[#555] text-sm focus:outline-none focus:border-[#C6FF3D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A7ADA2] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sunil@example.com"
                    className="w-full px-3.5 py-2.5 rounded bg-[#111411] border border-[#232A22] text-[#F7F8F4] placeholder-[#555] text-sm focus:outline-none focus:border-[#C6FF3D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A7ADA2] mb-1.5">
                  Interested Program (Optional)
                </label>
                <select
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded bg-[#111411] border border-[#232A22] text-[#F7F8F4] text-sm focus:outline-none focus:border-[#C6FF3D]"
                >
                  <option value="">Select a Program</option>
                  <option value="Strength Training">Strength Training</option>
                  <option value="Muscle Building">Muscle Building</option>
                  <option value="Weight Management">Weight Management</option>
                  <option value="General Fitness">General Fitness</option>
                  <option value="Functional Training">Functional Training</option>
                  <option value="Personal Training">Personal Training</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A7ADA2] mb-1.5">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your fitness background and goals..."
                  className="w-full px-3.5 py-2.5 rounded bg-[#111411] border border-[#232A22] text-[#F7F8F4] placeholder-[#555] text-sm focus:outline-none focus:border-[#C6FF3D] resize-none"
                />
              </div>

              {status === 'success' && (
                <div className="p-3.5 rounded bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{statusMsg}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-3.5 rounded bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{statusMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#080A08] bg-[#C6FF3D] hover:bg-[#d4ff66] transition-colors rounded shadow-[0_0_15px_rgba(198,255,61,0.25)] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
