import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env'), override: true });

async function resetAdmin() {
  let mongoURI = process.env.MONGODB_URI;
  console.log('Using MONGODB_URI:', mongoURI ? mongoURI.substring(0, 25) + '...' : 'NONE');

  if (!mongoURI || (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://'))) {
    console.error('Invalid MONGODB_URI scheme in .env');
    process.exit(1);
  }

  // Clean angle brackets if present
  mongoURI = mongoURI.replace(/<([^>]+)>/g, '$1');

  try {
    await mongoose.connect(mongoURI, {
      dbName: 'ai_recruitment',
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB successfully!');

    const adminSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      isActive: Boolean,
    }, { timestamps: true });

    const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

    // 1. Delete all existing admin users
    const deleteRes = await Admin.deleteMany({});
    console.log(`🗑️ Deleted ${deleteRes.deletedCount} existing admin user(s) from MongoDB.`);

    // 2. Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('AdminPassword123!', salt);

    // 3. Create fresh Super Admin user
    const newAdmin = await Admin.create({
      name: 'Super Admin',
      email: 'admin@bucksnbricks.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
    });

    console.log('✅ New Super Admin created successfully in MongoDB:');
    console.log('   ID:', newAdmin._id);
    console.log('   Email:', newAdmin.email);

    await mongoose.disconnect();
    console.log('Disconnected cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during admin reset:', err);
    process.exit(1);
  }
}

resetAdmin();
