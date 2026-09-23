 import React from 'react';
import {
  PlusCircle,
  FileText,
  Users,
  LayoutDashboard,
  Sun,
  Moon,
  Lock
} from 'lucide-react';

import CompanyLogo from './CompanyLogo';

export default function Header({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  onLockSystem
}) {
  return (
    <header
      className="
        sticky top-0 z-40
        bg-white/95 dark:bg-slate-950/90
        backdrop-blur-xl
        text-slate-900 dark:text-white
        border-b border-sky-200 dark:border-cyan-900/40
        shadow-md dark:shadow-2xl
        no-print
        transition-colors
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER TOP ================= */}
        <div className="flex items-center justify-between h-20">

          {/* ================= COMPANY LOGO ================= */}
          <div
            className="cursor-pointer flex items-center"
            onClick={() => setActiveTab('dashboard')}
          >
            <CompanyLogo className="h-16" />
          </div>

          {/* ================= DESKTOP NAVIGATION ================= */}
          <nav
            className="
              hidden md:flex items-center space-x-1
              bg-slate-100/90 dark:bg-slate-900/90
              p-1.5
              rounded-2xl
              border border-slate-200 dark:border-cyan-900/40
              shadow-inner
            "
          >

            {/* Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`
                flex items-center
                px-4 py-2
                rounded-xl
                text-sm font-extrabold
                transition-all
                ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-white dark:hover:bg-slate-800/60'
                }
              `}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </button>

            {/* New Bill */}
            <button
              onClick={() => setActiveTab('new-bill')}
              className={`
                flex items-center
                px-4 py-2
                rounded-xl
                text-sm font-extrabold
                transition-all
                ${
                  activeTab === 'new-bill'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-white dark:hover:bg-slate-800/60'
                }
              `}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              New Bill
            </button>

            {/* All Bills */}
            <button
              onClick={() => setActiveTab('bills')}
              className={`
                flex items-center
                px-4 py-2
                rounded-xl
                text-sm font-extrabold
                transition-all
                ${
                  activeTab === 'bills'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-white dark:hover:bg-slate-800/60'
                }
              `}
            >
              <FileText className="w-4 h-4 mr-2" />
              All Bills
            </button>

            {/* Clients */}
            <button
              onClick={() => setActiveTab('clients')}
              className={`
                flex items-center
                px-4 py-2
                rounded-xl
                text-sm font-extrabold
                transition-all
                ${
                  activeTab === 'clients'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-white dark:hover:bg-slate-800/60'
                }
              `}
            >
              <Users className="w-4 h-4 mr-2" />
              Clients
            </button>

          </nav>

          {/* ================= RIGHT ACTIONS ================= */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* Lock App PIN Button */}
            {onLockSystem && (
              <button
                onClick={onLockSystem}
                className="
                  p-2.5
                  rounded-xl
                  bg-slate-100 dark:bg-slate-900
                  text-slate-700 dark:text-slate-300
                  hover:text-rose-500 dark:hover:text-rose-400
                  hover:bg-rose-50 dark:hover:bg-rose-950/40
                  border border-slate-200 dark:border-cyan-900/50
                  transition-all
                "
                title="Lock Application with Security PIN"
              >
                <Lock className="w-5 h-5" />
              </button>
            )}

            {/* Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="
                p-2.5
                rounded-xl
                bg-slate-100 dark:bg-slate-900
                text-slate-700 dark:text-cyan-400
                hover:bg-slate-200 dark:hover:bg-slate-800
                border border-slate-200 dark:border-cyan-900/50
                transition-all
              "
              title="Toggle Dark/Light Mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>

            {/* Create Bilty */}
            <button
              onClick={() => setActiveTab('new-bill')}
              className="
                hidden sm:inline-flex
                items-center
                px-4 py-2.5
                rounded-xl
                text-sm font-black
                bg-gradient-to-r
                from-cyan-500
                via-sky-500
                to-blue-600
                hover:from-cyan-400
                hover:to-blue-500
                text-white
                shadow-lg
                shadow-cyan-500/30
                transform
                active:scale-95
                transition-all
              "
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Create Bilty Bill
            </button>

          </div>
        </div>

        {/* ================= MOBILE NAVIGATION ================= */}
        <div
          className="
            md:hidden
            flex items-center justify-around
            py-2.5
            border-t
            border-slate-200
            dark:border-cyan-900/40
          "
        >

          {/* Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`
              flex flex-col items-center
              px-3 py-1
              rounded-lg
              text-xs font-bold
              ${
                activeTab === 'dashboard'
                  ? 'text-cyan-600 dark:text-cyan-400 font-black'
                  : 'text-slate-600 dark:text-slate-400'
              }
            `}
          >
            <LayoutDashboard className="w-5 h-5 mb-1" />
            Dashboard
          </button>

          {/* New Bill */}
          <button
            onClick={() => setActiveTab('new-bill')}
            className={`
              flex flex-col items-center
              px-3 py-1
              rounded-lg
              text-xs font-bold
              ${
                activeTab === 'new-bill'
                  ? 'text-cyan-600 dark:text-cyan-400 font-black'
                  : 'text-slate-600 dark:text-slate-400'
              }
            `}
          >
            <PlusCircle className="w-5 h-5 mb-1" />
            New Bill
          </button>

          {/* Bills */}
          <button
            onClick={() => setActiveTab('bills')}
            className={`
              flex flex-col items-center
              px-3 py-1
              rounded-lg
              text-xs font-bold
              ${
                activeTab === 'bills'
                  ? 'text-cyan-600 dark:text-cyan-400 font-black'
                  : 'text-slate-600 dark:text-slate-400'
              }
            `}
          >
            <FileText className="w-5 h-5 mb-1" />
            Bills
          </button>

          {/* Clients */}
          <button
            onClick={() => setActiveTab('clients')}
            className={`
              flex flex-col items-center
              px-3 py-1
              rounded-lg
              text-xs font-bold
              ${
                activeTab === 'clients'
                  ? 'text-cyan-600 dark:text-cyan-400 font-black'
                  : 'text-slate-600 dark:text-slate-400'
              }
            `}
          >
            <Users className="w-5 h-5 mb-1" />
            Clients
          </button>

        </div>

      </div>
    </header>
  );
}