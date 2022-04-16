import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { GET_STATS_URL } from 'src/urls'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import { CSpinner } from '@coreui/react'

const Dashboard = () => {
  const [matrices, setMatrices] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    axios
      .get(GET_STATS_URL)
      .then((resp) => {
        if (resp.data && resp.data.success) {
          setMatrices(resp.data.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])
  return (
    <>
      {loading && <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />}
      <WidgetsDropdown matrices={matrices} />
    </>
  )
}

export default Dashboard
