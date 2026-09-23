import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, ShieldAlert, CheckCircle2, Eye, EyeOff, Delete } from 'lucide-react';
import CompanyLogo from './CompanyLogo';

export default function PinLockScreen({ onUnlock, storedPin, onChangePin }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [changeSuccess, setChangeSuccess] = useState('');

  const currentPin = storedPin || '0874';

  const handleKeyPress = (digit) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError('');
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const verifyPin = (inputPin) => {
    if (inputPin === currentPin) {
      onUnlock();
    } else {
      setError('Incorrect Security PIN!');
      setTimeout(() => setPin(''), 600);
    }
  };

  const handleSetNewPinSubmit = (e) => {
    e.preventDefault();
    if (oldPin !== currentPin) {
      setError('Current PIN is incorrect!');
      return;
    }
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setError('New PIN must be exactly 4 digits!');
      return;
    }
    onChangePin(newPin);
    setChangeSuccess('PIN updated successfully!');
    setIsChangingPin(false);
    setOldPin('');
    setNewPin('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-white">
      {/* Background Glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-md w-full bg-slate-900/90 border border-slate-800 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="bg-slate-950 p-3 rounded-2xl border border-cyan-500/30 shadow-lg">
            <CompanyLogo className="h-14" showTagline={false} />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight uppercase mt-2">
            Maa Narmada Transport
          </h2>
          <p className="text-xs font-semibold text-cyan-400">
            SECURITY PIN REQUIRED TO ACCESS BILLING SYSTEM
          </p>
        </div>

        {/* Change PIN Mode */}
        {isChangingPin ? (
          <form onSubmit={handleSetNewPinSubmit} className="space-y-4 text-left border-t border-slate-800 pt-4">
            <h3 className="text-sm font-bold text-white flex items-center">
              <KeyRound className="w-4 h-4 text-cyan-400 mr-2" />
              Change Security PIN
            </h3>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center">
                <ShieldAlert className="w-4 h-4 mr-2 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current 4-Digit PIN</label>
              <input
                type="password"
                maxLength={4}
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value)}
                placeholder="1234"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono text-center tracking-widest focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">New 4-Digit PIN</label>
              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="e.g. 5678"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono text-center tracking-widest focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPin(false);
                  setError('');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md"
              >
                Save New PIN
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* PIN Entry Display */}
            <div className="space-y-4">
              
              {/* PIN Dots Display */}
              <div className="flex items-center justify-center space-x-3 my-4">
                {[0, 1, 2, 3].map((index) => {
                  const filled = pin.length > index;
                  return (
                    <div
                      key={index}
                      className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-xl font-bold transition-all ${
                        filled
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-lg shadow-cyan-500/20 scale-105'
                          : 'border-slate-800 bg-slate-950/60 text-slate-600'
                      }`}
                    >
                      {filled ? (showPin ? pin[index] : '●') : ''}
                    </div>
                  );
                })}
              </div>

              {/* Status or Error Message */}
              {error && (
                <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center justify-center animate-shake">
                  <ShieldAlert className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}

              {changeSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {changeSuccess}
                </div>
              )}

              {!error && !changeSuccess && (
                <div className="text-xs text-slate-400 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
                  Enter 4-digit Security PIN (Default: <b className="text-white ml-1 font-mono">0874</b>)
                </div>
              )}

              {/* Keypad Grid */}
              <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto pt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleKeyPress(num.toString())}
                    className="h-12 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white text-lg font-bold border border-slate-700/60 shadow-md active:scale-95 transition-all flex items-center justify-center"
                  >
                    {num}
                  </button>
                ))}

                <button
                  onClick={handleClear}
                  className="h-12 rounded-2xl bg-slate-950/80 hover:bg-slate-800 text-slate-400 text-xs font-bold border border-slate-800 active:scale-95 transition-all"
                >
                  Clear
                </button>

                <button
                  onClick={() => handleKeyPress('0')}
                  className="h-12 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white text-lg font-bold border border-slate-700/60 shadow-md active:scale-95 transition-all flex items-center justify-center"
                >
                  0
                </button>

                <button
                  onClick={handleDelete}
                  className="h-12 rounded-2xl bg-slate-950/80 hover:bg-slate-800 text-rose-400 text-xs font-bold border border-slate-800 active:scale-95 transition-all flex items-center justify-center"
                  title="Delete digit"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>

              {/* Toggle visibility and Change PIN options */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/80">
                <button
                  onClick={() => setShowPin(!showPin)}
                  className="flex items-center hover:text-white transition-colors"
                >
                  {showPin ? <EyeOff className="w-3.5 h-3.5 mr-1 text-cyan-400" /> : <Eye className="w-3.5 h-3.5 mr-1" />}
                  {showPin ? 'Hide PIN' : 'Show PIN'}
                </button>

                <button
                  onClick={() => {
                    setIsChangingPin(true);
                    setError('');
                  }}
                  className="flex items-center text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 mr-1" />
                  Change PIN
                </button>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}
