import React, { useEffect, useState } from 'react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CButton,
  CInputGroup,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CFormInput,
} from '@coreui/react'
import axios from 'axios'
import { GET_PAYMENTS_URL, SEARCH_PAYMENT_URL } from 'src/urls'
import { parseAmountInRupees, parseDateReadable, RUPEE_SYMBOL } from 'src/utils'

const parseOrders = (orders) => {
  return orders.map((order) => {
    return {
      txnId: order.txnId,
      verified: order.verified ? 'YES' : 'NO',
      oid: order.oid,
      amount:
        order.summary && order.summary.amount
          ? RUPEE_SYMBOL + parseAmountInRupees(order.summary.amount)
          : '-',
      utr: order.summary && order.summary.utr ? order.summary.utr : '-',
      vpa: order.summary && order.summary.vpa ? order.summary.vpa : '-',
      instrument:
        order.summary && order.summary.paymentApp ? order.summary.paymentApp.displayText : '-',
      updated_at: order.updated_at,
    }
  })
}

const Users = () => {
  const [orders, setOrders] = useState([])
  const [noMore, setNoMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [prevOrders, setPrevOrders] = useState(null)
  const [searchBy, setSearchBy] = useState('Txn ID')

  const fetchOrders = (date) => {
    let url = GET_PAYMENTS_URL
    if (date) {
      url = `${url}?lastOrderDate=${new Date(date).getTime()}`
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
    fetchOrders(null).then((data) => {
      setOrders(parseOrders(data))
      if (data && data.length === 0) {
        setNoMore(true)
      }
    })
  }, [])

  const loadMoreOrders = () => {
    if (orders && orders.length > 0) {
      fetchOrders(orders[orders.length - 1].updated_at).then((data) => {
        const parsedData = parseOrders(data)
        setOrders([...orders, ...parsedData])
        if (data && data.length === 0) {
          setNoMore(true)
        }
      })
    }
  }

  const getOrderByTag = (tag) => {
    let url = SEARCH_PAYMENT_URL
    if (tag) {
      const key = TAGS[searchBy]
      url = `${url}?${key}=${tag}&tag=${key}`
      setLoading(true)
      axios
        .get(url)
        .then((resp) => {
          if (resp.data && resp.data.success) {
            setPrevOrders(orders)
            const _orders = [...resp.data.data]
            setOrders(parseOrders(_orders))
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
    if (tag === '' && prevOrders) {
      setOrders(prevOrders)
      setNoMore(false)
    } else {
      getOrderByTag(tag)
    }
  }

  const handleSearchByChange = (by) => {
    setSearchBy(by)
  }

  const TAGS = {
    'Txn ID': 'txnId',
    'Order ID': 'oid',
    UTR: 'utr',
  }

  return (
    <>
      <CInputGroup className="mb-3">
        <CDropdown>
          <CDropdownToggle color="primary">{searchBy ? searchBy : 'Search By'}</CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem onClick={() => handleSearchByChange('Txn ID')}>
              Search Txn ID
            </CDropdownItem>
            <CDropdownItem onClick={() => handleSearchByChange('Order ID')}>
              Search Order ID
            </CDropdownItem>
            <CDropdownItem onClick={() => handleSearchByChange('UTR')}>Search UTR</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
        <CFormInput
          placeholder={`Enter ${searchBy}`}
          aria-label={searchBy}
          onChange={handleChange}
        />
      </CInputGroup>
      <CTable align="middle" cellSpacing={100} className="mb-0 border" hover responsive={false}>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>Txn ID</CTableHeaderCell>
            <CTableHeaderCell>Verified</CTableHeaderCell>
            <CTableHeaderCell>Order ID</CTableHeaderCell>
            <CTableHeaderCell>Amount</CTableHeaderCell>
            <CTableHeaderCell>Time</CTableHeaderCell>
            <CTableHeaderCell>UTR</CTableHeaderCell>
            <CTableHeaderCell>VPA</CTableHeaderCell>
            <CTableHeaderCell>Instrument</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {orders.map((item, index) => (
            <CTableRow v-for="item in tableItems" key={index}>
              <CTableDataCell>
                <div>{item.txnId}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.verified}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.oid}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.amount}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{parseDateReadable(item.updated_at, true)}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.utr}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.vpa}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.instrument}</div>
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
            onClick={loadMoreOrders}
          >
            <div style={{ marginRight: 10 }}>{'Load More'}</div>
            {loading && <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />}
          </CButton>
        ) : (
          <div>{`Total Orders : ${orders.length}`}</div>
        )}
      </div>
    </>
  )
}

export default Users
