const { db } = require('@vercel/postgres');
const {
  invoices,
  customers,
  revenue,
  users,
  fieldwork_comment_groups,
  fieldwork_comments,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedInvoices(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "invoices" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL,
    amount INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    date DATE NOT NULL
  );
`;

    console.log(`Created "invoices" table`);

    // Insert data into the "invoices" table
    const insertedInvoices = await Promise.all(
      invoices.map(
        (invoice) => client.sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      createTable,
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedCustomers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "customers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "customers" table`);

    // Insert data into the "customers" table
    const insertedCustomers = await Promise.all(
      customers.map(
        (customer) => client.sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      createTable,
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedRevenue(client) {
  try {
    // Create the "revenue" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `;

    console.log(`Created "revenue" table`);

    // Insert data into the "revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function seedFieldCommentGroup(client) {
  try {
    // Create the "field_comment_group" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS field_comment_group (
        id SERIAL PRIMARY KEY,
        research_id INT NOT NULL,
        comment_group_type INT NOT NULL,
        comment_group_name VARCHAR(20) NOT NULL,
        is_internal BOOLEAN NOT NULL,
        status INT NOT NULL,
        created TIMESTAMP,
        created_user INT NOT NULL,
        modified TIMESTAMP,
        modified_user INT NOT NULL
      );
    `;

    console.log(`Created "field_comment_group" table`);

    // Insert data into the "field_comment_group" table
    const insertedData = await Promise.all(
      fieldwork_comment_groups.map(
        (item) => client.sql`
          INSERT INTO field_comment_group (
            research_id,
            comment_group_type,
            comment_group_name,
            is_internal,
            status,
            created_user,
            modified_user
          )
          VALUES (
            ${item.research_id},
            ${item.comment_group_type},
            ${item.comment_group_name},
            ${item.is_internal},
            ${item.status},
            ${item.created_user},
            ${item.modified_user}
          );
        `,
      ),
    );

    console.log(`Seeded ${insertedData.length} records into field_comment_group`);

    return {
      createTable,
      data: insertedData,
    };
  } catch (error) {
    console.error('Error seeding field_comment_group:', error);
    throw error;
  }
}

async function seedFieldworkComment(client) {
  try {
    // Create the "fieldwork_comment" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS fieldwork_comment (
        id SERIAL PRIMARY KEY,
        fieldwork_comment_group_id INT NOT NULL,
        user_name VARCHAR(20) NOT NULL,
        status INT NOT NULL,
        comment TEXT NOT NULL,
        created TIMESTAMP,
        created_user INT NOT NULL,
        modified TIMESTAMP
      );
    `;

    console.log(`Created "fieldwork_comment" table`);

    // Insert data into the "fieldwork_comment" table
    const insertedData = await Promise.all(
      fieldwork_comments.map(
        (item) => client.sql`
          INSERT INTO fieldwork_comment (
            fieldwork_comment_group_id,
            user_name,
            status,
            comment,
            created_user
          )
          VALUES (
            ${item.fieldwork_comment_group_id},
            ${item.user_name},
            ${item.status},
            ${item.comment},
            ${item.created_user}
          );
        `,
      ),
    );

    console.log(`Seeded ${insertedData.length} records into fieldwork_comment`);

    return {
      createTable,
      data: insertedData,
    };
  } catch (error) {
    console.error('Error seeding fieldwork_comment:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedCustomers(client);
  await seedInvoices(client);
  await seedRevenue(client);
  await seedFieldCommentGroup(client);
  await seedFieldworkComment(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
