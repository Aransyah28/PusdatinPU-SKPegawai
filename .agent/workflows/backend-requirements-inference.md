---
description: Reverse-engineer frontend components to define backend API endpoints and database schema
---

# Backend Requirements Inference Workflow

This workflow analyzes sliced frontend components to generate backend implementation tickets.

---

## STEP 1: READ OPERATIONS SCAN (Data Retrieval)

### 1.1 Identify Displayed Data

Scan JSX for data bindings:

```tsx
// Look for these patterns:
{
  user.name;
}
{
  data.total;
}
{
  stats.visitors;
}
{
  items.map((item) => <div>{item.title}</div>);
}
```

### 1.2 Document Data Requirements

| UI Element | Data Path             | Type     | Required |
| ---------- | --------------------- | -------- | -------- |
| Header     | `user.name`           | string   | ✓        |
| Stats Card | `stats.totalVisitors` | number   | ✓        |
| List       | `items[].title`       | string   | ✓        |
| List       | `items[].createdAt`   | ISO Date | ✓        |

### 1.3 Output: GET Endpoint

````markdown
### Endpoint: `GET /api/[resource]`

**Response DTO:**

```json
{
  "items": [
    {
      "id": "string (uuid)",
      "title": "string",
      "createdAt": "string (ISO 8601)"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```
````

---

## STEP 2: WRITE OPERATIONS SCAN (Data Mutation)

### 2.1 Identify Form Inputs

```tsx
// Look for:
<FormTextField name="email" />
<Input type="number" />
<Select options={...} />
<Checkbox />
<DatePicker />
```

### 2.2 Identify Mutation Triggers

```tsx
// Look for:
onSubmit={handleSubmit}
onClick={handleDelete}
onSave={() => ...}
```

### 2.3 Action Intent Mapping

| Handler                  | HTTP Method | Intent |
| ------------------------ | ----------- | ------ |
| `handleSubmit` (no ID)   | POST        | Create |
| `handleSubmit` (with ID) | PUT/PATCH   | Update |
| `handleDelete`           | DELETE      | Delete |

### 2.4 Output: Mutation Endpoints

````markdown
### Endpoint: `POST /api/[resource]`

**Request Body:**

```json
{
  "name": "string",
  "email": "string (email format)",
  "age": "number (integer)",
  "birthDate": "string (ISO 8601)"
}
```
````

### Endpoint: `PUT /api/[resource]/:id`

**Request Body:** Same as POST

### Endpoint: `DELETE /api/[resource]/:id`

**Request Body:** None

````

---

## STEP 3: VALIDATION & SCHEMA INFERENCE

### 3.1 Frontend Validation → Backend Rules

| Frontend Attribute | Backend Rule |
|--------------------|--------------|
| `required` | NOT NULL |
| `type="email"` | Valid email format |
| `maxLength={100}` | VARCHAR(100) / max 100 chars |
| `min={0}` | >= 0 |
| `pattern="..."` | Regex validation |
| `unique` (context) | UNIQUE constraint |

### 3.2 Type Inference

| Input Type | Inferred DB Type |
|------------|------------------|
| `type="text"` | VARCHAR / TEXT |
| `type="number"` | INTEGER / FLOAT |
| `type="email"` | VARCHAR + email check |
| `<DatePicker />` | TIMESTAMP / DATE |
| `<Checkbox />` | BOOLEAN |
| `<Select />` | ENUM or FK |

### 3.3 Output: Database Schema

```sql
CREATE TABLE [resource] (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  age         INTEGER CHECK (age >= 0),
  birth_date  DATE,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
````

---

## STEP 4: OUTPUT FORMAT

Generate a **Backend Implementation Ticket** in this format:

```markdown
# Backend Ticket: [Feature Name]

## Database Schema

| Column     | Type         | Constraints      |
| ---------- | ------------ | ---------------- |
| id         | UUID         | PK, auto-gen     |
| name       | VARCHAR(100) | NOT NULL         |
| email      | VARCHAR(255) | NOT NULL, UNIQUE |
| created_at | TIMESTAMP    | DEFAULT NOW()    |

## API Endpoints

### GET /api/[resource]

- **Description:** List all [resource]
- **Query Params:** `page`, `limit`, `search`
- **Response:** `{ items: [...], total, page, limit }`

### POST /api/[resource]

- **Description:** Create new [resource]
- **Body:** `{ name, email, ... }`
- **Response:** Created object with ID

### PUT /api/[resource]/:id

- **Description:** Update [resource]
- **Body:** `{ name, email, ... }`
- **Response:** Updated object

### DELETE /api/[resource]/:id

- **Description:** Delete [resource]
- **Response:** 204 No Content

## Validation Rules

| Field | Rules                         |
| ----- | ----------------------------- |
| name  | Required, max 100 chars       |
| email | Required, valid email, unique |
| age   | Optional, integer >= 0        |
```

---

## CHECKLIST

- [ ] All displayed data mapped to GET response
- [ ] All form fields mapped to POST/PUT body
- [ ] All handlers mapped to endpoints
- [ ] Frontend validations translated to backend rules
- [ ] Database schema includes all fields
- [ ] Proper data types inferred
