## ADDED Requirements

### Requirement: JWT authentication guard

The system SHALL provide global JWT guard to protect all endpoints by default.

#### Scenario: Protected endpoint without token

- **WHEN** request to protected endpoint has no Authorization header
- **THEN** JwtGuard SHALL reject with 401 Unauthorized

#### Scenario: Protected endpoint with valid token

- **WHEN** request has valid JWT in Authorization header
- **THEN** JwtGuard SHALL extract user info and attach to request object
- **THEN** request SHALL proceed to controller

### Requirement: Public endpoint decorator

The system SHALL provide @Public decorator to bypass authentication.

#### Scenario: Public endpoint

- **WHEN** endpoint is marked with @Public decorator
- **THEN** JwtGuard SHALL skip authentication
- **THEN** request SHALL proceed without token

### Requirement: Permission guard

The system SHALL provide permission guard for fine-grained access control.

#### Scenario: Endpoint with required permission

- **WHEN** endpoint has @RequirePermission('employee:create')
- **THEN** PermissionGuard SHALL check if user has that permission code
- **THEN** request SHALL be allowed only if permission exists in token

#### Scenario: Missing required permission

- **WHEN** user does not have required permission
- **THEN** PermissionGuard SHALL reject with 403 Forbidden
- **THEN** system SHALL return error code 2003 (PERMISSION_DENIED)

### Requirement: CurrentUser decorator

The system SHALL provide @CurrentUser decorator to inject authenticated user info.

#### Scenario: Get current user in controller

- **WHEN** controller parameter uses @CurrentUser() decorator
- **THEN** decorator SHALL extract user from request object
- **THEN** controller SHALL receive { userId, username, roles, permissions }

### Requirement: Multiple permissions (AND logic)

The system SHALL support requiring multiple permissions on single endpoint.

#### Scenario: Endpoint with multiple permissions

- **WHEN** endpoint has @RequirePermission('employee:view', 'employee:update')
- **THEN** user MUST have ALL specified permissions
- **THEN** missing any permission SHALL result in 403 Forbidden
