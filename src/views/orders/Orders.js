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
  CInputGroupText,
  CFormInput,
} from '@coreui/react'
import axios from 'axios'
import { GET_ORDERS_URL, GET_ORDER_BY_ID_URL } from 'src/urls'
import { parseAmountInRupees, RUPEE_SYMBOL } from 'src/utils'

const parseOrders = (orders) => {
  return orders.map((order) => {
    return {
      oid: order.oid,
      status: order.status,
      paid: order.paid ? 'YES' : 'NO',
      type: order.type,
      uid: order.uid,
      totalAmount: `${RUPEE_SYMBOL}${parseAmountInRupees(order.totalAmount)}`,
      paymentType: order.paymentType,
      orderAmount: `${RUPEE_SYMBOL}${parseAmountInRupees(order.applicableAmount)}`,
      paidAmount: `${RUPEE_SYMBOL}${parseAmountInRupees(order.userPaidAmount)}`,
      wallet: `${
        order.walletDetails
          ? `${RUPEE_SYMBOL}${parseAmountInRupees(order.walletDetails.beforeOrderBalance || 0)}`
          : '-'
      }`,
      cashback: `${
        order.cashbackDetails
          ? `${RUPEE_SYMBOL}${parseAmountInRupees(order.cashbackDetails.cashbackAmount || 0)}`
          : '-'
      }`,
      operator:
        order.orderMetaData && order.orderMetaData.operatorDetails
          ? order.orderMetaData.operatorDetails.operator_name ||
            order.orderMetaData.operatorDetails.operatorName
          : '-',
      updated_at: order.updated_at,
    }
  })
}

const Users = () => {
  const [orders, setOrders] = useState([])
  const [noMore, setNoMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [prevOrders, setPrevOrders] = useState(null)

  const fetchOrders = (date) => {
    let url = GET_ORDERS_URL
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

  const getOrderById = (oid) => {
    let url = GET_ORDER_BY_ID_URL
    if (oid) {
      url = `${url}?oid=${oid}`
      setLoading(true)
      axios
        .get(url)
        .then((resp) => {
          if (resp.data && resp.data.success) {
            setPrevOrders(orders)
            const _ordersById = [{ ...resp.data.data }]
            setOrders(parseOrders(_ordersById))
            setNoMore(true)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const handleChange = (e) => {
    const oid = e.target.value
    if (oid.length === 14) {
      getOrderById(oid)
    }

    if (oid === '' && prevOrders) {
      setOrders(prevOrders)
      setNoMore(false)
    }
  }

  return (
    <>
      <CInputGroup className="mb-3">
        <CInputGroupText id="basic-addon1">
          <div>{'Order Id'}</div>
        </CInputGroupText>
        <CFormInput
          placeholder="Enter Order Id"
          aria-label="Order Id"
          onChange={handleChange}
          aria-describedby="basic-addon1"
        />
      </CInputGroup>
      <CTable align="middle" cellSpacing={100} className="mb-0 border" hover responsive={false}>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>Order ID</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Paid</CTableHeaderCell>
            <CTableHeaderCell>Type</CTableHeaderCell>
            <CTableHeaderCell>Operator</CTableHeaderCell>
            <CTableHeaderCell>User</CTableHeaderCell>
            <CTableHeaderCell>Payment Type</CTableHeaderCell>
            <CTableHeaderCell>Total Amount</CTableHeaderCell>
            <CTableHeaderCell>Order Amount</CTableHeaderCell>
            <CTableHeaderCell>Paid Amount</CTableHeaderCell>
            <CTableHeaderCell>Wallet</CTableHeaderCell>
            <CTableHeaderCell>Cashback</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {orders.map((item, index) => (
            <CTableRow v-for="item in tableItems" key={index}>
              <CTableDataCell>
                <div>{item.oid}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.status}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.paid}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.type}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.operator}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.uid}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.paymentType}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.totalAmount}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.orderAmount}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.paidAmount}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.wallet}</div>
              </CTableDataCell>
              <CTableDataCell>
                <div>{item.cashback}</div>
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
