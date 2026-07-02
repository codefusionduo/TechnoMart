import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3000;

app.use(express.json());

let transporter: nodemailer.Transporter | null = null;
nodemailer.createTestAccount().then((account) => {
  transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });
  console.log('Ethereal Mail test account created for email verification.');
}).catch(console.error);

// --- Database & Models ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String }
});
const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true } // 'phone' or 'earbud'
});
const Product = mongoose.model('Product', productSchema);

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required' });
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, isVerified: true });
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});



app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Product Routes ---
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin route to seed products (for testing/setup)
app.post('/api/products/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const seedProducts = [
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Titanium exterior, 200MP camera, Snapdragon 8 Gen 3.',
        price: 129999,
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=400',
        category: 'phone'
      },
      {
        name: 'Samsung Galaxy Z Fold 5',
        description: 'Unfold your world with the most advanced foldable screen.',
        price: 154999,
        image: '/src/assets/images/regenerated_image_1782915266209.png',
        category: 'phone'
      },
      {
        name: 'Samsung Galaxy Buds2 Pro',
        description: 'Ultimate Hi-Fi sound in your ear. Active noise cancellation.',
        price: 17999,
        image: 'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?auto=format&fit=crop&q=80&w=400',
        category: 'earbud'
      },
      {
        name: 'Samsung Galaxy A54 5G',
        description: 'Awesome screen, awesome camera, long lasting battery life.',
        price: 38999,
        image: '/src/assets/images/regenerated_image_1782915473517.png',
        category: 'phone'
      },
       {
        name: 'Samsung Galaxy Buds FE',
        description: 'Your everyday audio companion. Ergonomic comfort and rich sound.',
        price: 7999,
        image: '/src/assets/images/regenerated_image_1782915277060.png',
        category: 'earbud'
      },
      {
        name: 'Samsung Galaxy Tab S9 Ultra',
        description: 'Epic display. Epic performance. The largest Dynamic AMOLED 2X display.',
        price: 119999,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400',
        category: 'tablet'
      },
      {
        name: 'Samsung Galaxy Tab S9+',
        description: 'Take your inspiration further with the Galaxy Tab S9+.',
        price: 90999,
        image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&q=80&w=400',
        category: 'tablet'
      },
      {
        name: 'Samsung Galaxy Tab A9+',
        description: 'The Galaxy Tab A9+ brings you a premium tablet experience at an incredible value.',
        price: 20999,
        image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&q=80&w=400',
        category: 'tablet'
      },
      {
        name: 'Samsung Galaxy Watch 6 Classic',
        description: 'Keep your goals on track and look good doing it with the return of the iconic rotating bezel.',
        price: 36999,
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=400',
        category: 'accessory'
      },
      {
        name: 'Samsung 45W Power Adapter',
        description: 'Super Fast Charging 2.0 to keep you connected.',
        price: 3499,
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=400',
        category: 'accessory'
      },
      {
        name: 'Samsung Galaxy SmartTag2',
        description: 'Keep track of the things that matter most.',
        price: 2499,
        image: '/src/assets/images/regenerated_image_1782915287017.webp',
        category: 'accessory'
      }
    ];
    await Product.insertMany(seedProducts);
    res.json({ message: 'Products seeded successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error during seeding' });
  }
});

// --- Admin Middleware ---
const isAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const user = await User.findById(decoded.id);
    if (!user || (user.email !== 'codefusionduo@gmail.com' && user.email !== 'aahanamagar267@gmail.com')) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// --- Admin Routes ---
app.get('/api/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/products/:id', isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/products', isAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/admin/products/:id', isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

async function startServer() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
      
      // Auto-seed for development
      const count = await Product.countDocuments();
      if (count > 0) {
        await Product.deleteMany({});
      }
      
      const seedProducts = [
        {
          name: 'Samsung Galaxy S24 Ultra',
          description: 'Titanium exterior, 200MP camera, Snapdragon 8 Gen 3.',
          price: 129999,
          image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=400',
          category: 'phone'
        },
        {
          name: 'Samsung Galaxy Z Fold 5',
          description: 'Unfold your world with the most advanced foldable screen.',
          price: 154999,
          image: '/src/assets/images/regenerated_image_1782915266209.png',
          category: 'phone'
        },
        {
          name: 'Samsung Galaxy Buds2 Pro',
          description: 'Ultimate Hi-Fi sound in your ear. Active noise cancellation.',
          price: 17999,
          image: 'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?auto=format&fit=crop&q=80&w=400',
          category: 'earbud'
        },
        {
          name: 'Samsung Galaxy A54 5G',
          description: 'Awesome screen, awesome camera, long lasting battery life.',
          price: 38999,
          image: '/src/assets/images/regenerated_image_1782915473517.png',
          category: 'phone'
        },
         {
          name: 'Samsung Galaxy Buds FE',
          description: 'Your everyday audio companion. Ergonomic comfort and rich sound.',
          price: 7999,
          image: '/src/assets/images/regenerated_image_1782915277060.png',
          category: 'earbud'
        },
        {
          name: 'Samsung Galaxy Tab S9 Ultra',
          description: 'Epic display. Epic performance. The largest Dynamic AMOLED 2X display.',
          price: 119999,
          image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400',
          category: 'tablet'
        },
        {
          name: 'Samsung Galaxy Tab S9+',
          description: 'Take your inspiration further with the Galaxy Tab S9+.',
          price: 90999,
          image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&q=80&w=400',
          category: 'tablet'
        },
        {
          name: 'Samsung Galaxy Tab A9+',
          description: 'The Galaxy Tab A9+ brings you a premium tablet experience at an incredible value.',
          price: 20999,
          image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&q=80&w=400',
          category: 'tablet'
        },
        {
          name: 'Samsung Galaxy Watch 6 Classic',
          description: 'Keep your goals on track and look good doing it with the return of the iconic rotating bezel.',
          price: 36999,
          image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=400',
          category: 'accessory'
        },
        {
          name: 'Samsung 45W Power Adapter',
          description: 'Super Fast Charging 2.0 to keep you connected.',
          price: 3499,
          image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=400',
          category: 'accessory'
        },
        {
          name: 'Samsung Galaxy SmartTag2',
          description: 'Keep track of the things that matter most.',
          price: 2499,
          image: '/src/assets/images/regenerated_image_1782915287017.webp',
          category: 'accessory'
        }
      ];
      await Product.insertMany(seedProducts);
      console.log('Database seeded with products on startup');
    } catch (err) {
      console.error('MongoDB connection error:', err);
    }
  } else {
    console.warn('MONGODB_URI not found in environment. Database operations will fail.');
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // For Express 4.x
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
