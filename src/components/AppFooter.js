import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <div>{'Be Desi'}</div>
        <div>{'Duniya Jeet Lo'}</div>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
