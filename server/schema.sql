-- ============================================================
--  CrisisChain — MySQL Database Schema
--  Database: crisischain_db
-- ============================================================

CREATE DATABASE IF NOT EXISTS crisischain_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE crisischain_db;

-- ============================================================
-- 1. USERS
--    aadhar_id = SHA-256 hash of the 12-digit Aadhar number.
--    Raw Aadhar is never stored.
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    aadhar_id     CHAR(64)     NOT NULL,
    full_name     VARCHAR(150) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    phone_number  VARCHAR(15)  NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('citizen','responder','hospital','admin') NOT NULL DEFAULT 'citizen',
    is_verified   TINYINT(1)   NOT NULL DEFAULT 0,
    verified_at   TIMESTAMP    NULL,
    is_active     TINYINT(1)   NOT NULL DEFAULT 1,
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (aadhar_id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

-- ============================================================
-- 2. AUTHORITY_PROFILE
--    One-to-one extension of users for responders / agencies.
-- ============================================================
CREATE TABLE IF NOT EXISTS authority_profile (
    authority_id        CHAR(36)     NOT NULL,
    aadhar_id           CHAR(64)     NOT NULL,
    authority_type      VARCHAR(80)  NOT NULL,
    organization_name   VARCHAR(200) NOT NULL,
    credential_id       VARCHAR(100) NULL,
    credential_type     ENUM('Badge','License','EmployeeID') NULL,
    availability_status ENUM('Available','Busy','Offline') NOT NULL DEFAULT 'Available',
    coverage_radius_km  DECIMAL(6,2) NOT NULL DEFAULT 10.00,
    created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (authority_id),
    UNIQUE KEY uq_auth_aadhar (aadhar_id),
    CONSTRAINT fk_authprofile_user
        FOREIGN KEY (aadhar_id) REFERENCES users(aadhar_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 3. INCIDENT_TYPE  (lookup / reference table)
-- ============================================================
CREATE TABLE IF NOT EXISTS incident_type (
    type_id    SMALLINT     NOT NULL AUTO_INCREMENT,
    type_name  VARCHAR(100) NOT NULL,
    icon_name  VARCHAR(50)  NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (type_id),
    UNIQUE KEY uq_type_name (type_name)
) ENGINE=InnoDB;

-- Seed standard incident types
INSERT IGNORE INTO incident_type (type_name, icon_name) VALUES
    ('Fire',               'Flame'),
    ('Flood',              'Droplets'),
    ('Medical Emergency',  'HeartPulse'),
    ('Road Accident',      'AlertTriangle'),
    ('Natural Disaster',   'Wind'),
    ('Structural Collapse','Building'),
    ('Hazardous Material', 'Radiation');

-- ============================================================
-- 4. INCIDENT
--    Core emergency record. Coordinates (lat/lng) anchor the
--    Nearest-Agency Finder. Response time = resolved_at - created_at.
-- ============================================================
CREATE TABLE IF NOT EXISTS incident (
    incident_id     CHAR(36)      NOT NULL,
    aadhar_id       CHAR(64)      NULL,                  -- nullable: anonymous / guest reports
    type_id         SMALLINT      NOT NULL,
    description     TEXT          NULL,
    location_text   VARCHAR(500)  NULL,                  -- human-readable address from form / reverse geocoding
    latitude        DECIMAL(9,6)  NULL,
    longitude       DECIMAL(9,6)  NULL,
    incident_status ENUM('Reported','Assigned','InProgress','Resolved','Closed')
                                  NOT NULL DEFAULT 'Reported',
    priority_level  ENUM('Low','Medium','High','Critical')
                                  NOT NULL DEFAULT 'Medium',
    created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at     TIMESTAMP     NULL,
    updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (incident_id),
    KEY idx_incident_user   (aadhar_id),
    KEY idx_incident_status (incident_status),
    CONSTRAINT fk_incident_type
        FOREIGN KEY (type_id)   REFERENCES incident_type(type_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 5. INCIDENT_ASSIGNMENT
--    Records which authority was assigned to an incident and
--    tracks the full response lifecycle.
-- ============================================================
CREATE TABLE IF NOT EXISTS incident_assignment (
    assignment_id     CHAR(36)  NOT NULL,
    incident_id       CHAR(36)  NOT NULL,
    authority_id      CHAR(36)  NOT NULL,
    assignment_status ENUM('Pending','Accepted','EnRoute','Arrived','Completed','Rejected')
                                NOT NULL DEFAULT 'Pending',
    assigned_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accepted_at       TIMESTAMP NULL,
    arrived_at        TIMESTAMP NULL,
    completed_at      TIMESTAMP NULL,

    PRIMARY KEY (assignment_id),
    UNIQUE KEY uq_assign_pair (incident_id, authority_id),
    CONSTRAINT fk_assign_incident
        FOREIGN KEY (incident_id)   REFERENCES incident(incident_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_assign_authority
        FOREIGN KEY (authority_id)  REFERENCES authority_profile(authority_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 6. INCIDENT_REPORT_LOG  (append-only log file)
--    Every update to an incident is written as a new row.
--    No UPDATE or DELETE should be issued against this table.
-- ============================================================
CREATE TABLE IF NOT EXISTS incident_report_log (
    log_id      CHAR(36)  NOT NULL,
    incident_id CHAR(36)  NOT NULL,
    logged_by   CHAR(64)  NULL,
    log_type    ENUM('StatusChange','AuthorityAssigned','FieldNote',
                     'EvidenceAdded','ResolutionSummary','SystemEvent')
                          NOT NULL,
    old_value   TEXT      NULL,
    new_value   TEXT      NULL,
    notes       TEXT      NULL,
    is_system   TINYINT(1) NOT NULL DEFAULT 0,
    logged_at   TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (log_id),
    KEY idx_log_incident (incident_id, logged_at),
    CONSTRAINT fk_log_incident
        FOREIGN KEY (incident_id) REFERENCES incident(incident_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_log_user
        FOREIGN KEY (logged_by)   REFERENCES users(aadhar_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 7. RESOURCE_CENTER
-- ============================================================
CREATE TABLE IF NOT EXISTS resource_center (
    center_id      CHAR(36)     NOT NULL,
    name           VARCHAR(200) NOT NULL,
    center_type    ENUM('Hospital','FireStation','Police','Military','NGO','Other')
                                NOT NULL,
    latitude       DECIMAL(9,6) NOT NULL,
    longitude      DECIMAL(9,6) NOT NULL,
    address        TEXT         NOT NULL,
    contact_number VARCHAR(15)  NULL,
    created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (center_id)
) ENGINE=InnoDB;

-- ============================================================
-- 8. RESOURCE
--    Only quantity_available is tracked. Deployment is managed
--    by the center externally.
-- ============================================================
CREATE TABLE IF NOT EXISTS resource (
    resource_id        CHAR(36)     NOT NULL,
    center_id          CHAR(36)     NOT NULL,
    resource_type      VARCHAR(100) NOT NULL,
    quantity_available INT          NOT NULL DEFAULT 0,
    last_updated       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (resource_id),
    CONSTRAINT chk_qty CHECK (quantity_available >= 0),
    CONSTRAINT fk_resource_center
        FOREIGN KEY (center_id) REFERENCES resource_center(center_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 9. AUTHORITY_LIVE_LOCATION
--    Real-time GPS pings. Nearest-agency finder reads the
--    latest row per authority and computes distance to incident.
-- ============================================================
CREATE TABLE IF NOT EXISTS authority_live_location (
    location_id  CHAR(36)     NOT NULL,
    authority_id CHAR(36)     NOT NULL,
    incident_id  CHAR(36)     NULL,
    latitude     DECIMAL(9,6) NOT NULL,
    longitude    DECIMAL(9,6) NOT NULL,
    recorded_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (location_id),
    KEY idx_authority_latest (authority_id, recorded_at),
    CONSTRAINT fk_location_authority
        FOREIGN KEY (authority_id) REFERENCES authority_profile(authority_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_location_incident
        FOREIGN KEY (incident_id)  REFERENCES incident(incident_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 10. NOTIFICATION  (delivery log — no recipient tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS notification (
    notification_id   CHAR(36)  NOT NULL,
    incident_id       CHAR(36)  NULL,
    notification_type ENUM('Alert','Assignment','StatusUpdate','System')
                                NOT NULL,
    message           TEXT      NULL,
    status            ENUM('Pending','Sent','Failed') NOT NULL DEFAULT 'Pending',
    sent_at           TIMESTAMP NULL,
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (notification_id),
    CONSTRAINT fk_notif_incident
        FOREIGN KEY (incident_id) REFERENCES incident(incident_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;
