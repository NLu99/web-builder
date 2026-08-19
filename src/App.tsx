import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import NewSite from './pages/NewSite'
import AccountSettings from './pages/AccountSettings'
import Live from './pages/Live'
import Editor from './editor/Editor'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new" element={<NewSite />} />
        <Route path="/settings" element={<AccountSettings />} />
        <Route path="/site/:siteId/edit/:pageId" element={<Editor />} />
        <Route path="/live/:siteId/:pageId" element={<Live />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  )
}
