"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Clock, MapPin, ArrowRight } from 'lucide-react';
import PremiumFooter from '@/components/PremiumFooter';

const stories = [
  { name: 'Luna', img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop', desc: 'Found wandering the streets, now living her best life on a farm.' },
  { name: 'Max', img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1000&auto=format&fit=crop', desc: 'Rescued from a storm drain. Max is now a certified therapy dog.' },
  { name: 'Bella', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop', desc: 'Overcame a broken leg and is the fastest runner at the dog park.' },
];

export default function Adopt() {
  const [status, setStatus] = useState<string>('');
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Submitting...');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/submit-adoption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-black selection:bg-black selection:text-white">
      {/* ── NAVIGATION ── */}
      <nav className="absolute top-0 w-full z-50 p-8 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
        <a href="/" className="text-2xl font-bold tracking-tight text-white drop-shadow-md">RescueForce</a>
        <a href="/" className="text-sm text-white/90 hover:text-white drop-shadow-md backdrop-blur-md bg-black/20 px-4 py-2 rounded-full transition-colors">← Back to Gallery</a>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=2000&auto=format&fit=crop" alt="Hero Dogs" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-light text-white tracking-tight leading-tight">
            Give them the <span className="font-semibold italic">forever</span> they deserve.
          </h1>
          <p className="mt-6 text-lg text-white/90 font-light max-w-xl mx-auto">
            Every adoption is a second chance. Become part of a rescue story that changes a life forever.
          </p>
        </motion.div>
      </section>

      {/* ── SUCCESS STORIES ── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="text-4xl font-light tracking-tight">Recent Rescues</h2>
            <p className="text-gray-500 mt-2">Read the stories of animals who found their forever homes.</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 text-sm font-medium text-gray-500"><Heart className="w-4 h-4" /> 1,204 Adoptions</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              key={story.name} className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-gray-100 cursor-pointer"
            >
              <img src={story.img} alt={story.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-3xl font-semibold text-white mb-2">{story.name}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{story.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ADOPTION FORM ── */}
      <section className="py-24 bg-white border-t border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-blue-50 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-green-50 blur-3xl opacity-50" />
        
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light tracking-tight">Start Your Journey</h2>
            <p className="text-gray-500 mt-4">Fill out the application below to begin the adoption process.</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-gray-100 shadow-2xl shadow-gray-200/50 rounded-3xl p-8 md:p-12">
            {status === 'success' ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Application Received!</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Thank you for stepping up. Our adoption counselors will review your profile and contact you within 48 hours.
                </p>
                <button onClick={() => window.location.href='/'} className="mt-8 px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                  Return Home
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1 */}
                <div className={step === 1 ? 'block' : 'hidden'}>
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-gray-400" /> Basic Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Full Name</label>
                      <input required name="applicant_name" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 ring-black/5 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Email Address</label>
                      <input required type="email" name="email" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 ring-black/5 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number</label>
                      <input required name="phone" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 ring-black/5 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Desired Pet Type</label>
                      <select name="pet_type" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 ring-black/5 transition-all">
                        <option>Dog</option>
                        <option>Cat</option>
                        <option>Bird</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button type="button" onClick={() => setStep(2)} className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full hover:scale-105 transition-transform">
                      Next Step <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Step 2 */}
                <div className={step === 2 ? 'block' : 'hidden'}>
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-gray-400" /> Living Situation</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Describe your living situation</label>
                      <input required name="living_situation" placeholder="House with fenced yard, apartment, etc." className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 ring-black/5 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Prior Pet Experience</label>
                      <textarea required name="experience" rows={3} placeholder="Tell us about pets you've had in the past..." className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 ring-black/5 transition-all"></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Additional Information</label>
                      <textarea name="additional_info" rows={2} placeholder="Any specific requirements or questions?" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 ring-black/5 transition-all"></textarea>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between items-center">
                    <button type="button" onClick={() => setStep(1)} className="px-6 py-3 text-gray-500 hover:text-black transition-colors">
                      Back
                    </button>
                    <button type="submit" disabled={status === 'Submitting...'} className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100">
                      {status === 'Submitting...' ? 'Submitting...' : 'Complete Application'}
                    </button>
                  </div>
                </div>
                {status === 'error' && <p className="text-red-500 text-sm mt-4 text-center">Failed to submit application. Please try again.</p>}
              </form>
            )}
          </div>
        </div>
      </section>

      <PremiumFooter />
    </div>
  );
}
