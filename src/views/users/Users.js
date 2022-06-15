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
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople } from '@coreui/icons'
import PropTypes from 'prop-types'
import axios from 'axios'
import { GET_BALANCE_BY_UID_URL, GET_USERS_URL, SEARCH_USER_URL } from 'src/urls'
import { parseAmountInRupees, parseDateReadable, RUPEE_SYMBOL } from 'src/utils'

const Users = () => {
  const [users, setUsers] = useState([])
  const [noMore, setNoMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [prevUsers, setPrevUsers] = useState(null)
  const [searchBy, setSearchBy] = useState('User ID')

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

  const getUserByTag = (tag) => {
    let url = SEARCH_USER_URL
    if (tag) {
      const key = TAGS[searchBy]
      url = `${url}?${key}=${tag}&tag=${key}`
      setLoading(true)
      axios
        .get(url)
        .then((resp) => {
          if (resp.data && resp.data.success) {
            setPrevUsers(users)
            const _orders = [...resp.data.data]
            setUsers(_orders)
            setNoMore(true)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const handleChange = (e) => {
    const tag = e.target.value
    if (tag === '' && prevUsers) {
      setUsers(prevUsers)
      setNoMore(false)
    } else {
      getUserByTag(tag)
    }
  }

  const getUserBalance = (user, index) => {
    const url = `${GET_BALANCE_BY_UID_URL}?uid=${user.uid}`
    axios.get(url).then((resp) => {
      if (resp.data && resp.data.success) {
        const _users = [...users]
        _users[index] = {
          ..._users[index],
          balance: resp.data.data,
        }
        setUsers(_users)
      }
    })
  }

  const handleSearchByChange = (by) => {
    setSearchBy(by)
  }

  const TAGS = {
    Name: 'name',
    Referrer: 'referrer',
    'User ID': 'uid',
    'Mobile Number': 'mobileNumber',
  }

  return (
    <>
      <CInputGroup className="mb-3">
        <CDropdown>
          <CDropdownToggle color="primary">{searchBy ? searchBy : 'Search By'}</CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem onClick={() => handleSearchByChange('User ID')}>
              Search User ID
            </CDropdownItem>
            <CDropdownItem onClick={() => handleSearchByChange('Mobile Number')}>
              Search Mobile Number
            </CDropdownItem>
            <CDropdownItem onClick={() => handleSearchByChange('Referrer')}>
              Search Referrer
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
        <CFormInput
          placeholder={`Enter ${searchBy}`}
          aria-label={searchBy}
          onChange={handleChange}
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
            <CTableHeaderCell className="text-center">Referrer</CTableHeaderCell>
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
                <div>{item.referredBy || '-'}</div>
              </CTableDataCell>
              <CTableDataCell className="text-center">
                <div>{parseDateReadable(item.updated_at, true)}</div>
              </CTableDataCell>
              <CTableDataCell onClick={() => getUserBalance(item, index)}>
                <div style={{ color: 'green', cursor: 'pointer' }}>
                  {item.balance !== undefined
                    ? `${RUPEE_SYMBOL}${parseAmountInRupees(item.balance || 0)}`
                    : 'Get Balance'}
                </div>
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
