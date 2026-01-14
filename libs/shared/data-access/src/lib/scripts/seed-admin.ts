import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { hash } from 'argon2';
import { User } from '../entities/user.entity';

dotenv.config();

const seed = async () => {
    console.log('--- Admin Seeding Started ---');

    const dataSource = new DataSource({
        type: 'mssql',
        host: process.env['DB_HOST'] || 'localhost',
        port: parseInt(process.env['DB_PORT'] || '1433', 10),
        username: process.env['DB_USER'] || 'sa',
        password: process.env['DB_PASSWORD'] || process.env['SA_PASSWORD'] || process.env['MSSQL_SA_PASSWORD'] || 'YourStrong!Passw0rd',
        database: process.env['DB_NAME'] || 'master',
        entities: [User],
        synchronize: false,
        options: {
            encrypt: false,
            trustServerCertificate: true,
        },
    });

    try {
        await dataSource.initialize();
        console.log('Database connection established.');

        const userRepository = dataSource.getRepository(User);
        
        const email = 'admin';
        const password = 'admin';
        const passwordHash = await hash(password);

        let user = await userRepository.findOne({ where: { email } });
        
        if (user) {
            console.log('User "admin" already exists. Updating password and ensuring superadmin status...');
            user.passwordHash = passwordHash;
            user.isSuperAdmin = true;
        } else {
            console.log('Creating new "admin" user...');
            user = userRepository.create({
                email,
                passwordHash,
                isSuperAdmin: true,
            });
        }

        await userRepository.save(user);
        console.log('Admin user successfully seeded.');

        await dataSource.destroy();
        console.log('--- Admin Seeding Completed ---');
        process.exit(0);
    } catch (error: any) {
        console.error('Seeding failed:', error.message);
        process.exit(1);
    }
};

seed();
