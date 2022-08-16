//Import dotenv for database connections
import 'dotenv/config';
import pg from 'pg';

// Get the Pool class from the pg module.
const { Pool } = pg;

export class Database {
  constructor(dburl) {
    this.dburl = dburl;
  }

  async connect() {
    this.pool = new Pool({
      connectionString: this.dburl,
      ssl: { rejectUnauthorized: false }, // Required for Heroku connections
    });

    // Create the pool.
    this.client = await this.pool.connect();

    // Init the database.
    await this.init();
  }

  async init() {
    const queryText = `
      CREATE TABLE IF NOT EXISTS places (
        id varchar(30) PRIMARY KEY,
        image text,
        name varchar(30),
        description varchar(250),
        location text,
        room int,
        floor int,
        sunday bool,
        monday bool,
        tuesday bool,
        wednesday bool,
        thursday bool,
        friday bool,
        saturday bool,
        seats int,
        tables int,
        ports int,
        whiteboard bool,
        outside bool
      );
    `;
    const res = await this.client.query(queryText);
  }

  // Close the pool.
  async close() {
    this.client.release();
    await this.pool.end();
  }
}

const database = new Database(process.env.DATABASE_URL);

export { database };