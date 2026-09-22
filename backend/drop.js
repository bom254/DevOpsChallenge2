require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  try {
    await mongoose.connection.db
      .collection('registrations')
      .dropIndex('registerId_1');
    console.log('Dropped registerId_1');
  } catch (err) {
    console.log('Index may not exist:', err.message);
  }
  await mongoose.disconnect();
})();