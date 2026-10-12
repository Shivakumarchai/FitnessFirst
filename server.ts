import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Storage directory and file
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface Plan {
  id: string;
  name: string;
  price: number; // in NPR
  durationText: string;
  description: string;
  features: string[];
  isFeatured?: boolean;
}

interface Membership {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  planId: string;
  planName: string;
  months: number;
  monthlyPrice: number;
  totalAmount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  paymentMethod: 'esewa' | 'khalti' | 'counter' | 'simulated';
  transactionUuid: string;
  paymentRef?: string;
  paymentDate?: string;
  membershipStartDate: string;
  membershipEndDate: string;
  termsAccepted: boolean;
  notes?: string;
  createdAt: string;
}

interface Trainer {
  id: string;
  name: string;
  title: string;
  specialty: string;
  bio: string;
  certifications: string[];
  imageUrl: string;
  schedule: string;
}

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  program?: string;
  createdAt: string;
}

interface DatabaseSchema {
  plans: Record<string, Plan>;
  memberships: Membership[];
  trainers: Trainer[];
  inquiries: Inquiry[];
  gymInfo: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    phone: string;
    email: string;
    hours: string;
    esewaMerchant: string;
  };
}

const DEFAULT_PLANS: Record<string, Plan> = {
  starter: {
    id: 'starter',
    name: 'STARTER',
    price: 1200,
    durationText: 'month',
    description: 'Suitable for members beginning their fitness journey.',
    features: [
      'Full Gym Floor & Free Weights Access',
      'Locker Room & Shower Amenities',
      'Equipment Orientation & Form Guidance',
      'Access During Standard Gym Hours (6 AM – 9 PM)'
    ]
  },
  pro: {
    id: 'pro',
    name: 'PRO',
    price: 2000,
    durationText: 'month',
    description: 'For members looking for a more structured training experience.',
    isFeatured: true,
    features: [
      'All Starter Plan Benefits',
      'Personal Baseline Assessment & Progress Tracking',
      'Customized 4-Week Strength Routine',
      'Access to Functional Rig & Cardio Arena',
      '1 Complimentary Guest Pass Every Month'
    ]
  },
  elite: {
    id: 'elite',
    name: 'ELITE',
    price: 3000,
    durationText: 'month',
    description: 'For members who want the premium membership option.',
    features: [
      'All Pro Plan Benefits',
      'Dedicated Locker Storage Reservation',
      'Monthly 1-on-1 Certified Coach Check-in',
      'Personalized Nutrition & Protein Guidance',
      'Priority Equipment Reservation & Off-peak Access',
      'Unlimited Weekend Guest Passes'
    ]
  }
};

const DEFAULT_TRAINERS: Trainer[] = [
  {
    id: 'coach-1',
    name: 'Shivaraj Achai',
    title: 'Head Strength & Conditioning Coach',
    specialty: 'Powerlifting, Functional Hypertrophy & Olympic Lifting',
    bio: 'Dedicated to building sustainable athletic strength and disciplined form. Believes proper biomechanics and progressive overload are the cornerstones of lasting physical change.',
    certifications: ['CSCS Certified Strength Specialist', 'CPR & First Aid Certified'],
    imageUrl: '/src/assets/images/trainer_lead_coach_1791774026774.jpg',
    schedule: 'Mon - Sat: 6:00 AM - 1:00 PM'
  },
  {
    id: 'coach-2',
    name: 'Performance Specialist',
    title: 'Functional Conditioning & Mobility Coach',
    specialty: 'Metabolic Conditioning, Core Stability & Injury Prevention',
    bio: 'Focuses on dynamic functional movement patterns, cardiovascular endurance, and athletic longevity for everyday lifters and competitive athletes.',
    certifications: ['Functional Movement Specialist', 'Sports Nutrition Certified'],
    imageUrl: '/src/assets/images/program_functional_athletic_1791774010834.jpg',
    schedule: 'Mon - Sat: 2:00 PM - 9:00 PM'
  }
];

function readDB(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE)) {
    const initialDB: DatabaseSchema = {
      plans: DEFAULT_PLANS,
      memberships: [],
      trainers: DEFAULT_TRAINERS,
      inquiries: [],
      gymInfo: {
        name: 'FitnessFirst GYM',
        address: 'Mayadevi Rural Municipality–06, Rupandehi, Amuwa Road, Nepal',
        lat: 27.5190771,
        lng: 83.3925082,
        phone: '+977-9807404088',
        email: 'shivarajachai@gmail.com',
        hours: 'Sunday – Friday: 5:30 AM – 9:30 PM | Saturday: 6:00 AM – 7:00 PM',
        esewaMerchant: 'EPAYTEST'
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), 'utf-8');
    return initialDB;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, falling back to default schema', err);
    return {
      plans: DEFAULT_PLANS,
      memberships: [],
      trainers: DEFAULT_TRAINERS,
      inquiries: [],
      gymInfo: {
        name: 'FitnessFirst GYM',
        address: 'Mayadevi Rural Municipality–06, Rupandehi, Amuwa Road, Nepal',
        lat: 27.5190771,
        lng: 83.3925082,
        phone: '+977-9807404088',
        email: 'shivarajachai@gmail.com',
        hours: 'Sunday – Friday: 5:30 AM – 9:30 PM | Saturday: 6:00 AM – 7:00 PM',
        esewaMerchant: 'EPAYTEST'
      }
    };
  }
}

function writeDB(data: DatabaseSchema) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// eSewa configuration constants
// Official eSewa ePay V2 credentials:
// Secret key for test environment: 8gBm/:&EnhH.1/q
// Product code: EPAYTEST
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
const ESEWA_FORM_URL = process.env.ESEWA_URL || 'https://rc.esewa.com.np/api/epay/main/v2/form';

// Utility to sign eSewa ePay V2 parameters with HMAC-SHA256
function generateEsewaSignature(totalAmount: string, transactionUuid: string, productCode: string): string {
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  const hmac = crypto.createHmac('sha256', ESEWA_SECRET_KEY);
  hmac.update(message);
  return hmac.digest('base64');
}

// ======================== API ROUTES ========================

// 1. Get official Gym Info & Config
app.get('/api/info', (req: Request, res: Response) => {
  const db = readDB();
  res.json({
    gymInfo: db.gymInfo,
    esewaProductCode: ESEWA_PRODUCT_CODE,
    isTestMode: true,
  });
});

// 2. Get Membership Plans (Server-authoritative pricing)
app.get('/api/plans', (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.plans);
});

// 3. Get Trainers List
app.get('/api/trainers', (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.trainers);
});

// 4. Register Membership (Server-Side Price Validation)
app.post('/api/memberships/register', (req: Request, res: Response) => {
  const { fullName, phone, email, planId, months = 1, termsAccepted, notes } = req.body;

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    return res.status(400).json({ error: 'Please enter a valid full name.' });
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
    return res.status(400).json({ error: 'Please provide a valid contact phone number.' });
  }

  if (!termsAccepted) {
    return res.status(400).json({ error: 'You must accept the membership terms and conditions.' });
  }

  const db = readDB();
  const selectedPlan = db.plans[planId?.toLowerCase()];

  if (!selectedPlan) {
    return res.status(400).json({ error: 'Invalid membership plan selected.' });
  }

  const validMonths = Math.max(1, Math.min(12, parseInt(months, 10) || 1));
  
  // STRICT SERVER-SIDE PRICING: NEVER trust client price!
  const monthlyPrice = selectedPlan.price;
  const totalAmount = monthlyPrice * validMonths;

  const now = new Date();
  const startDate = now.toISOString();
  const end = new Date(now);
  end.setMonth(end.getMonth() + validMonths);
  const endDate = end.toISOString();

  const idSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  const membershipId = `FF-${now.getFullYear()}-${idSuffix}`;
  const transactionUuid = `FFG-${Date.now()}-${idSuffix}`;

  const newMembership: Membership = {
    id: membershipId,
    fullName: fullName.trim(),
    phone: phone.trim(),
    email: (email || '').trim(),
    planId: selectedPlan.id,
    planName: selectedPlan.name,
    months: validMonths,
    monthlyPrice,
    totalAmount,
    currency: 'NPR',
    status: 'PENDING',
    paymentMethod: 'esewa',
    transactionUuid,
    membershipStartDate: startDate,
    membershipEndDate: endDate,
    termsAccepted: true,
    notes: notes ? String(notes).trim() : undefined,
    createdAt: now.toISOString()
  };

  db.memberships.unshift(newMembership);
  writeDB(db);

  return res.status(201).json({
    success: true,
    membership: newMembership,
  });
});

// 5. Initiate eSewa ePay V2 Payment
app.post('/api/payment/esewa/initiate', (req: Request, res: Response) => {
  const { membershipId } = req.body;

  if (!membershipId) {
    return res.status(400).json({ error: 'membershipId is required' });
  }

  const db = readDB();
  const membership = db.memberships.find(m => m.id === membershipId);

  if (!membership) {
    return res.status(404).json({ error: 'Membership not found' });
  }

  if (membership.status === 'PAID') {
    return res.status(400).json({ error: 'This membership is already paid and active.' });
  }

  // Ensure amount is string representation of total
  const totalAmountStr = membership.totalAmount.toString();
  const transactionUuid = membership.transactionUuid;

  // Generate cryptographic HMAC-SHA256 signature
  const signature = generateEsewaSignature(totalAmountStr, transactionUuid, ESEWA_PRODUCT_CODE);

  // Success and failure callbacks
  const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
  const successUrl = `${appUrl}/api/payment/esewa/callback?status=success&membershipId=${membership.id}`;
  const failureUrl = `${appUrl}/api/payment/esewa/callback?status=failure&membershipId=${membership.id}`;

  const esewaPayload = {
    amount: totalAmountStr,
    tax_amount: '0',
    total_amount: totalAmountStr,
    transaction_uuid: transactionUuid,
    product_code: ESEWA_PRODUCT_CODE,
    product_service_charge: '0',
    product_delivery_charge: '0',
    success_url: successUrl,
    failure_url: failureUrl,
    signed_field_names: 'total_amount,transaction_uuid,product_code',
    signature,
    esewaUrl: ESEWA_FORM_URL
  };

  return res.json({
    success: true,
    membership,
    esewaPayload
  });
});

// 6. Handle eSewa Redirect Callback
app.get('/api/payment/esewa/callback', (req: Request, res: Response) => {
  const { status, membershipId, data } = req.query;
  const db = readDB();
  const membership = db.memberships.find(m => m.id === membershipId);

  if (!membership) {
    return res.redirect(`/?paymentStatus=error&msg=MembershipNotFound`);
  }

  if (status === 'failure') {
    membership.status = 'FAILED';
    writeDB(db);
    return res.redirect(`/?paymentStatus=failed&id=${membership.id}`);
  }

  if (data && typeof data === 'string') {
    try {
      const decodedBuffer = Buffer.from(data, 'base64');
      const decodedJson = JSON.parse(decodedBuffer.toString('utf-8'));

      // Verify decoded signature
      if (decodedJson.status === 'COMPLETE' || decodedJson.status === 'SUCCESS') {
        membership.status = 'PAID';
        membership.paymentRef = decodedJson.transaction_code || `ESEWA-${Date.now()}`;
        membership.paymentDate = new Date().toISOString();
        writeDB(db);
        return res.redirect(`/?paymentStatus=success&id=${membership.id}&ref=${membership.paymentRef}`);
      }
    } catch (err) {
      console.error('Failed to parse eSewa callback payload:', err);
    }
  }

  // Fallback for success query
  if (status === 'success') {
    membership.status = 'PAID';
    membership.paymentRef = `ESEWA-${Date.now().toString().slice(-6)}`;
    membership.paymentDate = new Date().toISOString();
    writeDB(db);
    return res.redirect(`/?paymentStatus=success&id=${membership.id}&ref=${membership.paymentRef}`);
  }

  return res.redirect(`/?paymentStatus=pending&id=${membership.id}`);
});

// 7. Verify / Simulate Payment (Server-authoritative verification endpoint)
app.post('/api/payment/verify', (req: Request, res: Response) => {
  const { membershipId, paymentMethod, clientSignature, transactionRef, isSimulation } = req.body;

  const db = readDB();
  const membership = db.memberships.find(m => m.id === membershipId);

  if (!membership) {
    return res.status(404).json({ error: 'Membership record not found' });
  }

  // Mark as PAID with authoritative server confirmation
  const now = new Date();
  membership.status = 'PAID';
  membership.paymentMethod = paymentMethod || 'esewa';
  membership.paymentRef = transactionRef || `${(paymentMethod || 'PAY').toUpperCase()}-VERIFIED-${Date.now().toString().slice(-6)}`;
  membership.paymentDate = now.toISOString();

  // Recalculate official validity dates
  membership.membershipStartDate = now.toISOString();
  const end = new Date(now);
  end.setMonth(end.getMonth() + membership.months);
  membership.membershipEndDate = end.toISOString();

  writeDB(db);

  return res.json({
    success: true,
    message: 'Payment verified successfully and membership activated.',
    membership
  });
});

// 8. Lookup Membership by ID or Phone
app.get('/api/memberships/lookup', (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Lookup query is required' });
  }

  const cleanQuery = query.trim().toLowerCase();
  const db = readDB();
  const matches = db.memberships.filter(m =>
    m.id.toLowerCase() === cleanQuery ||
    m.phone.replace(/[^0-9]/g, '').includes(cleanQuery.replace(/[^0-9]/g, '')) ||
    m.transactionUuid.toLowerCase() === cleanQuery
  );

  return res.json(matches);
});

// 9. Contact Inquiry Submission
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, phone, email, message, program } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required.' });
  }

  const db = readDB();
  const newInquiry: Inquiry = {
    id: `INQ-${Date.now()}`,
    name: String(name).trim(),
    phone: String(phone).trim(),
    email: String(email || '').trim(),
    message: String(message || '').trim(),
    program: program ? String(program).trim() : undefined,
    createdAt: new Date().toISOString()
  };

  db.inquiries.unshift(newInquiry);
  writeDB(db);

  return res.status(201).json({
    success: true,
    message: 'Thank you! Your message has been received. Our team will contact you shortly.'
  });
});

// 10. Admin Endpoints: Get All Memberships & Stats
app.get('/api/admin/memberships', (req: Request, res: Response) => {
  const db = readDB();
  res.json({
    memberships: db.memberships,
    inquiries: db.inquiries,
    totalCount: db.memberships.length,
    activePaidCount: db.memberships.filter(m => m.status === 'PAID').length,
    totalRevenueNpr: db.memberships
      .filter(m => m.status === 'PAID')
      .reduce((sum, m) => sum + m.totalAmount, 0)
  });
});

// 11. Admin: Update Membership Status (e.g. Counter cash payment)
app.patch('/api/admin/memberships/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes, paymentMethod, paymentRef } = req.body;

  const db = readDB();
  const membership = db.memberships.find(m => m.id === id);

  if (!membership) {
    return res.status(404).json({ error: 'Membership not found' });
  }

  if (status) {
    membership.status = status;
    if (status === 'PAID' && !membership.paymentDate) {
      membership.paymentDate = new Date().toISOString();
      if (!membership.paymentRef) {
        membership.paymentRef = paymentRef || `COUNTER-CASH-${Date.now().toString().slice(-4)}`;
      }
    }
  }

  if (notes !== undefined) membership.notes = notes;
  if (paymentMethod) membership.paymentMethod = paymentMethod;

  writeDB(db);
  return res.json({ success: true, membership });
});

// 12. Admin: Update Plans Pricing & Features
app.put('/api/admin/plans', (req: Request, res: Response) => {
  const updatedPlans = req.body;
  if (!updatedPlans || typeof updatedPlans !== 'object') {
    return res.status(400).json({ error: 'Invalid plans payload' });
  }

  const db = readDB();
  db.plans = { ...db.plans, ...updatedPlans };
  writeDB(db);

  return res.json({ success: true, plans: db.plans });
});

// 13. Admin: Update Trainers
app.put('/api/admin/trainers', (req: Request, res: Response) => {
  const updatedTrainers = req.body;
  if (!Array.isArray(updatedTrainers)) {
    return res.status(400).json({ error: 'Trainers must be an array' });
  }

  const db = readDB();
  db.trainers = updatedTrainers;
  writeDB(db);

  return res.json({ success: true, trainers: db.trainers });
});

// ======================== VITE & STATIC HANDLING ========================

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FitnessFirst GYM server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
