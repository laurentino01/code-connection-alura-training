import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import '@fontsource/prompt/400.css'
import '@fontsource/prompt/600.css'
import './index.css'
import { LoginPage } from './components/pages/LoginPage'
import { SignupPage } from './components/pages/SignupPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
