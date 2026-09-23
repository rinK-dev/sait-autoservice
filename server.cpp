/*
AutoService backend: подключи Crow + PostgreSQL(libpqxx) + OpenSSL.
ВАЖНО: права проверяются сервером, а не JS.

Правила:
1) Если users пустая: первая регистрация -> role=manager.
2) manager POST /api/manager/invitations создаёт одноразовый токен.
3) ссылка: /register.html?token=...&email=...
4) приглашённый сам задаёт пароль.
5) сервер создаёт role=mechanic.
6) только manager может создавать/блокировать mechanics.
7) mechanic может читать клиентов и создавать service_records.
8) client получает только cars.client_id = его user id.
9) пароли хранятся только как hash.

Пример SQL первой регистрации:
INSERT INTO users(name,email,password_hash,role)
SELECT $1,$2,$3,'manager'
WHERE NOT EXISTS(SELECT 1 FROM users);

Этот файл — backend-скелет, потому что конкретный код подключения зависит
от твоей существующей БД и её таблиц.
*/
#include <iostream>
int main(){std::cout<<"AutoService C++ API: connect Crow + PostgreSQL here.\n";}