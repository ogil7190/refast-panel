import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import { get, Keys, loadDataInMemory, persist, set } from './services/dataStore.service'
import { genericPost } from './services/genericPost.service'
import { URL_VERIFY } from './urls'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
// const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

class App extends Component {
  constructor() {
    super()
    loadDataInMemory()
  }

  refreshToken = () => {
    const { resultPromise } = genericPost({
      path: URL_VERIFY,
    })

    resultPromise
      .then((response) => {
        if (response.body.success) {
          const newToken = response.body.token
          if (newToken) {
            set(Keys.TOKEN, newToken)
            persist()
          }
        }
      })
      .catch((e) => console.warn(e))
  }

  componentDidMount() {
    const token = get(Keys.TOKEN)
    if (token) {
      this.refreshToken()
    }
  }

  render() {
    return (
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
      </HashRouter>
    )
  }
}

export default App
