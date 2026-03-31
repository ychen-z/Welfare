## ADDED Requirements

### Requirement: Role-based access control model

The system SHALL implement 5-table RBAC model for fine-grained permission control.

#### Scenario: User with multiple roles

- **WHEN** user is assigned multiple roles
- **THEN** system SHALL collect permissions from all roles
- **THEN** system SHALL deduplicate permission codes
- **THEN** user SHALL have union of all permissions from all roles

#### Scenario: Role with multiple permissions

- **WHEN** role is assigned multiple permissions
- **THEN** system SHALL store each permission relationship in sys_role_permission table
- **THEN** querying role SHALL return all associated permissions

### Requirement: Permission types

The system SHALL support two types of permissions: menu and button.

#### Scenario: Menu permission

- **WHEN** permission type = 1 (menu)
- **THEN** permission SHALL have path field for frontend routing
- **THEN** permission code SHALL follow format `menu:<name>`
- **THEN** frontend SHALL render menu item if user has this permission

#### Scenario: Button permission

- **WHEN** permission type = 2 (button)
- **THEN** permission code SHALL follow format `<module>:<action>`
- **THEN** backend API SHALL require this permission code via @RequirePermission decorator
- **THEN** frontend SHALL show/hide button based on permission

### Requirement: Permission hierarchy

The system SHALL support parent-child permission relationships for menu structure.

#### Scenario: Parent menu with children

- **WHEN** permission has parent_id > 0
- **THEN** system SHALL treat it as child permission
- **THEN** frontend SHALL render as submenu under parent

#### Scenario: Top-level menu

- **WHEN** permission has parent_id = 0
- **THEN** system SHALL treat it as top-level permission
- **THEN** frontend SHALL render as root menu item

### Requirement: Permission code uniqueness

The system SHALL ensure each permission code is unique across the system.

#### Scenario: Duplicate permission code

- **WHEN** creating permission with existing code
- **THEN** system SHALL reject with error code 1004 (DUPLICATE_ENTRY)

### Requirement: Role activation

The system SHALL support enabling/disabling roles.

#### Scenario: Disabled role

- **WHEN** role is_active = 0
- **THEN** system SHALL NOT include its permissions when querying user permissions
- **THEN** users with only disabled roles SHALL have no permissions

### Requirement: Permission activation

The system SHALL support enabling/disabling permissions.

#### Scenario: Disabled permission

- **WHEN** permission is_active = 0
- **THEN** system SHALL NOT include it when querying role permissions
- **THEN** frontend SHALL NOT render disabled menu/button
