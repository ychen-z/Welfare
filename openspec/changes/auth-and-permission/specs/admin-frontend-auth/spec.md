## ADDED Requirements

### Requirement: Login page

The frontend SHALL provide login page for administrator authentication.

#### Scenario: Display login form

- **WHEN** user navigates to /login
- **THEN** system SHALL display form with username and password fields
- **THEN** form SHALL have "Login" submit button

#### Scenario: Successful login

- **WHEN** user submits valid credentials
- **THEN** system SHALL call POST /api/auth/login
- **THEN** system SHALL store accessToken and refreshToken in localStorage
- **THEN** system SHALL redirect to home page

#### Scenario: Failed login

- **WHEN** login request fails
- **THEN** system SHALL display error message from server
- **THEN** user SHALL remain on login page

### Requirement: Route authentication

The frontend SHALL protect routes and redirect unauthenticated users to login.

#### Scenario: Access protected route without token

- **WHEN** user navigates to protected route without token in localStorage
- **THEN** system SHALL redirect to /login
- **THEN** system SHALL preserve original URL for post-login redirect

#### Scenario: Access protected route with valid token

- **WHEN** user has valid token in localStorage
- **THEN** system SHALL allow access to protected route

### Requirement: Token storage

The frontend SHALL store and manage authentication tokens.

#### Scenario: Token persistence

- **WHEN** user logs in successfully
- **THEN** system SHALL store tokens in localStorage with keys: `accessToken`, `refreshToken`
- **THEN** tokens SHALL persist across page refreshes

#### Scenario: Token cleanup on logout

- **WHEN** user logs out
- **THEN** system SHALL remove both tokens from localStorage
- **THEN** system SHALL redirect to login page

### Requirement: Auto token refresh

The frontend SHALL automatically refresh expired access tokens.

#### Scenario: 401 response triggers refresh

- **WHEN** API returns 401 with TOKEN_EXPIRED error
- **THEN** system SHALL call POST /api/auth/refresh with refreshToken
- **THEN** system SHALL update accessToken in localStorage
- **THEN** system SHALL retry original failed request

#### Scenario: Refresh token expired

- **WHEN** refresh request fails (refresh token expired)
- **THEN** system SHALL clear all tokens
- **THEN** system SHALL redirect to login page

### Requirement: Request authentication

The frontend SHALL attach access token to all API requests.

#### Scenario: Authenticated request

- **WHEN** making API request
- **THEN** system SHALL read accessToken from localStorage
- **THEN** system SHALL add `Authorization: Bearer {token}` header

### Requirement: Dynamic menu rendering

The frontend SHALL render menu based on user permissions.

#### Scenario: Fetch user permissions

- **WHEN** user logs in successfully
- **THEN** system SHALL decode accessToken to get permissions array
- **THEN** system SHALL store permissions in global state

#### Scenario: Render menu items

- **WHEN** rendering sidebar menu
- **THEN** system SHALL filter menu config by user's menu permissions
- **THEN** system SHALL display only authorized menu items

### Requirement: Button permission control

The frontend SHALL show/hide buttons based on user permissions.

#### Scenario: Button with permission check

- **WHEN** rendering action button (create/update/delete)
- **THEN** system SHALL check if user has corresponding permission code
- **THEN** system SHALL hide button if permission missing
