import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import BillForm from './components/BillForm';
import BillList from './components/BillList';
import BillModal from './components/BillModal';
import ClientManager from './components/ClientManager';
import PinLockScreen from './components/PinLockScreen';

import {
  fetchCompany,
  fetchStats,
  fetchBills,
  fetchClients,
  createBill,
  updateBill,
  deleteBill,
  createClient,
  deleteClient
} from './utils/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Default to Crisp Light Theme as requested by user
  const [darkMode, setDarkMode] = useState(false);

  // Security PIN Lock State (Default PIN: 0874)
  const [storedPin, setStoredPin] = useState(() => {
    const saved = localStorage.getItem('mnt_security_pin');
    return saved && saved !== '1234' ? saved : '0874';
  });
  const [isUnlocked, setIsUnlocked] = useState(() => sessionStorage.getItem('mnt_is_unlocked') === 'true');

  const [company, setCompany] = useState(null);
  const [stats, setStats] = useState(null);
  const [bills, setBills] = useState([]);
  const [clients, setClients] = useState([]);

  const [selectedBill, setSelectedBill] = useState(null);
  const [editingBill, setEditingBill] = useState(null);
  const [clientSearchFilter, setClientSearchFilter] = useState('');

  // Toggle Dark / Light Mode Class on HTML document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load Initial Data
  const loadData = async () => {
    try {
      const [companyData, statsData, billsData, clientsData] = await Promise.all([
        fetchCompany(),
        fetchStats(),
        fetchBills(),
        fetchClients()
      ]);

      setCompany(companyData);
      setStats(statsData);
      setBills(billsData);
      setClients(clientsData);
    } catch (err) {
      console.error('Error loading initial application data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save or Update Bill
  const handleSaveBill = async (billData) => {
    try {
      if (editingBill) {
        const updated = await updateBill(editingBill.id, billData);
        setSelectedBill(updated);
      } else {
        const created = await createBill(billData);
        setSelectedBill(created);
      }
      setEditingBill(null);
      await loadData();
      setActiveTab('bills');
    } catch (err) {
      alert('Error saving bill: ' + err.message);
    }
  };

  // Delete Bill
  const handleDeleteBill = async (billId) => {
    if (!window.confirm('Are you sure you want to delete this bill?')) return;
    try {
      await deleteBill(billId);
      if (selectedBill?.id === billId) {
        setSelectedBill(null);
      }
      await loadData();
    } catch (err) {
      alert('Error deleting bill: ' + err.message);
    }
  };

  // Create Client
  const handleCreateClient = async (clientData) => {
    try {
      await createClient(clientData);
      await loadData();
    } catch (err) {
      alert('Error creating client: ' + err.message);
    }
  };

  // Delete Client
  const handleDeleteClient = async (clientId, clientName) => {
    if (!window.confirm(`Are you sure you want to delete party "${clientName}"?`)) return;
    try {
      await deleteClient(clientId);
      await loadData();
    } catch (err) {
      alert('Error deleting client: ' + err.message);
    }
  };

  const handleSelectClientForBill = (clientName) => {
    setEditingBill({ clientName });
    setActiveTab('new-bill');
  };

  const handleViewBillsForClient = (clientName) => {
    setClientSearchFilter(clientName);
    setActiveTab('bills');
  };

  // If locked, present Security PIN Lock Screen
  if (!isUnlocked) {
    return (
      <PinLockScreen
        storedPin={storedPin}
        onUnlock={() => {
          setIsUnlocked(true);
          sessionStorage.setItem('mnt_is_unlocked', 'true');
        }}
        onChangePin={(newPin) => {
          localStorage.setItem('mnt_security_pin', newPin);
          setStoredPin(newPin);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-cyan-500 selection:text-white">
      
      {/* Header Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'new-bill') setEditingBill(null);
          setActiveTab(tab);
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLockSystem={() => {
          setIsUnlocked(false);
          sessionStorage.removeItem('mnt_is_unlocked');
        }}
      />

      {/* Main App Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            bills={bills}
            onNewBill={() => {
              setEditingBill(null);
              setActiveTab('new-bill');
            }}
            onViewBill={(bill) => setSelectedBill(bill)}
            onSelectClient={handleViewBillsForClient}
          />
        )}

        {activeTab === 'new-bill' && (
          <BillForm
            clients={clients}
            editingBill={editingBill}
            onSaveBill={handleSaveBill}
            onCancel={() => {
              setEditingBill(null);
              setActiveTab('bills');
            }}
          />
        )}

        {activeTab === 'bills' && (
          <BillList
            bills={bills}
            initialClientSearch={clientSearchFilter}
            onNewBill={() => {
              setEditingBill(null);
              setActiveTab('new-bill');
            }}
            onViewBill={(bill) => setSelectedBill(bill)}
            onEditBill={(bill) => {
              setEditingBill(bill);
              setActiveTab('new-bill');
            }}
            onDeleteBill={handleDeleteBill}
          />
        )}

        {activeTab === 'clients' && (
          <ClientManager
            clients={clients}
            bills={bills}
            onCreateClient={handleCreateClient}
            onDeleteClient={handleDeleteClient}
            onSelectClientForBill={handleSelectClientForBill}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs no-print transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-extrabold text-cyan-600 dark:text-cyan-400">MAA NARMADA TRANSPORT</span> • YOUR GOODS, OUR RESPONSIBILITY
          </div>
          <div className="text-slate-500 dark:text-slate-400">
            Mandla (M.P.) • Contact: +91 8602255077, +91 8878970847
          </div>
        </div>
      </footer>

      {/* Bill Preview & PDF Download Modal */}
      {selectedBill && (
        <BillModal
          bill={selectedBill}
          company={company}
          onClose={() => setSelectedBill(null)}
          onEdit={(bill) => {
            setSelectedBill(null);
            setEditingBill(bill);
            setActiveTab('new-bill');
          }}
          onDelete={(id) => {
            handleDeleteBill(id);
          }}
        />
      )}

    </div>
  );
}
