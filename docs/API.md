# Smart Leads API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require:

```http
Authorization: Bearer <jwt>
```

## Health

`GET /health`

Returns API status.

## Auth

### Register

`POST /auth/register`

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "Password123",
  "role": "admin"
}
```

Roles: `admin`, `sales`. Returns a user object and JWT token.

### Login

`POST /auth/login`

```json
{
  "email": "admin@example.com",
  "password": "Password123"
}
```

### Current User

`GET /auth/me`

Protected. Returns the authenticated user.

## Leads

Lead fields:

- `name`
- `email`
- `status`: `New`, `Contacted`, `Qualified`, `Lost`
- `source`: `Website`, `Instagram`, `Referral`
- `notes`
- `createdAt`

### List Leads

`GET /leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1&limit=10`

Query parameters:

- `status`, optional
- `source`, optional
- `search`, optional, matches name or email
- `sort`, `latest` or `oldest`
- `page`, positive integer
- `limit`, max `10`

Returns `leads` and `pagination` metadata.

### Export CSV

`GET /leads/export?status=Qualified&source=Instagram&search=Rahul`

Protected. Uses the same filters as list leads.

### Get One Lead

`GET /leads/:id`

### Create Lead

`POST /leads`

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Instagram",
  "notes": "Interested in annual plan"
}
```

Allowed roles: `admin`, `sales`.

### Update Lead

`PATCH /leads/:id`

Allowed roles: `admin`, `sales`.

### Delete Lead

`DELETE /leads/:id`

Allowed role: `admin`.
