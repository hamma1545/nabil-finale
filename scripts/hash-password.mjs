import { randomBytes, pbkdf2Sync } from "node:crypto";
const password = process.argv[2];
if (!password) { console.error("Usage: node scripts/hash-password.mjs 'password'"); process.exit(1); }
const salt = randomBytes(16).toString("hex");
const digest = pbkdf2Sync(password, salt, 210000, 32, "sha256").toString("hex");
console.log(`pbkdf2$210000$${salt}$${digest}`);
