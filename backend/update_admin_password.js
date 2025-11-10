import pool from './src/Repository/db.js';
import bcrypt from 'bcrypt';

const updateAdminPassword = async () => {
  try {
    const adminEmail = 'Adm4.4.codes22.0';
    const newPassword = 'Paritehaida!.12.23';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await pool.query(
      'UPDATE usuarios SET senha = ? WHERE email = ?',
      [hashedPassword, adminEmail]
    );

    if (result.affectedRows > 0) {
      console.log('Admin password updated successfully');
    } else {
      console.log('Admin user not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error updating admin password:', error);
    process.exit(1);
  }
};

updateAdminPassword();
