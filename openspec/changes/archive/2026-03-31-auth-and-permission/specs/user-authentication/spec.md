## ADDED Requirements

### Requirement: User login with username and password

The system SHALL allow administrators to log in using their username and password.

#### Scenario: Successful login

- **WHEN** user provides valid username and password
- **THEN** system SHALL return access token (2h) and refresh token (7d)
- **THEN** system SHALL update last_login_at timestamp

#### Scenario: Invalid credentials

- **WHEN** user provides invalid username or password
- **THEN** system SHALL return error code 2005 (PASSWORD_WRONG)
- **THEN** system SHALL NOT generate any tokens

#### Scenario: Disabled account

- **WHEN** user account is_active = 0
- **THEN** system SHALL return error code 2004 (ACCOUNT_DISABLED)
- **THEN** system SHALL NOT allow login

### Requirement: JWT access token generation

The system SHALL generate JWT access tokens containing user identity and permissions.

#### Scenario: Token payload structure

- **WHEN** access token is generated
- **THEN** token payload SHALL include: userId, username, roles (array), permissions (array)
- **THEN** token expiration SHALL be 2 hours from issuance

#### Scenario: Permissions embedded in token

- **WHEN** generating access token
- **THEN** system SHALL query all user's roles
- **THEN** system SHALL collect all permissions from all roles
- **THEN** system SHALL embed permission codes in token payload

### Requirement: Refresh token management

The system SHALL provide refresh tokens for extending session without re-login.

#### Scenario: Refresh token issuance

- **WHEN** user logs in successfully
- **THEN** system SHALL generate unique tokenId (UUID)
- **THEN** system SHALL store refresh token in Redis with key `auth:refresh:{userId}:{tokenId}`
- **THEN** Redis key SHALL have TTL of 7 days

#### Scenario: Refresh token usage

- **WHEN** user provides valid refresh token
- **THEN** system SHALL validate token signature and expiration
- **THEN** system SHALL verify token exists in Redis whitelist
- **THEN** system SHALL issue new access token
- **THEN** system SHALL keep refresh token unchanged

#### Scenario: Refresh token revocation

- **WHEN** user logs out or changes password
- **THEN** system SHALL delete all refresh tokens for that user from Redis
- **THEN** existing access tokens remain valid until expiration (cannot revoke)

### Requirement: Token validation

The system SHALL validate access tokens on every protected request.

#### Scenario: Valid token

- **WHEN** request includes valid access token in Authorization header
- **THEN** system SHALL extract userId and permissions from token
- **THEN** system SHALL allow request to proceed

#### Scenario: Expired token

- **WHEN** access token has expired
- **THEN** system SHALL return 401 Unauthorized
- **THEN** system SHALL return error code 2001 (TOKEN_EXPIRED)

#### Scenario: Invalid token

- **WHEN** token signature is invalid or malformed
- **THEN** system SHALL return 401 Unauthorized
- **THEN** system SHALL return error code 2002 (TOKEN_INVALID)

#### Scenario: Missing token

- **WHEN** protected endpoint receives request without token
- **THEN** system SHALL return 401 Unauthorized
- **THEN** system SHALL return error code 2000 (UNAUTHORIZED)

### Requirement: Password encryption

The system SHALL encrypt passwords using bcrypt before storing.

#### Scenario: Password hashing on registration

- **WHEN** creating new user
- **THEN** system SHALL hash password with bcrypt cost factor 10
- **THEN** system SHALL store only hashed password, never plain text

#### Scenario: Password verification

- **WHEN** user logs in
- **THEN** system SHALL use bcrypt.compare to verify password
- **THEN** system SHALL NOT log or expose plain text password
