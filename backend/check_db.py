import psycopg

# ===============================
# CONNECTION
# ===============================
conn = psycopg.connect(
    host="localhost",          # SSH tunnel must be running
    port=5432,
    user="karthik_user",
    password="Strong@123",
    dbname="karthik_electrical"
)

cur = conn.cursor()

# ===============================
# CREATE TABLE (if not exists)
# ===============================
cur.execute("""
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

conn.commit()
print("✅ Table 'customers' ready")

# ===============================
# CREATE (INSERT)
# ===============================
cur.execute("""
INSERT INTO customers (name, phone, address)
VALUES (%s, %s, %s)
RETURNING id;
""", ("Suresh Kumar", "9123456780", "Chennai"))

customer_id = cur.fetchone()[0]
conn.commit()
print("✅ Created Customer ID:", customer_id)

# ===============================
# READ
# ===============================
cur.execute("SELECT * FROM customers WHERE id = %s;", (customer_id,))
print("📖 Read:", cur.fetchone())

# ===============================
# UPDATE
# ===============================
cur.execute("""
UPDATE customers
SET address = %s
WHERE id = %s;
""", ("Bangalore", customer_id))

conn.commit()
print("✏️ Updated Address")

# ===============================
# DELETE
# ===============================
cur.execute("DELETE FROM customers WHERE id = %s;", (customer_id,))
conn.commit()
print("🗑️ Deleted Customer")

cur.close()
conn.close()

print("🎉 All CRUD operations completed successfully!")