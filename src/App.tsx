import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Landing } from '@/pages/Landing'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Journal } from '@/pages/Journal'
import { Backtest } from '@/pages/Backtest'
import { Indicators } from '@/pages/Indicators'
import { Settings } from '@/pages/Settings'
import { AuthCallback } from '@/pages/AuthCallback'

function App() {
  useAuth()

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/backtest" element={<Backtest />} />
            <Route path="/indicators" element={<Indicators />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#161b22',
            color: '#e6edf3',
            border: '1px solid #30363d',
            fontSize: '14px',
          },
        }}
      />
    </ErrorBoundary>
  )
}

export default App
