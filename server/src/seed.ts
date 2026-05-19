import { connectDb } from "./config/db.js";
import { Lead } from "./models/Lead.js";
import { User } from "./models/User.js";

const seed = async (): Promise<void> => {
  await connectDb();
  await Promise.all([Lead.deleteMany({}), User.deleteMany({})]);

  const admin = await User.create({
    name: "Admin User",
    email: "admin@smartleads.dev",
    password: "Password123",
    role: "admin"
  });

  await User.create({
    name: "Sales User",
    email: "sales@smartleads.dev",
    password: "Password123",
    role: "sales"
  });

  const names = ["Rahul Sharma", "Aarav Mehta", "Priya Nair", "Nisha Kapoor", "Kabir Khan", "Sara Thomas"];
  const statuses = ["New", "Contacted", "Qualified", "Lost"] as const;
  const sources = ["Website", "Instagram", "Referral"] as const;

  await Lead.insertMany(
    Array.from({ length: 24 }, (_, index) => ({
      name: names[index % names.length],
      email: `lead${index + 1}@example.com`,
      status: statuses[index % statuses.length],
      source: sources[index % sources.length],
      notes: "Seeded lead for dashboard testing.",
      owner: admin._id,
      createdAt: new Date(Date.now() - index * 86_400_000)
    }))
  );

  console.log("Seed complete. Admin: admin@smartleads.dev / Password123");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
