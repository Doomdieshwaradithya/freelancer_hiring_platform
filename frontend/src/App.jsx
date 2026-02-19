import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext.jsx'
import { Layout } from './components/Layout.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { Landing } from './pages/Landing.jsx'
import { Login } from './pages/Login.jsx'
import { Register } from './pages/Register.jsx'
import { Jobs } from './pages/Jobs.jsx'
import { JobDetail } from './pages/JobDetail.jsx'
import { PostJob } from './pages/PostJob.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { MyApplications } from './pages/MyApplications.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Layout><Landing /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/jobs" element={<Layout><Jobs /></Layout>} />
          <Route path="/jobs/:id" element={<Layout><JobDetail /></Layout>} />
          <Route
            path="/post-job"
            element={
              <Layout>
                <ProtectedRoute role="client">
                  <PostJob />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <ProtectedRoute role="client">
                  <Dashboard />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/my-applications"
            element={
              <Layout>
                <ProtectedRoute role="freelancer">
                  <MyApplications />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
