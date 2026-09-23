import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { BillModel } from './models/Bill.js';
import { ClientModel } from './models/Client.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: (origin, callback) => {
    // Allow Vercel preview domains, local dev, and custom CLIENT_URL
    if (!origin || origin.includes('vercel.app') || origin.includes('localhost') || origin === process.env.CLIENT_URL) {
      return callback(null, true);
    }
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.options('*', cors());
app.use(express.json());

// Auto-prefix middleware for requests missing /api prefix
app.use((req, res, next) => {
  if (!req.path.startsWith('/api') && ['/company', '/stats', '/bills', '/clients'].some(p => req.path.startsWith(p))) {
    req.url = '/api' + req.url;
  }
  next();
});

// In-Memory Resilient DB Store fallback if local MongoDB service is offline
let isMongoConnected = false;
let memoryStore = {
  clients: [
    {
      id: 'CLI-001',
      name: 'Shree Ram Agro Foods',
      phone: '+91 98260 12345',
      address: 'Industrial Area, Narmadapuram (Hoshangabad), MP',
      gstin: '23AABCS1429B1Z8'
    },
    {
      id: 'CLI-002',
      name: 'Narmada Grains & Oil Mills',
      phone: '+91 94250 67890',
      address: 'Grain Market Road, Harda, MP',
      gstin: '23XYZPB9876C1Z2'
    }
  ],
  bills: [
    {
      id: 'BILL-1001',
      biltyNo: 'MNT/26/1001',
      date: '2026-09-20',
      clientName: 'Shree Ram Agro Foods',
      clientPhone: '+91 98260 12345',
      clientAddress: 'Industrial Area, Narmadapuram (Hoshangabad), MP',
      clientGstin: '23AABCS1429B1Z8',
      trips: [
        {
          id: 'TRIP-1',
          date: '2026-09-20',
          vehicleNo: 'MP 09 HG 4821',
          driverName: 'Rajesh Yadav',
          routeFrom: 'Narmadapuram',
          routeTo: 'Indore Mandi',
          material: 'Sharbati Wheat',
          loadedWeightKg: 10000,
          emptyWeightKg: 3000,
          netWeightKg: 7000,
          weightQuintals: 70,
          perkuntaRate: 20,
          freightAmount: 1400
        },
        {
          id: 'TRIP-2',
          date: '2026-09-21',
          vehicleNo: 'MP 04 CA 9912',
          driverName: 'Sunil Chouhan',
          routeFrom: 'Itarsi',
          routeTo: 'Bhopal Warehouse',
          material: 'Grain Seeds',
          loadedWeightKg: 25000,
          emptyWeightKg: 10000,
          netWeightKg: 15000,
          weightQuintals: 150,
          perkuntaRate: 20,
          freightAmount: 3000
        }
      ],
      vehicleNo: 'MP 09 HG 4821',
      routeFrom: 'Narmadapuram',
      routeTo: 'Indore Mandi',
      material: 'Sharbati Wheat & Seeds',
      loadedWeightKg: 35000,
      emptyWeightKg: 13000,
      netWeightKg: 22000,
      weightQuintals: 220,
      perkuntaRate: 20,
      freightAmount: 4400,
      loadingCharges: 500,
      unloadingCharges: 0,
      haltingCharges: 300,
      tollTaxes: 400,
      grossTotal: 5600,
      advancePaid: 2000,
      netPayable: 3600,
      paymentStatus: 'Pending',
      notes: 'Contains 2 trips. Rate @ ₹20/Quintal.'
    }
  ]
};

// Seed MongoDB if empty
async function seedMongo() {
  if (!isMongoConnected) return;
  try {
    const billCount = await BillModel.countDocuments();
    if (billCount === 0) {
      await BillModel.insertMany(memoryStore.bills);
      await ClientModel.insertMany(memoryStore.clients);
      console.log('MongoDB auto-seeded with sample bilties & clients!');
    }
  } catch (err) {
    console.error('MongoDB seed error:', err);
  }
}

// Company Info
app.get('/api/company', (req, res) => {
  res.json({
    name: 'Maa Narmada Transport',
    tagline: 'YOUR GOODS, OUR RESPONSIBILITY',
    proprietor: 'Maa Narmada Transport',
    phone: '+91 98260 99887, +91 94250 11223',
    email: 'billing@maanarmadatransport.com',
    address: 'Head Office: Transport Nagar, Near Narmada Bridge, Hoshangabad (Narmadapuram) - 461001 (M.P.)',
    gstin: '23AAAFM9876Q1Z9',
    pan: 'AAAFM9876Q',
    bankDetails: {
      bankName: 'State Bank of India',
      accountName: 'MAA NARMADA TRANSPORT',
      accountNo: '389201004592',
      ifsc: 'SBIN0001245',
      branch: 'Main Branch, Narmadapuram'
    },
    databaseType: isMongoConnected ? 'MongoDB (Mongoose)' : 'Local Persistent Storage'
  });
});

// GET Stats
app.get('/api/stats', async (req, res) => {
  try {
    let bills = [];
    if (isMongoConnected) {
      bills = await BillModel.find().lean();
    } else {
      bills = memoryStore.bills;
    }

    const totalBills = bills.length;
    const totalRevenue = bills.reduce((acc, b) => acc + (Number(b.grossTotal) || 0), 0);
    const totalCollected = bills.reduce((acc, b) => acc + (Number(b.advancePaid) || 0), 0);
    const totalPending = bills.reduce((acc, b) => acc + (Number(b.netPayable) || 0), 0);
    const totalQuintals = bills.reduce((acc, b) => acc + (Number(b.weightQuintals) || 0), 0);

    res.json({
      totalBills,
      totalRevenue,
      totalCollected,
      totalPending,
      totalQuintals,
      pendingBillsCount: bills.filter(b => b.paymentStatus !== 'Paid').length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Bills with Search & Filters
app.get('/api/bills', async (req, res) => {
  try {
    const { search, client, status } = req.query;
    let bills = [];

    if (isMongoConnected) {
      const query = {};
      if (status && status !== 'All') query.paymentStatus = status;

      bills = await BillModel.find(query).sort({ createdAt: -1 }).lean();

      if (search) {
        const q = search.toLowerCase();
        bills = bills.filter(b =>
          (b.clientName && b.clientName.toLowerCase().includes(q)) ||
          (b.biltyNo && b.biltyNo.toLowerCase().includes(q)) ||
          (b.vehicleNo && b.vehicleNo.toLowerCase().includes(q)) ||
          (b.id && b.id.toLowerCase().includes(q)) ||
          (b.trips && b.trips.some(t => t.vehicleNo && t.vehicleNo.toLowerCase().includes(q)))
        );
      }

      if (client) {
        const qClient = client.toLowerCase();
        bills = bills.filter(b => b.clientName && b.clientName.toLowerCase().includes(qClient));
      }
    } else {
      bills = [...memoryStore.bills];
      if (search) {
        const q = search.toLowerCase();
        bills = bills.filter(b =>
          (b.clientName && b.clientName.toLowerCase().includes(q)) ||
          (b.biltyNo && b.biltyNo.toLowerCase().includes(q)) ||
          (b.vehicleNo && b.vehicleNo.toLowerCase().includes(q)) ||
          (b.id && b.id.toLowerCase().includes(q)) ||
          (b.trips && b.trips.some(t => t.vehicleNo && t.vehicleNo.toLowerCase().includes(q)))
        );
      }
      if (client) {
        const qClient = client.toLowerCase();
        bills = bills.filter(b => b.clientName && b.clientName.toLowerCase().includes(qClient));
      }
      if (status && status !== 'All') {
        bills = bills.filter(b => b.paymentStatus === status);
      }
    }

    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Bill by ID
app.get('/api/bills/:id', async (req, res) => {
  try {
    let bill = null;
    if (isMongoConnected) {
      bill = await BillModel.findOne({ id: req.params.id }).lean();
    } else {
      bill = memoryStore.bills.find(b => b.id === req.params.id);
    }
    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper for multi-trip & weight processing
function processBillData(body, existingId, existingBiltyNo) {
  let trips = Array.isArray(body.trips) && body.trips.length > 0 ? body.trips : [];

  if (trips.length === 0) {
    const loadedKg = Number(body.loadedWeightKg || body.loadedWeight) || 0;
    const emptyKg = Number(body.emptyWeightKg || body.emptyWeight) || 0;
    const netKg = Number(body.netWeightKg) || (loadedKg >= emptyKg ? loadedKg - emptyKg : 0);
    const qtl = Number(body.weightQuintals) || (netKg > 0 ? netKg / 100 : 0);
    const rate = Number(body.perkuntaRate) || 0;
    const freight = qtl * rate;

    trips.push({
      id: 'TRIP-1',
      date: body.date || new Date().toISOString().split('T')[0],
      vehicleNo: (body.vehicleNo || '').toUpperCase(),
      driverName: body.driverName || '',
      driverPhone: body.driverPhone || '',
      routeFrom: body.routeFrom || '',
      routeTo: body.routeTo || '',
      material: body.material || '',
      loadedWeightKg: loadedKg,
      emptyWeightKg: emptyKg,
      netWeightKg: netKg,
      weightQuintals: qtl,
      perkuntaRate: rate,
      freightAmount: freight
    });
  } else {
    trips = trips.map((t, idx) => {
      const loadedKg = Number(t.loadedWeightKg !== undefined ? t.loadedWeightKg : t.loadedWeight) || 0;
      const emptyKg = Number(t.emptyWeightKg !== undefined ? t.emptyWeightKg : t.emptyWeight) || 0;
      
      let netKg = Number(t.netWeightKg) || 0;
      if (loadedKg > 0 && emptyKg >= 0 && loadedKg >= emptyKg) {
        netKg = loadedKg - emptyKg;
      }

      let qtl = Number(t.weightQuintals) || 0;
      if (netKg > 0) {
        qtl = netKg / 100;
      }

      const rate = Number(t.perkuntaRate) || 0;
      const freight = qtl * rate;

      return {
        ...t,
        id: t.id || `TRIP-${idx + 1}`,
        vehicleNo: (t.vehicleNo || '').toUpperCase(),
        loadedWeightKg: loadedKg,
        emptyWeightKg: emptyKg,
        netWeightKg: netKg,
        weightQuintals: qtl,
        perkuntaRate: rate,
        freightAmount: freight
      };
    });
  }

  const totalLoadedKg = trips.reduce((acc, t) => acc + (Number(t.loadedWeightKg) || 0), 0);
  const totalEmptyKg = trips.reduce((acc, t) => acc + (Number(t.emptyWeightKg) || 0), 0);
  const totalNetKg = trips.reduce((acc, t) => acc + (Number(t.netWeightKg) || 0), 0);
  const totalQuintals = trips.reduce((acc, t) => acc + (Number(t.weightQuintals) || 0), 0);
  const totalFreight = trips.reduce((acc, t) => acc + (Number(t.freightAmount) || 0), 0);

  const loading = Number(body.loadingCharges) || 0;
  const unloading = Number(body.unloadingCharges) || 0;
  const halting = Number(body.haltingCharges) || 0;
  const toll = Number(body.tollTaxes) || 0;

  const grossTotal = totalFreight + loading + unloading + halting + toll;
  const advance = Number(body.advancePaid) || 0;
  const netPayable = Math.max(0, grossTotal - advance);

  let paymentStatus = body.paymentStatus || 'Pending';
  if (netPayable === 0 && grossTotal > 0) {
    paymentStatus = 'Paid';
  } else if (advance > 0 && netPayable > 0) {
    paymentStatus = 'Partial';
  }

  const primaryTrip = trips[0] || {};

  return {
    id: body.id || existingId,
    biltyNo: body.biltyNo || existingBiltyNo,
    date: body.date || primaryTrip.date || new Date().toISOString().split('T')[0],
    clientName: body.clientName || 'Cash Client',
    clientPhone: body.clientPhone || '',
    clientAddress: body.clientAddress || '',
    clientGstin: body.clientGstin || '',
    trips,
    vehicleNo: trips.length === 1 ? primaryTrip.vehicleNo : `${trips.length} Vehicles (${primaryTrip.vehicleNo}...)`,
    driverName: primaryTrip.driverName || '',
    driverPhone: primaryTrip.driverPhone || '',
    routeFrom: primaryTrip.routeFrom || '',
    routeTo: primaryTrip.routeTo || '',
    material: trips.length === 1 ? primaryTrip.material : `${trips.length} Trip Items`,
    loadedWeightKg: totalLoadedKg,
    emptyWeightKg: totalEmptyKg,
    netWeightKg: totalNetKg,
    weightQuintals: totalQuintals,
    perkuntaRate: primaryTrip.perkuntaRate || 0,
    freightAmount: totalFreight,
    loadingCharges: loading,
    unloadingCharges: unloading,
    haltingCharges: halting,
    tollTaxes: toll,
    grossTotal,
    advancePaid: advance,
    netPayable,
    paymentStatus,
    notes: body.notes || ''
  };
}

// POST Create Bill
app.post('/api/bills', async (req, res) => {
  try {
    const totalCount = isMongoConnected ? await BillModel.countDocuments() : memoryStore.bills.length;
    const nextNum = totalCount + 1001;
    const newBillId = req.body.id || `BILL-${nextNum}`;
    const yearSuffix = new Date().getFullYear().toString().slice(-2);
    const newBiltyNo = req.body.biltyNo || `MNT/${yearSuffix}/${nextNum}`;

    const newBillData = processBillData(req.body, newBillId, newBiltyNo);

    let savedBill = null;
    if (isMongoConnected) {
      savedBill = await BillModel.create(newBillData);

      if (req.body.clientName) {
        const clientExists = await ClientModel.findOne({ name: new RegExp(`^${req.body.clientName}$`, 'i') });
        if (!clientExists) {
          const clientCount = await ClientModel.countDocuments();
          await ClientModel.create({
            id: `CLI-${clientCount + 101}`,
            name: req.body.clientName,
            phone: req.body.clientPhone || '',
            address: req.body.clientAddress || '',
            gstin: req.body.clientGstin || ''
          });
        }
      }
    } else {
      savedBill = newBillData;
      memoryStore.bills.unshift(newBillData);

      if (req.body.clientName && !memoryStore.clients.some(c => c.name.toLowerCase() === req.body.clientName.toLowerCase())) {
        memoryStore.clients.push({
          id: `CLI-${memoryStore.clients.length + 101}`,
          name: req.body.clientName,
          phone: req.body.clientPhone || '',
          address: req.body.clientAddress || '',
          gstin: req.body.clientGstin || ''
        });
      }
    }

    res.status(201).json(savedBill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Update Bill
app.put('/api/bills/:id', async (req, res) => {
  try {
    let updatedBill = null;
    if (isMongoConnected) {
      const existing = await BillModel.findOne({ id: req.params.id }).lean();
      if (!existing) return res.status(404).json({ error: 'Bill not found' });

      const billData = processBillData({ ...existing, ...req.body }, existing.id, existing.biltyNo);
      updatedBill = await BillModel.findOneAndUpdate({ id: req.params.id }, billData, { new: true }).lean();
    } else {
      const idx = memoryStore.bills.findIndex(b => b.id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Bill not found' });

      const existing = memoryStore.bills[idx];
      updatedBill = processBillData({ ...existing, ...req.body }, existing.id, existing.biltyNo);
      memoryStore.bills[idx] = updatedBill;
    }

    res.json(updatedBill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Bill
app.delete('/api/bills/:id', async (req, res) => {
  try {
    if (isMongoConnected) {
      const result = await BillModel.deleteOne({ id: req.params.id });
      if (result.deletedCount === 0) return res.status(404).json({ error: 'Bill not found' });
    } else {
      const exists = memoryStore.bills.some(b => b.id === req.params.id);
      if (!exists) return res.status(404).json({ error: 'Bill not found' });
      memoryStore.bills = memoryStore.bills.filter(b => b.id !== req.params.id);
    }
    res.json({ message: 'Bill deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Clients
app.get('/api/clients', async (req, res) => {
  try {
    let clients = [];
    if (isMongoConnected) {
      clients = await ClientModel.find().lean();
    } else {
      clients = memoryStore.clients;
    }
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Client
app.post('/api/clients', async (req, res) => {
  try {
    const { name, phone, address, gstin } = req.body;
    if (!name) return res.status(400).json({ error: 'Client name is required' });

    let newClient = null;
    if (isMongoConnected) {
      const count = await ClientModel.countDocuments();
      newClient = await ClientModel.create({
        id: `CLI-${count + 101}`,
        name,
        phone: phone || '',
        address: address || '',
        gstin: gstin || ''
      });
    } else {
      newClient = {
        id: `CLI-${memoryStore.clients.length + 101}`,
        name,
        phone: phone || '',
        address: address || '',
        gstin: gstin || ''
      };
      memoryStore.clients.push(newClient);
    }

    res.status(201).json(newClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Client
app.delete('/api/clients/:id', async (req, res) => {
  try {
    const targetId = req.params.id;
    if (isMongoConnected) {
      let result = await ClientModel.deleteOne({ id: targetId });
      if (result.deletedCount === 0 && targetId.match(/^[0-9a-fA-F]{24}$/)) {
        result = await ClientModel.deleteOne({ _id: targetId });
      }
      if (result.deletedCount === 0) {
        result = await ClientModel.deleteOne({ name: new RegExp(`^${targetId}$`, 'i') });
      }
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Client party not found' });
      }
    } else {
      const existsIndex = memoryStore.clients.findIndex(c => c.id === targetId || c._id === targetId || c.name.toLowerCase() === targetId.toLowerCase());
      if (existsIndex === -1) return res.status(404).json({ error: 'Client party not found' });
      memoryStore.clients.splice(existsIndex, 1);
    }
    res.json({ message: 'Client party deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server with Resilient Port Handling
async function startServer(portToTry = PORT) {
  isMongoConnected = await connectDB();
  if (isMongoConnected) {
    await seedMongo();
  }

  const server = app.listen(portToTry, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Maa Narmada Transport Backend Server is RUNNING`);
    console.log(`📍 URL: http://localhost:${portToTry}`);
    console.log(`🍃 Database: ${isMongoConnected ? 'MongoDB (Mongoose Connected)' : 'Local Persistent Engine'}`);
    console.log(`==================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`\n==================================================`);
      console.log(`ℹ️  Port ${portToTry} is already active!`);
      console.log(`👉 Backend server is ALREADY running at http://localhost:${portToTry}`);
      console.log(`==================================================\n`);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer();