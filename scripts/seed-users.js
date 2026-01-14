const axios = require('axios');

async function seed() {
    console.log('🌱 Seeding Users...');
    const API_URL = 'http://localhost:3000/api';
    
    // Login as Admin (assuming default credentials from setup)
    // Note: If no admin exists, we might need a different approach or manual registration.
    // For now, attempting to create usage via Auth endpoint if it exists, or just direct if unsecured.
    
    const users = [
        { email: 'alice@example.com', password: 'password123', isSuperAdmin: false },
        { email: 'bob@example.com', password: 'password123', isSuperAdmin: false },
        { email: 'charlie@example.com', password: 'password123', isSuperAdmin: true },
    ];

    for (const u of users) {
        try {
            // We use the auth/register endpoint typically available
            await axios.post(`${API_URL}/auth/register`, {
                email: u.email,
                password: u.password,
            });
            console.log(`✅ Created: ${u.email}`);
        } catch (error) {
            if (error.response?.status === 409) {
                console.log(`⚠️  Exists: ${u.email}`);
            } else {
                console.error(`❌ Failed: ${u.email}`, error.message);
            }
        }
    }
}

seed();
