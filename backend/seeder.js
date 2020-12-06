import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);
    console.log('Data imported!'.green.bold);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.bold);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data destroyed!'.red.bold);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.bold);
  }
};

// Checking if the flag at the end of command 'node backend/seeder -flag' is '-d'.
// If it is, destroy data, else import.
// Check npm scripts in package.json.
process.argv[2] === '-d' ? destroyData() : importData();
