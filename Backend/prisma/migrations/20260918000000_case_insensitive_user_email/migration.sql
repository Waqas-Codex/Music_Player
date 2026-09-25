-- Prevent accounts that differ only by email letter casing.
CREATE UNIQUE INDEX "User_email_lower_key" ON "User" (LOWER("email"));