# CrisisChain — DBMS System Catalog (Data Dictionary)

**Database Name:** `crisischain_db`
**Character Set:** `utf8mb4`
**Collation:** `utf8mb4_unicode_ci`
**Total Tables:** 11
**Total Relationships:** 14 FK constraints

---

## 1. Table Catalog

### 1.1 `users`

| # | Column | Data Type | Nullable | Default | Constraint |
|---|---|---|---|---|---|
| 1 | `aadhar_id` | `CHAR(64)` | NO | — | `PRIMARY KEY` |
| 2 | `full_name` | `VARCHAR(150)` | NO | — | `NOT NULL` |
| 3 | `email` | `VARCHAR(255)` | NO | — | `NOT NULL`, `UNIQUE` |
| 4 | `phone_number` | `VARCHAR(15)` | NO | — | `NOT NULL` |
| 5 | `password_hash` | `VARCHAR(255)` | NO | — | `NOT NULL` |
| 6 | `role` | `ENUM` | NO | `'citizen'` | `NOT NULL` |
| 7 | `is_verified` | `BOOLEAN` | NO | `FALSE` | `NOT NULL` |
| 8 | `verified_at` | `TIMESTAMP` | YES | `NULL` | — |
| 9 | `is_active` | `BOOLEAN` | NO | `TRUE` | `NOT NULL` |
| 10 | `created_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | `NOT NULL` |
| 11 | `updated_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | `NOT NULL`, auto-updates |

- **Primary Key:** `aadhar_id`
- **Unique Keys:** `email`
- **ENUM Domain — `role`:** `'citizen'`, `'responder'`, `'admin'`
- **Note:** `aadhar_id` stores `SHA-256(raw_12_digit_aadhar)`. Raw Aadhar is never persisted.

---

### 1.2 `authority_profile`

| # | Column | Data Type | Nullable | Default | Constraint |
|---|---|---|---|---|---|
| 1 | `authority_id` | `CHAR(36)` UUID | NO | `gen_random_uuid()` | `PRIMARY KEY` |
| 2 | `aadhar_id` | `CHAR(64)` | NO | — | `NOT NULL`, `UNIQUE`, `FK → users.aadhar_id` |
| 3 | `authority_type` | `VARCHAR(80)` | NO | — | `NOT NULL` |
| 4 | `organization_name` | `VARCHAR(200)` | NO | — | `NOT NULL` |
| 5 | `credential_id` | `VARCHAR(100)` | YES | `NULL` | — |
| 6 | `credential_type` | `ENUM` | YES | `NULL` | — |
| 7 | `availability_status` | `ENUM` | NO | `'Available'` | `NOT NULL` |
| 8 | `coverage_radius_km` | `DECIMAL(6,2)` | NO | `10.00` | `NOT NULL` |
| 9 | `created_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | `NOT NULL` |
| 10 | `updated_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | `NOT NULL`, auto-updates |

- **Primary Key:** `authority_id`
- **Foreign Keys:** `aadhar_id → users.aadhar_id` (CASCADE DELETE)
- **Unique Keys:** `aadhar_id` (enforces 1:1 with `users`)
- **ENUM Domain — `credential_type`:** `'Badge'`, `'License'`, `'EmployeeID'`
- **ENUM Domain — `availability_status`:** `'Available'`, `'Busy'`, `'Offline'`

---

### 1.3 `incident_type`

| # | Column | Data Type | Nullable | Default | Constraint |
|---|---|---|---|---|---|
| 1 | `type_id` | `SMALLINT` | NO | `AUTO_INCREMENT` | `PRIMARY KEY` |
| 2 | `type_name` | `VARCHAR(100)` | NO | — | `NOT NULL`, `UNIQUE` |
| 3 | `icon_name` | `VARCHAR(50)` | YES | `NULL` | — |
| 4 | `created_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | `NOT NULL` |

- **Primary Key:** `type_id`
- **Unique Keys:** `type_name`
- **Sample Data:** `'Fire'`, `'Flood'`, `'Medical Emergency'`, `'Road Accident'`, `'Natural Disaster'`

---

### 1.4 `incident`

| # | Column | Data Type | Nullable | Default | Constraint |
|---|---|---|---|---|---|
| 1 | `incident_id` | `CHAR(36)` UUID | NO | `gen_random_uuid()` | `PRIMARY KEY` |
| 2 | `aadhar_id` | `CHAR(64)` | NO | — | `NOT NULL`, `FK → users.aadhar_id` |
| 3 | `type_id` | `SMALLINT` | NO | — | `NOT NULL`, `FK → incident_type.type_id` |
| 4 | `description` | `TEXT` | YES | `NULL` | — |
| 5 | `latitude` | `DECIMAL(9,6)` | NO | — | `NOT NULL` |
| 6 | `longitude` | `DECIMAL(9,6)` | NO | — | `NOT NULL` |
| 7 | `incident_status` | `ENUM` | NO | `'Reported'` | `NOT NULL` |
| 8 | `priority_level` | `ENUM` | NO | `'Medium'` | `NOT NULL` |
| 9 | `created_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | `NOT NULL` |
| 10 | `resolved_at` | `TIMESTAMP` | YES | `NULL` | — |
| 11 | `updated_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | `NOT NULL`, auto-updates |

- **Primary Key:** `incident_id`
- **Foreign Keys:**
  - `aadhar_id → users.aadhar_id`
  - `type_id → incident_type.type_id`
- **ENUM Domain — `incident_status`:** `'Reported'`, `'Assigned'`, `'InProgress'`, `'Resolved'`, `'Closed'`
- **ENUM Domain — `priority_level`:** `'Low'`, `'Medium'`, `'High'`, `'Critical'`
- **Derived Metric:** `response_time = resolved_at − created_at` (computed at query time, not stored)

---

### 1.5 `incident_assignment`

| # | Column | Data Type | Nullable | Default | Constraint |
|---|---|---|---|---|---|
| 1 | `assignment_id` | `CHAR(36)` UUID | NO | `gen_random_uuid()` | `PRIMARY KEY` |
| 2 | `incident_id` | `CHAR(36)` UUID | NO | — | `NOT NULL`, `FK → incident.incident_id` |
| 3 | `authority_id` | `CHAR(36)` UUID | NO | — | `NOT NULL`, `FK → authority_profile.authority_id` |
| 4 | `assignment_status` | `ENUM` | NO | `'Pending'` | `NOT NULL` |
| 5 | `assigned_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | `NOT NULL` |
| 6 | `accepted_at` | `TIMESTAMP` | YES | `NULL` | — |
| 7 | `arrived_at` | `TIMESTAMP` | YES | `NULL` | — |
| 8 | `completed_at` | `TIMESTAMP` | YES | `NULL` | — |

- **Primary Key:** `assignment_id`
- **Foreign Keys:**
  - `incident_id → incident.incident_id`
  - `authority_id → authority_profile.authority_id`
- **Unique Keys:** `(incident_id, authority_id)` — prevents duplicate assignment of same authority to same incident
- **ENUM Domain — `assignment_status`:** `'Pending'`, `'Accepted'`, `'EnRoute'`, `'Arrived'`, `'Completed'`, `'Rejected'`
- **Lifecycle Timestamps:** `assigned_at` (system wrote row) → `accepted_at` (authority confirmed) → `arrived_at` (on scene) → `completed_at` (resolved)

---

### 1.6 `incident_report_log`

| # | Column | Data Type | Nullable | Default | Constraint |
|---|---|---|---|---|---|
| 1 | `log_id` | `CHAR(36)` UUID | NO | `gen_random_uuid()` | `PRIMARY KEY` |
| 2 | `incident_id` | `CHAR(36)` UUID | NO | — | `NOT NULL`, `FK → incident.incident_id` |
| 3 | `logged_by` | `CHAR(64)` | YES | `NULL` | `FK → users.aadhar_id` |
| 4 | `log_type` | `ENUM` | NO | — | `NOT NULL` |
| 5 | `old_value` | `TEXT` | YES | `NULL` | — |
| 6 | `new_value` | `TEXT` | YES | `NULL` | — |
| 7 | `notes` | `TEXT` | YES | `NULL` | — |
| 8 | `is_system` | `BOOLEAN` | NO | `FALSE` | `NOT NULL` |
| 9 | `logged_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | `NOT NULL` |

- **Primary Key:** `log_id`
- **Foreign Keys:**
  - `incident_id → incident.incident_id` (CASCADE DELETE)
  - `logged_by → users.aadhar_id` (NULL = system-generated)
- **ENUM Domain — `log_type`:** `'StatusChange'`, `'AuthorityAssigned'`, `'FieldNote'`, `'EvidenceAdded'`, `'ResolutionSummary'`, `'SystemEvent'`
- **Append-Only Rule:** No `UPDATE` or `DELETE` permitted on this table (enforced at application layer). Every change creates a new row.
- **Indexes:** `INDEX idx_log_incident (incident_id, logged_at DESC)`

---

### 1.7 `resource_center`

| # | Column | Data Type | Nullable | Default | Constraint |
|---|---|---|---|---|---|
| 1 | `center_id` | `CHAR(36)` UUID | NO | `gen_random_uuid()` | `PRIMARY KEY` |
| 2 | `name` | `VARCHAR(200)` | NO | — | `NOT NULL` |
| 3 | `center_type` | `ENUM` | NO | — | `NOT NULL` |
| 4 | `latitude` | `DECIMAL(9,6)` | NO | — | `NOT NULL` |
| 5 | `longitude` | `DECIMAL(9,6)` | NO | — | `NOT NULL` |
| 6 | `address` | `TEXT` | NO | — | `NOT NULL` |
| 7 | `contact_number` | `VARCHAR(15)` | YES | `NULL` | — |
| 8 | `created_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | `NOT NULL` |
| 9 | `updated_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | `NOT NULL`, auto-updates |

- **Primary Key:** `center_id`
- **ENUM Domain — `center_type`:** `'Hospital'`, `'FireStation'`, `'Police'`, `'Military'`, `'NGO'`, `'Other'`

---

### 1.8 `resource`

| # | Column | Data Type | Nullable | Default | Constraint |
|---|---|---|---|---|---|
| 1 | `resource_id` | `CHAR(36)` UUID | NO | `gen_random_uuid()` | `PRIMARY KEY` |
| 2 | `center_id` | `CHAR(36)` UUID | NO | — | `NOT NULL`, `FK → resource_center.center_id` |
| 3 | `resource_type` | `VARCHAR(100)` | NO | — | `NOT NULL` |
| 4 | `quantity_available` | `INT` | NO | `0` | `NOT NULL`, `CHECK ≥ 0` |
| 5 | `last_updated` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | `NOT NULL`, auto-updates |

- **Primary Key:** `resource_id`
- **Foreign Keys:** `center_id → resource_center.center_id`
- **Check Constraints:** `quantity_available >= 0`
- **Note:** Deployment tracking is managed by the center externally. This table reflects only reported available stock.

---

### 1.9 `authority_live_location`

| # | Column | Data Type | Nullable | Default | Constraint |
|---|---|---|---|---|---|
| 1 | `location_id` | `CHAR(36)` UUID | NO | `gen_random_uuid()` | `PRIMARY KEY` |
| 2 | `authority_id` | `CHAR(36)` UUID | NO | — | `NOT NULL`, `FK → authority_profile.authority_id` |
| 3 | `incident_id` | `CHAR(36)` UUID | YES | `NULL` | `FK → incident.incident_id` |
| 4 | `latitude` | `DECIMAL(9,6)` | NO | — | `NOT NULL` |
| 5 | `longitude` | `DECIMAL(9,6)` | NO | — | `NOT NULL` |
| 6 | `recorded_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | `NOT NULL` |

- **Primary Key:** `location_id`
- **Foreign Keys:**
  - `authority_id → authority_profile.authority_id` (CASCADE DELETE)
  - `incident_id → incident.incident_id` (NULL = not currently on a job)
- **Indexes:** `INDEX idx_authority_latest (authority_id, recorded_at DESC)`
- **Usage:** Nearest-agency finder reads the latest row per authority and computes distance to `incident.latitude / incident.longitude`

---

### 1.10 `notification`

| # | Column | Data Type | Nullable | Default | Constraint |
|---|---|---|---|---|---|
| 1 | `notification_id` | `CHAR(36)` UUID | NO | `gen_random_uuid()` | `PRIMARY KEY` |
| 2 | `incident_id` | `CHAR(36)` UUID | YES | `NULL` | `FK → incident.incident_id` |
| 3 | `notification_type` | `ENUM` | NO | — | `NOT NULL` |
| 4 | `message` | `TEXT` | YES | `NULL` | — |
| 5 | `status` | `ENUM` | NO | `'Pending'` | `NOT NULL` |
| 6 | `sent_at` | `TIMESTAMP` | YES | `NULL` | — |
| 7 | `created_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | `NOT NULL` |

- **Primary Key:** `notification_id`
- **Foreign Keys:** `incident_id → incident.incident_id` (SET NULL on delete)
- **ENUM Domain — `notification_type`:** `'Alert'`, `'Assignment'`, `'StatusUpdate'`, `'Broadcast'`, `'System'`
- **ENUM Domain — `status`:** `'Pending'`, `'Sent'`, `'Failed'`

---

### 1.11 `notification_recipient`

| # | Column | Data Type | Nullable | Default | Constraint |
|---|---|---|---|---|---|
| 1 | `id` | `CHAR(36)` UUID | NO | `gen_random_uuid()` | `PRIMARY KEY` |
| 2 | `notification_id` | `CHAR(36)` UUID | NO | — | `NOT NULL`, `FK → notification.notification_id` |
| 3 | `aadhar_id` | `CHAR(64)` | NO | — | `NOT NULL`, `FK → users.aadhar_id` |
| 4 | `is_read` | `BOOLEAN` | NO | `FALSE` | `NOT NULL` |
| 5 | `read_at` | `TIMESTAMP` | YES | `NULL` | — |

- **Primary Key:** `id`
- **Foreign Keys:**
  - `notification_id → notification.notification_id` (CASCADE DELETE)
  - `aadhar_id → users.aadhar_id` (CASCADE DELETE)
- **Unique Keys:** `(notification_id, aadhar_id)` — one recipient row per user per notification

---

## 2. Primary Key Registry

| Table | Primary Key | Type | Strategy |
|---|---|---|---|
| `users` | `aadhar_id` | `CHAR(64)` | Natural (SHA-256 of Aadhar number) |
| `authority_profile` | `authority_id` | `CHAR(36)` | Generated UUID |
| `incident_type` | `type_id` | `SMALLINT` | Auto-increment integer |
| `incident` | `incident_id` | `CHAR(36)` | Generated UUID |
| `incident_assignment` | `assignment_id` | `CHAR(36)` | Generated UUID |
| `incident_report_log` | `log_id` | `CHAR(36)` | Generated UUID |
| `resource_center` | `center_id` | `CHAR(36)` | Generated UUID |
| `resource` | `resource_id` | `CHAR(36)` | Generated UUID |
| `authority_live_location` | `location_id` | `CHAR(36)` | Generated UUID |
| `notification` | `notification_id` | `CHAR(36)` | Generated UUID |
| `notification_recipient` | `id` | `CHAR(36)` | Generated UUID |

---

## 3. Foreign Key Registry

| # | Table | Column | References | On Delete |
|---|---|---|---|---|
| 1 | `authority_profile` | `aadhar_id` | `users.aadhar_id` | CASCADE |
| 2 | `incident` | `aadhar_id` | `users.aadhar_id` | RESTRICT |
| 3 | `incident` | `type_id` | `incident_type.type_id` | RESTRICT |
| 4 | `incident_assignment` | `incident_id` | `incident.incident_id` | RESTRICT |
| 5 | `incident_assignment` | `authority_id` | `authority_profile.authority_id` | RESTRICT |
| 6 | `incident_report_log` | `incident_id` | `incident.incident_id` | CASCADE |
| 7 | `incident_report_log` | `logged_by` | `users.aadhar_id` | SET NULL |
| 8 | `resource` | `center_id` | `resource_center.center_id` | RESTRICT |
| 9 | `authority_live_location` | `authority_id` | `authority_profile.authority_id` | CASCADE |
| 10 | `authority_live_location` | `incident_id` | `incident.incident_id` | SET NULL |
| 11 | `notification` | `incident_id` | `incident.incident_id` | SET NULL |
| 12 | `notification_recipient` | `notification_id` | `notification.notification_id` | CASCADE |
| 13 | `notification_recipient` | `aadhar_id` | `users.aadhar_id` | CASCADE |

---

## 4. Index Registry

| Table | Index Name | Columns | Type | Purpose |
|---|---|---|---|---|
| `users` | `PRIMARY` | `aadhar_id` | Primary | Row lookup |
| `users` | `uq_users_email` | `email` | Unique | Prevent duplicate email |
| `authority_profile` | `PRIMARY` | `authority_id` | Primary | Row lookup |
| `authority_profile` | `uq_auth_aadhar` | `aadhar_id` | Unique | Enforce 1:1 with users |
| `incident_type` | `PRIMARY` | `type_id` | Primary | Row lookup |
| `incident_type` | `uq_type_name` | `type_name` | Unique | Prevent duplicate types |
| `incident` | `PRIMARY` | `incident_id` | Primary | Row lookup |
| `incident` | `idx_incident_user` | `aadhar_id` | Standard | Find all incidents by user |
| `incident` | `idx_incident_status` | `incident_status` | Standard | Filter by status |
| `incident_assignment` | `PRIMARY` | `assignment_id` | Primary | Row lookup |
| `incident_assignment` | `uq_assign_pair` | `(incident_id, authority_id)` | Unique | Prevent duplicate assignment |
| `incident_report_log` | `PRIMARY` | `log_id` | Primary | Row lookup |
| `incident_report_log` | `idx_log_incident` | `(incident_id, logged_at DESC)` | Standard | Ordered history per incident |
| `resource_center` | `PRIMARY` | `center_id` | Primary | Row lookup |
| `resource` | `PRIMARY` | `resource_id` | Primary | Row lookup |
| `authority_live_location` | `PRIMARY` | `location_id` | Primary | Row lookup |
| `authority_live_location` | `idx_authority_latest` | `(authority_id, recorded_at DESC)` | Standard | Fastest path to latest GPS ping |
| `notification` | `PRIMARY` | `notification_id` | Primary | Row lookup |
| `notification_recipient` | `PRIMARY` | `id` | Primary | Row lookup |
| `notification_recipient` | `uq_notif_recipient` | `(notification_id, aadhar_id)` | Unique | Prevent duplicate recipient rows |

---

## 5. ENUM Domain Registry

| Table | Column | Allowed Values |
|---|---|---|
| `users` | `role` | `'citizen'`, `'responder'`, `'admin'` |
| `authority_profile` | `credential_type` | `'Badge'`, `'License'`, `'EmployeeID'` |
| `authority_profile` | `availability_status` | `'Available'`, `'Busy'`, `'Offline'` |
| `incident` | `incident_status` | `'Reported'`, `'Assigned'`, `'InProgress'`, `'Resolved'`, `'Closed'` |
| `incident` | `priority_level` | `'Low'`, `'Medium'`, `'High'`, `'Critical'` |
| `incident_assignment` | `assignment_status` | `'Pending'`, `'Accepted'`, `'EnRoute'`, `'Arrived'`, `'Completed'`, `'Rejected'` |
| `incident_report_log` | `log_type` | `'StatusChange'`, `'AuthorityAssigned'`, `'FieldNote'`, `'EvidenceAdded'`, `'ResolutionSummary'`, `'SystemEvent'` |
| `resource_center` | `center_type` | `'Hospital'`, `'FireStation'`, `'Police'`, `'Military'`, `'NGO'`, `'Other'` |
| `notification` | `notification_type` | `'Alert'`, `'Assignment'`, `'StatusUpdate'`, `'Broadcast'`, `'System'` |
| `notification` | `status` | `'Pending'`, `'Sent'`, `'Failed'` |

---

## 6. Relationship Map

```
users (aadhar_id)
│
├──[1:N]──► incident
│               │
│               ├──[N:1]──► incident_type
│               ├──[1:N]──► incident_assignment ──[N:1]──► authority_profile
│               │                                               │
│               ├──[1:N]──► incident_report_log        [1:N]──► authority_live_location
│               │
│               └──[1:N]──► notification
│                               │
│                               └──[1:N]──► notification_recipient
│                                                   │
└───────────────────────────────────────────────────┘
          (aadhar_id back to users)

resource_center
    └──[1:N]──► resource
```

---

## 7. Computed Fields (Not Stored)

| Field | Formula | Available From |
|---|---|---|
| `response_time` | `resolved_at − created_at` | `incident` |
| `time_to_accept` | `accepted_at − assigned_at` | `incident_assignment` |
| `time_to_arrive` | `arrived_at − accepted_at` | `incident_assignment` |
| `distance_to_incident` | `ST_Distance(incident.lat/lng, authority_live_location.lat/lng)` | Nearest-agency query |
