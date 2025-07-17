import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { StudentFilterProvider } from './contexts/StudentFilterContext';

// Auth Context
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import DashboardLayout from './components/DashboardLayout';

// Pages
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const UnauthorizedPage = React.lazy(()=>import('./pages/UnauthorizedPage'));

// Faculty Pages
const FacultyDashboard = React.lazy(()=>import('./pages/faculty/FacultyDashboard/FacultyDashboard'));
const StudentsList = React.lazy(()=>import('./pages/faculty/StudentsList'));
const StudentDetail = React.lazy(()=>import('./pages/faculty/StudentDetail'));
const AchievementsManagement = React.lazy(()=>import('./pages/faculty/AchievementEnhanced'));
const CertificationsManagement = React.lazy(()=>import('./pages/faculty/CertificationsManagement'));
const AdmissionsAnalytics = React.lazy(()=>import('./pages/faculty/AdmissionsAnalytics'));
const FacultyReports = React.lazy(()=>import('./pages/faculty/FacultyReports/FacultyReports'));
const CounselingNotes = React.lazy(()=>import('./pages/faculty/CounselingNotes'));
const AcademicCalendar = React.lazy(()=>import('./pages/faculty/AcademicCalendar'));
const CalendarAdmin = React.lazy(()=>import('./pages/faculty/CalendarAdmin'));

// HoD Pages
const HoDDashboard = React.lazy(()=>import('./pages/hod/HoDDashboard'));
const DepartmentOverview = React.lazy(()=>import('./pages/hod/DepartmentOverview'));
const FacultyManagement = React.lazy(()=>import('./pages/hod/FacultyManagement'));
const CourseAnalytics = React.lazy(()=>import('./pages/hod/CourseAnalytics'));
const ResourceManagement = React.lazy(()=>import('./pages/hod/ResourceManagement'));
const DepartmentReports = React.lazy(()=>import('./pages/hod/DepartmentReports'));

// Principal Pages
const PrincipalDashboard = React.lazy(()=>import('./pages/principal/PrincipalDashboard'));
const InstitutionOverview = React.lazy(()=>import('./pages/principal/InstitutionOverview'));
const DepartmentManagement = React.lazy(()=>import('./pages/principal/DepartmentManagement'));
const FacultyOverview = React.lazy(()=>import('./pages/principal/FacultyOverview'));
const StrategicPlanning = React.lazy(()=>import('./pages/principal/StrategicPlanning'));
const InstitutionReports = React.lazy(()=>import('./pages/principal/InstitutionReports'));

// Admin Pages
const AdminDashboard = React.lazy(()=>import('./pages/admin/AdminDashboard'));
const UserManagement = React.lazy(()=>import('./pages/admin/UserManagement'));
const SystemSettings = React.lazy(()=>import('./pages/admin/SystemSettings'));

// Student Pages
const StudentDashboard = React.lazy(()=>import('./pages/student/StudentDashboard'));
const StudentAcademics = React.lazy(()=>import('./pages/student/StudentAcademics'));
const StudentAchievements = React.lazy(()=>import('./pages/student/StudentAchievements'));
const StudentCertifications = React.lazy(()=>import('./pages/student/StudentCertifications'));
import CircularProgress from '@mui/material/CircularProgress';

const GradientCircularProgress = () => {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
    </React.Fragment>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <StudentFilterProvider>
          <Router>
            <Suspense fallback={<GradientCircularProgress />}>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              {/* Faculty Routes */}
              <Route path="/faculty" element={
                <ProtectedRoute requiredRole="faculty">
                  <DashboardLayout userRole="faculty" />
                </ProtectedRoute>
              }>
                <Route path="" element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<FacultyDashboard />} />
                <Route path="students" element={<StudentsList />} />
                <Route path="students/:regNo" element={<StudentDetail />} />
                <Route path="achievements" element={<AchievementsManagement />} />
                <Route path="certifications" element={<CertificationsManagement />} />
                <Route path="admissions" element={<AdmissionsAnalytics />} />
                <Route path="reports" element={<FacultyReports />} />
                <Route path="counseling" element={<CounselingNotes />} />
                <Route path="calendar" element={<CalendarAdmin />} />
                <Route path="calendar-admin" element={<AcademicCalendar />} />
              </Route>
              
              {/* HoD Routes */}
              <Route path="/hod" element={
                <ProtectedRoute requiredRole="hod">
                  <DashboardLayout userRole="hod" />
                </ProtectedRoute>
              }>
                <Route path="" element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<HoDDashboard />} />
                <Route path="department" element={<DepartmentOverview />} />
                <Route path="faculty" element={<FacultyManagement />} />
                <Route path="courses" element={<CourseAnalytics />} />
                <Route path="resources" element={<ResourceManagement />} />
                <Route path="reports" element={<DepartmentReports />} />
              </Route>
              
              {/* Principal Routes */}
              <Route path="/principal" element={
                <ProtectedRoute requiredRole="principal">
                  <DashboardLayout userRole="principal" />
                </ProtectedRoute>
              }>
                <Route path="" element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<PrincipalDashboard />} />
                <Route path="institution" element={<InstitutionOverview />} />
                <Route path="departments" element={<DepartmentManagement />} />
                <Route path="faculty" element={<FacultyOverview />} />
                <Route path="planning" element={<StrategicPlanning />} />
                <Route path="reports" element={<InstitutionReports />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout userRole="admin" />
                </ProtectedRoute>
              }>
                <Route path="" element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="settings" element={<SystemSettings />} />
              </Route>
              
              {/* Student Routes */}
              <Route path="/student" element={
                <ProtectedRoute requiredRole="student">
                  <DashboardLayout userRole="student" />
                </ProtectedRoute>
              }>
                <Route path="" element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="academics" element={<StudentAcademics />} />
                <Route path="achievements" element={<StudentAchievements />} />
                <Route path="certifications" element={<StudentCertifications />} />
              </Route>
              
              {/* Default Route */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            </Suspense>
          </Router>
        </StudentFilterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;