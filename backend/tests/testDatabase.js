import sequelize from '../database.js';

const checkTables = async () => {
  try {
    console.log('Checking database tables...');
    const [results] = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table';"
    );
    console.log('Tables in the database:', results.map((row) => row.name));
  } catch (error) {
    console.error('Error checking tables:', error);
  } finally {
    await sequelize.close();
  }
};

checkTables();
