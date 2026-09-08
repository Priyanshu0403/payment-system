// Promotes an existing user to admin by email.
// Usage: node scripts/createAdmin.js user@example.com
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

async function run() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: node scripts/createAdmin.js <email>");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { role: "admin" },
    { new: true }
  );

  if (!user) {
    console.error(`No user found with email ${email}. Register the account first.`);
  } else {
    console.log(`${user.email} is now an admin.`);
  }

  await mongoose.disconnect();
}

run();
