USE teamforge_db;
GO
UPDATE dbo.users 
SET passwordHash = '$argon2id$v=19$m=65536,t=3,p=4$gs+ZuxCbVAQz55Ih4Zw6fQ$kJu7pgDmosdmXSEEFzFDZnveIsglNqxLf9K6Vq2YKXA'
WHERE email = 'joe.robinson@gmail.com';
GO
