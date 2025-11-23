
# Team Sync B2B Backend

## Overview
Backend service for Team Sync B2B application.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Database (specify your DB)

### Installation
```bash
npm install
```

### Running the Application
```bash
npm start
```

### Environment Variables
Create a `.env` file in the root directory:
```
PORT=3000
DATABASE_URL=your_database_url
API_KEY=your_api_key
```

## Project Structure
```
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── index.js
├── tests/
├── .env.example
└── package.json
```

## API Endpoints
- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `GET /api/teams` - Get teams

## Testing
```bash
npm test
```

## Contributing
Please follow the existing code style and add tests for new features.

## License
MIT
