-- Insert admin user
INSERT INTO users (Email, FullName, User_type, Password, PhoneNumber) 
VALUES ('soumya30garg@gmail.com', 'Admin User', 'admin', 'soumya30garg', 1234567890)
ON CONFLICT (Email) DO UPDATE SET 
  User_type = EXCLUDED.User_type,
  Password = EXCLUDED.Password;