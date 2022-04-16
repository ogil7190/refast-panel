import React, { useEffect, useState } from 'react'
import {
  CAvatar,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CButton,
  CInputGroup,
  CFormInput,
  CInputGroupText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople } from '@coreui/icons'
import PropTypes from 'prop-types'
import axios from 'axios'
import { GET_USERS_URL, GET_USER_BY_ID_URL } from 'src/urls'
import { parseAmountInRupees, parseDateReadable, RUPEE_SYMBOL } from 'src/utils'

const Users = () => {
  const [users, setUsers] = useState([])
  const [noMore, setNoMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [prevUsers, setPrevUsers] = useState(null)

  const fetchUsers = (date) => {
    let url = GET_USERS_URL
    if (date) {
      url = `${url}?lastDate=${new Date(date).getTime()}`
    }

    setLoading(true)
    return new Promise((resolve) => {
      axios
        .get(url)
        .then((resp) => {
          if (resp.data && resp.data.success) {
            resolve(resp.data.data)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  useEffect(() => {
    setLoading(true)
    fetchUsers(null).then((data) => {
      setUsers(data)
      if (data && data.length === 0) {
        setNoMore(true)
      }
    })
  }, [])

  const loadMoreUsers = () => {
    if (users && users.length > 0) {
      fetchUsers(users[users.length - 1].created_at).then((data) => {
        setUsers([...users, ...data])
        if (data && data.length === 0) {
          setNoMore(true)
        }
      })
    }
  }

  const getUserById = (uid) => {
    let url = GET_USER_BY_ID_URL
    if (uid) {
      url = `${url}?uid=${uid}`
      setLoading(true)
      axios
        .get(url)
        .then((resp) => {
          if (resp.data && resp.data.success) {
            setPrevUsers(users)
            setUsers([
              {
                ...resp.data.data,
              },
            ])
            setNoMore(true)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const handleChange = (e) => {
    const uid = e.target.value
    if (uid.length === 12) {
      getUserById(uid)
    }

    if (uid === '' && prevUsers) {
      setUsers(prevUsers)
      setNoMore(false)
    }
  }

  return (
    <>
      <CInputGroup className="mb-3">
        <CInputGroupText id="basic-addon1">
          <CIcon icon={cilPeople} />
        </CInputGroupText>
        <CFormInput
          placeholder="Enter User Id"
          aria-label="User Id"
          onChange={handleChange}
          aria-describedby="basic-addon1"
        />
      </CInputGroup>
      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell className="text-center">
              <CIcon icon={cilPeople} />
            </CTableHeaderCell>
            <CTableHeaderCell>User Id</CTableHeaderCell>
            <CTableHeaderCell>Full Name</CTableHeaderCell>
            <CTableHeaderCell className="text-center">Mobile</CTableHeaderCell>
            <CTableHeaderCell className="text-center">Last Active</CTableHeaderCell>
            <CTableHeaderCell>Balance</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {users.map((item, index) => (
            <CTableRow v-for="item in tableItems" key={index}>
              <CTableDataCell className="text-center">
                <CAvatar size="md" src={item.picUrl} />
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.uid}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.fullName}</div>
              </CTableDataCell>
              <CTableDataCell className="text-center">
                <div>{item.mobileNumber}</div>
              </CTableDataCell>
              <CTableDataCell className="text-center">
                <div>{parseDateReadable(item.updated_at, true)}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{`${RUPEE_SYMBOL}${parseAmountInRupees(item.balance || 0)}`}</div>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      <div className="d-flex justify-content-center" style={{ margin: 10 }}>
        {!noMore ? (
          <CButton
            style={{ display: 'flex', alignItems: 'center' }}
            disabled={loading}
            onClick={loadMoreUsers}
          >
            <div style={{ marginRight: 10 }}>{'Load More'}</div>
            {loading && <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />}
          </CButton>
        ) : (
          <div>{`Total Users : ${users.length}`}</div>
        )}
      </div>
    </>
  )
}

Users.propTypes = {
  users: PropTypes.array,
}

export default Users
