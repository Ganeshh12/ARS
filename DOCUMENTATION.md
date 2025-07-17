# Automated Reporting System Documentation

## Overview
The Automated Reporting System (ARS) is a comprehensive solution for educational institutions to manage student data, generate reports, and track academic performance. The system consists of a React frontend and Node.js backend.

## Project Structure

### Frontend
- `/frontend/src/components/` - Reusable UI components
- `/frontend/src/pages/` - Page components for different user roles
- `/frontend/src/services/` - API services for data fetching
- `/frontend/src/contexts/` - React context providers
- `/frontend/src/utils/` - Utility functions and helpers

### Backend
- `/backend/config/` - Database and server configuration
- `/backend/routes/` - API endpoints
- `/backend/middleware/` - Express middleware
- `/backend/uploads/` - Storage for uploaded files
- `/backend/images/` - Student images and other media

## User Roles
1. **Faculty** - Manage students, view reports, track achievements
2. **HoD (Head of Department)** - Department-level analytics and resource management
3. **Principal** - Institution-wide overview and strategic planning

## Features
- Student data management
- Academic performance tracking
- Report generation (PDF, Excel)
- Achievement and certification tracking
- Resource management
- Academic calendar

## API Services
The system uses a consolidated API service (`api_enhanced.js`) that provides:
- Authentication
- Data fetching
- Report generation
- Error handling
- Mock data for development

## Database
The system uses MySQL with tables for:
- Students
- Courses
- Grades
- SGPA/CGPA
- Achievements
- Certifications
- Users

## Setup and Installation
1. Clone the repository
2. Install dependencies:
   ```
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Set up the database using the SQL scripts in `/backend/`
4. Configure environment variables in `.env`
5. Start the servers:
   ```
   ./run_all.sh
   ```

## Development Guidelines
- Use the enhanced API service for all data fetching
- Follow the component structure for UI elements
- Use the sidebar components based on user role
- Implement proper error handling

## Backup and Restore
- Use the scripts in `/scripts/` for backup and restore operations
- Regular backups are recommended

## Troubleshooting
- Check logs in the console for API errors
- Verify database connection
- Ensure proper authentication

## Additional Resources
- React documentation: https://reactjs.org/
- Material-UI: https://mui.com/
- Chart.js: https://www.chartjs.org/
- Express.js: https://expressjs.com/