import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../entities/user.entity';
// Import other entities as they are added

dotenv.config();

const heal = async () => {
    console.log('--- CLI Schema Healing Started ---');

    const dataSource = new DataSource({
        type: 'mssql',
        host: process.env['DB_HOST'] || 'localhost',
        port: parseInt(process.env['DB_PORT'] || '1433', 10),
        username: process.env['DB_USER'] || 'sa',
        password: process.env['DB_PASSWORD'] || process.env['SA_PASSWORD'] || process.env['MSSQL_SA_PASSWORD'] || 'YourStrong!Passw0rd',
        database: process.env['DB_NAME'] || 'master',
        entities: [User],
        synchronize: true, // CLI Heal allows sync in dev
        options: {
            encrypt: false,
            trustServerCertificate: true,
        },
    });

    try {
        await dataSource.initialize();
        console.log('Database connection established.');

        // In dev, sync is enough. In prod, we'd run migrations.
        await dataSource.synchronize();
        console.log('Schema synchronization successful.');

        await dataSource.destroy();
        console.log('--- CLI Schema Healing Completed ---');
        process.exit(0);
    } catch (error: any) {
        console.error('Heal failed:', error.message);
        process.exit(1);
    }
};

heal();
