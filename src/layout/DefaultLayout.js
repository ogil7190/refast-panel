import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { get, Keys } from 'src/services/dataStore.service'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = get(Keys.TOKEN)
    if (!token) {
      // navigate('/login', { replace: true })
    }
  }, [navigate])

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
