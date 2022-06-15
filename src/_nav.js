import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilMoney, cilUser, cilBook, cilSearch, cilSpeedometer } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'My Views',
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/category/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Orders',
    to: '/category/orders',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Payments',
    to: '/category/payments',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
]

export default _nav
