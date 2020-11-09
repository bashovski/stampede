-- Creates "users" table
create table if not exists "users" (
    "id" uuid not null,
    "email" varchar(128) not null,
    "username" varchar(64) not null,
    "password" varchar(256) not null,
    "avatar" varchar(128),
    "date_of_birth" timestamptz not null,
    "created_at" timestamptz not null default CURRENT_TIMESTAMP,
    "updated_at" timestamptz not null default CURRENT_TIMESTAMP
);

alter table "users" add constraint "id" primary key ("id");
alter table "users" add constraint "email" unique ("email");
alter table "users" add constraint "username" unique ("username")

------------------------------------------------------------------------------------------------------------------------

-- Creates sessions table
create table if not exists "sessions" (
    "id" uuid not null, "user_id" uuid not null,
    "token" varchar(128) not null, "expires_at" timestamptz not null,
    "created_at" timestamptz not null default CURRENT_TIMESTAMP,
    "updated_at" timestamptz not null default CURRENT_TIMESTAMP
);

alter table "sessions" add constraint "id" primary key ("id")
