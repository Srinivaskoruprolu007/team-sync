# Team Sync B2B

Collaborative project management and team synchronization platform with B2B capabilities.

## Project Structure

```txt
team-sync-b2b/
├── backend/                          # Node.js TypeScript backend
│   ├── src/
│   │   ├── config/                   # Configuration files
│   │   │   ├── db.config.ts         # Database configuration
│   │   │   ├── http.config.ts       # HTTP configuration
│   │   │   └── passport.config.ts   # Authentication strategy
│   │   ├── controllers/
│   │   │   └── auth.controller.ts   # Authentication controller
│   │   ├── routes/
│   │   │   └── auth.route.ts        # Auth routes
│   │   ├── models/                   # Data models
│   │   │   ├── account.model.ts
│   │   │   ├── member.model.ts
│   │   │   ├── project.model.ts
│   │   │   ├── role.model.ts
│   │   │   ├── task.model.ts
│   │   │   ├── user.model.ts
│   │   │   └── workspace.model.ts
│   │   ├── enums/                    # Enumerations
│   │   │   ├── account-provider.enum.ts
│   │   │   ├── error-code.enum.ts
│   │   │   ├── role.enum.ts
│   │   │   └── task-status.enum.ts
│   │   ├── middleware/
│   │   │   ├── asyncHandler.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── seeders/
│   │   │   └── role.seeder.ts
│   │   ├── utils/                    # Utility functions
│   │   │   ├── appError.ts
│   │   │   ├── bcrypt.ts
│   │   │   ├── getEnv.ts
│   │   │   ├── logger.ts
│   │   │   ├── roles-permission.ts
│   │   │   └── uuid.ts
│   │   ├── types/
│   │   │   └── index.d.ts
│   │   └── lib/
│   ├── logs/                         # Application logs
│   ├── index.ts                      # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── types/
├── frontend/                         # React/Frontend application
└── README.md                         # Project documentation
```

## Backend Getting Started

### Prerequisites

-   Node.js (v16 or higher)
-   npm or yarn
-   Database configured (MongoDB/PostgreSQL)

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
LOG_LEVEL=info
```

### Running the Application

```bash
npm start
```

### Development Mode

```bash
npm run dev
```

## Features

### Authentication & Authorization

-   Multi-provider account support (OAuth2, Email/Password)
-   Role-based access control (RBAC)
-   JWT-based authentication

### Core Modules

-   **Users**: User management and profiles
-   **Workspaces**: Team collaboration spaces
-   **Projects**: Project management within workspaces
-   **Tasks**: Task tracking with status management
-   **Members**: Workspace member management
-   **Roles**: Permission and role management

## API Endpoints

### Authentication

-   `POST /api/auth/login` - User login
-   `POST /api/auth/signup` - User registration
-   `POST /api/auth/logout` - User logout

### Users

-   `GET /api/users/:id` - Get user profile
-   `PUT /api/users/:id` - Update user profile

### Workspaces

-   `GET /api/workspaces` - List user workspaces
-   `POST /api/workspaces` - Create new workspace
-   `PUT /api/workspaces/:id` - Update workspace

### Projects

-   `GET /api/projects` - List projects
-   `POST /api/projects` - Create project
-   `GET /api/projects/:id` - Get project details

### Tasks

-   `GET /api/tasks` - List tasks
-   `POST /api/tasks` - Create task
-   `PUT /api/tasks/:id` - Update task

## Database Models

-   **User**: User account and profile information
-   **Account**: External account integrations
-   **Workspace**: Team collaboration spaces
-   **Project**: Projects within workspaces
-   **Task**: Individual tasks with status tracking
-   **Member**: Workspace membership and roles
-   **Role**: Permission definitions and access control

## Contributing

1. Follow the TypeScript code style conventions
2. Add tests for new features
3. Update documentation for API changes
4. Create feature branches for development

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
