import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { GET_STATS_URL } from 'src/urls'
import WidgetsDropdown from '../widgets/WidgetsDropdown'

const Dashboard = () => {
  const [matrices, setMatrices] = useState([])
  useEffect(() => {
    axios.get(GET_STATS_URL).then((resp) => {
      if (resp.data && resp.data.success) {
        setMatrices(resp.data.data)
      }
    })
  }, [])
  return (
    <>
      <WidgetsDropdown matrices={matrices} />
    </>
  )
}

export default Dashboard
