-- Créer un utilisateur de test dans la base mediconnect
INSERT INTO "Users" ("Id", "FullName", "Email", "PasswordHash", "Role", "IsActive", "CreatedAt")
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Test Patient',
    'patient@test.com',
    '$2a$11$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYkWqWqXq2',
    0,
    true,
    NOW()
)
ON CONFLICT ("Email") DO NOTHING;

-- Créer un docteur de test
INSERT INTO "Users" ("Id", "FullName", "Email", "PasswordHash", "Role", "IsActive", "CreatedAt")
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'Dr. Test',
    'doctor@test.com',
    '$2a$11$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYkWqWqXq2',
    2,
    true,
    NOW()
)
ON CONFLICT ("Email") DO NOTHING;
