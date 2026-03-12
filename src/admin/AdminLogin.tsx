import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface Props {
  onLogin: (password: string) => boolean;
}

export default function AdminLogin({ onLogin }: Props) {
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError('Wrong password. Try again.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPassword('');
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background red orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,0,0,0.08) 0%, transparent 70%)' }}
      />

      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,0,0,0.015) 3px, rgba(255,0,0,0.015) 4px)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="w-16 h-16 bg-red-600 rounded-sm flex items-center justify-center mx-auto mb-4"
            style={{ boxShadow: '0 0 30px #ff000070, 0 0 60px #ff000030' }}
          >
            <ShieldCheck size={28} className="text-white" />
          </motion.div>
          <h1 className="font-clash text-4xl text-white tracking-wider mb-1">ADMIN ACCESS</h1>
          <p className="text-zinc-600 text-xs tracking-widest uppercase">The Trend Lab — War Room</p>
        </div>

        {/* Form */}
        <motion.form
          animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="glass rounded-sm p-6 border border-zinc-900 space-y-4"
        >
          <div>
            <label className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2 block">
              <Lock size={11} className="inline mr-1" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter admin password"
                className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 pr-10 rounded-sm focus:outline-none focus:border-red-600 placeholder-zinc-700 text-sm transition-colors"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors cursor-pointer"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
              >
                ⚠ {error}
              </motion.p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3 bg-red-600 text-white font-bold tracking-widest uppercase rounded-sm cursor-pointer transition-all"
            style={{ boxShadow: '0 0 20px #ff000060' }}
          >
            🔐 ENTER WAR ROOM
          </motion.button>
        </motion.form>

        <p className="text-center text-zinc-700 text-xs mt-6">
          Hint: TRENDLAB2026
        </p>
      </motion.div>
    </div>
  );
}
