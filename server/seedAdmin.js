const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdminModel = require('./model/Admin_model');

const URI = 'mongodb://127.0.0.1:27017/hiresmart';
const DEFAULT_EMAIL = 'admin@gmail.com';
const DEFAULT_PASSWORD = 'password';

const seedAdmin = async () => {
    try {
        await mongoose.connect(URI);

        const existingAdmin = await AdminModel.findOne({ email: DEFAULT_EMAIL });
        if (existingAdmin) {
            console.log(`Admin already exists: ${DEFAULT_EMAIL}`);
            return;
        }

        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
        await AdminModel.create({
            email: DEFAULT_EMAIL,
            password: hashedPassword,
        });

        console.log(`Admin created: ${DEFAULT_EMAIL}`);
    } catch (error) {
        console.error('Failed to seed admin:', error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

seedAdmin();
