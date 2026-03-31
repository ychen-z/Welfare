## ADDED Requirements

### Requirement: Basic Layout

The admin frontend SHALL provide a basic layout with header, sidebar, and content area.

#### Scenario: Display layout structure

- **WHEN** user accesses any page
- **THEN** the system SHALL display header at top, sidebar at left, and content in main area

### Requirement: Routing Framework

The admin frontend SHALL use umi4 routing system for page navigation.

#### Scenario: Navigate between pages

- **WHEN** user clicks a menu item
- **THEN** the system SHALL navigate to the corresponding page without full page reload

#### Scenario: Handle unknown routes

- **WHEN** user accesses an unknown URL
- **THEN** the system SHALL display a 404 page

### Requirement: Unified Request Handler

The admin frontend SHALL provide a unified HTTP request utility.

#### Scenario: Successful request

- **WHEN** an API request succeeds with code=0
- **THEN** the utility SHALL return the data field to the caller

#### Scenario: Failed request

- **WHEN** an API request returns a non-zero code
- **THEN** the utility SHALL display error message and reject the promise

#### Scenario: Network error

- **WHEN** a network error occurs
- **THEN** the utility SHALL display "Network error" message

### Requirement: TailwindCSS Integration

The admin frontend SHALL support TailwindCSS for styling.

#### Scenario: Use Tailwind classes

- **WHEN** developer adds Tailwind utility classes to components
- **THEN** the styles SHALL be applied correctly

### Requirement: Development Proxy

The admin frontend SHALL proxy API requests to backend server in development.

#### Scenario: Proxy API requests

- **WHEN** frontend makes request to /api/\*
- **THEN** the request SHALL be proxied to backend server at localhost:3000

### Requirement: Ant Design Integration

The admin frontend SHALL use Ant Design 5 component library.

#### Scenario: Use Ant Design components

- **WHEN** developer imports Ant Design components
- **THEN** the components SHALL render with Ant Design styling
