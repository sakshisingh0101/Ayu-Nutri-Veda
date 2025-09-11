-- Insert admin user (no conflict handling since table doesn't have unique constraint)
INSERT INTO users (Email, FullName, User_type, Password, PhoneNumber) 
VALUES ('soumya30garg@gmail.com', 'Admin User', 'admin', 'soumya30garg', 1234567890);