CREATE TABLE IF NOT EXISTS employees (
  id          VARCHAR(36)                   NOT NULL,
  nik         VARCHAR(20)                   NOT NULL,
  full_name   VARCHAR(100)                  NOT NULL,
  email       VARCHAR(100)                  NOT NULL,
  password    VARCHAR(255)                  NOT NULL,
  department  VARCHAR(100)                  NULL,
  position    VARCHAR(100)                  NULL,
  role        ENUM('EMPLOYEE','HRD_ADMIN')  NOT NULL  DEFAULT 'EMPLOYEE',
  is_active   BOOLEAN                       NOT NULL  DEFAULT TRUE,
  created_at  DATETIME                      NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME                      NOT NULL  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_employees_nik   (nik),
  UNIQUE KEY uq_employees_email (email)
);
