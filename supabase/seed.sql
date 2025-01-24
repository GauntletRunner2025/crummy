-- Create default users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data)
VALUES 
  -- Customers
  (gen_random_uuid(), 'customer1@example.com', crypt('customer123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'),
  (gen_random_uuid(), 'customer2@example.com', crypt('customer123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'),
  -- Support Agents
  (gen_random_uuid(), 'agent1@example.com', crypt('agent123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'),
  (gen_random_uuid(), 'agent2@example.com', crypt('agent123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'),
  -- Supervisor
  (gen_random_uuid(), 'supervisor@example.com', crypt('supervisor123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'),
  -- HR
  (gen_random_uuid(), 'hr@example.com', crypt('hr123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}');