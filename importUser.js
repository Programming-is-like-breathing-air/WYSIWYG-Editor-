const { Client } = require('pg');
const fs = require('fs');

// PostgreSQL client setup
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'prisma',
    password: '1122',
    port: 5432,
});

// Connect to your database
client.connect();

// Read JSON file
const users = JSON.parse(fs.readFileSync('./users.json', 'utf8'));

// Function to insert task data
async function insertTask(user) {
    const { id, name, email, password } = user;
    const query = 'INSERT INTO "User" (id, name, email, password) VALUES ($1, $2, $3, $4)';
    const values = [id, name, email, password];

    try {
        await client.query(query, values);
        console.log(`Inserted: ${id}`);
    } catch (err) {
        console.error(`Error inserting ${id}: ${err}`);
    }
}

// Insert each task into the database
users.forEach(user => {
    insertTask(user).then(() => {
        if (users.indexOf(user) === users.length - 1) {
            client.end();
        }
    });
});
