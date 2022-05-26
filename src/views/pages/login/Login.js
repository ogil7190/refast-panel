import React, { useRef, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { genericPost } from 'src/services/genericPost.service'
import { URL_AUTH_LOGIN } from 'src/urls'
import { get } from 'lodash'
import { Navigate } from 'react-router-dom'
import { Keys, persist, set } from 'src/services/dataStore.service'

const Login = () => {
  const [state, setState] = useState({})
  const [toast, setToast] = useState(0)
  const [loggedIn, setLoggedIn] = useState(false)

  const toaster = useRef()

  const attemptLogin = () => {
    const { resultPromise } = genericPost({
      path: URL_AUTH_LOGIN,
      data: {
        ...state,
      },
    })

    resultPromise
      .then((resp) => {
        if (resp && resp.body) {
          const data = resp.body
          if (!data.error) {
            const token = get(data, 'data.token', null)
            const userDetails = get(data, 'data.userDetails', null)
            if (token && userDetails) {
              set(Keys.TOKEN, token)
              set(Keys.USER_DETAILS, userDetails)
              persist()
              setLoggedIn(true)
            }
          } else {
            setToast(
              addToast({
                title: 'Login Failed',
                error: data.mssg,
              }),
            )
          }
        }
      })
      .catch((e) => console.log(e))
  }

  const handleInputChange = (key, value) => {
    setState({
      ...state,
      [key]: value,
    })
  }

  const addToast = ({ title, error }) => {
    return (
      <CToast>
        <CToastHeader closeButton>
          <svg
            className="rounded me-2"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
            role="img"
          >
            <rect width="100%" height="100%" fill="#007aff"></rect>
          </svg>
          <strong className="me-auto">{title}</strong>
        </CToastHeader>
        <CToastBody>{error}</CToastBody>
      </CToast>
    )
  }

  if (loggedIn) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={(event) => handleInputChange('username', event.target.value)}
                        placeholder="Username"
                        autoComplete="username"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={(event) => handleInputChange('password', event.target.value)}
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={attemptLogin}>
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>{'Ask Super Admin to give you permissions & create your account'}</p>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </div>
  )
}

export default Login
