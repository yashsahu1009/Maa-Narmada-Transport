function getApiBaseUrl() {
  let envUrl = import.meta.env.VITE_API_URL || '/api';
  envUrl = envUrl.trim();

  if (envUrl.startsWith('http')) {
    let cleanUrl = envUrl.replace(/\/+$/, '');
    if (!cleanUrl.endsWith('/api')) {
      cleanUrl += '/api';
    }
    return cleanUrl;
  }

  return envUrl;
}

const API_BASE = getApiBaseUrl();

async function fetchWithTimeout(url, options = {}, timeoutMs = 25000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Server response timed out. Waking up cloud server...');
    }
    throw err;
  }
}

export async function fetchCompany() {
  const res = await fetchWithTimeout(`${API_BASE}/company`);
  if (!res.ok) throw new Error('Failed to fetch company details');
  return res.json();
}

export async function fetchStats() {
  const res = await fetchWithTimeout(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

export async function fetchBills(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetchWithTimeout(`${API_BASE}/bills?${query}`);
  if (!res.ok) throw new Error('Failed to fetch bills');
  return res.json();
}

export async function fetchBillById(id) {
  const res = await fetchWithTimeout(`${API_BASE}/bills/${id}`);
  if (!res.ok) throw new Error('Failed to fetch bill details');
  return res.json();
}

export async function createBill(data) {
  const res = await fetchWithTimeout(`${API_BASE}/bills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create bill');
  return res.json();
}

export async function updateBill(id, data) {
  const res = await fetchWithTimeout(`${API_BASE}/bills/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update bill');
  return res.json();
}

export async function deleteBill(id) {
  const res = await fetchWithTimeout(`${API_BASE}/bills/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete bill');
  return res.json();
}

export async function fetchClients() {
  const res = await fetchWithTimeout(`${API_BASE}/clients`);
  if (!res.ok) throw new Error('Failed to fetch clients');
  return res.json();
}

export async function createClient(data) {
  const res = await fetchWithTimeout(`${API_BASE}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create client');
  return res.json();
}

export async function deleteClient(id) {
  const res = await fetchWithTimeout(`${API_BASE}/clients/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete client');
  return res.json();
}
