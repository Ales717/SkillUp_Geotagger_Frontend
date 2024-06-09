import { routes } from 'constants/routesConstants'
import { FC, useState } from 'react'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Button from 'react-bootstrap/Button'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import authStore from 'stores/auth.store'
import Toast from 'react-bootstrap/Toast'
import { StatusCode } from 'constants/errorConstants'
import * as API from 'api/Api'
import { FaCirclePlus, FaCircleUser } from 'react-icons/fa6'
import { useQuery } from 'react-query'
import Avatar from 'react-avatar'

const Navbar: FC = () => {
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const singout = async () => {
    const response = await API.signout()
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      authStore.signout()
      navigate('/')
    }
  }

  /*   const { data } = useQuery(
      ['currentUser'],
      () => API.currentUser(),
    )
    console.log(data) */
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg bg-white">
          <div className="container-fluid  p-3 pb-0">
            <Link className="navbar-brand mt-0 ps-4 ms-2" to={routes.HOME}>
              <img src="/images/logo.png" alt="geotagger" width={180} />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarTogglerDemo2"
              aria-controls="navbarTogglerDemo2"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className="collapse navbar-collapse justify-content-end align-items-center"
              id="navbarTogglerDemo2"
            >
              <ul className="navbar-nav mb-2 pe-4 me-2 mb-lg-0">
                {authStore.user ? (
                  <>
                    <li className="nav-item pe-2 pt-2">
                      <Button className="btn btn-link" href={routes.HOME}>
                        Home
                      </Button>
                    </li>
                    <li className="nav-item pe-2 pt-2">
                      <Button className="btn btn-link" >
                        Profile settings
                      </Button>
                    </li>
                    <li className="nav-item pe-2 pt-2">
                      <Button className="btn btn-link" onClick={singout}>
                        Signout
                      </Button>
                    </li>
                    <li className="nav-item pe-2 pt-1">
                      <div className='nav-profile'>
                        <Button className="nav-profile-button" href={routes.PROFILE}>
                          {!authStore.user && (
                            <FaCircleUser className='nav-profile-button-icon' />
                          )}
                          {authStore.user && (
                            <Avatar
                              round
                              src={`${process.env.REACT_APP_API_URL}${authStore.user.avatar}`}
                              alt='avatar'
                              className='w-100 h-100'
                            />
                          )}

                        </Button>
                        <p className='nav-profile-points p-3'>{authStore.user.points}</p>
                      </div>
                    </li>
                    <li className="nav-item pe-4">
                      <Button className="puls-button" href={routes.ADDLOCATION}>
                        <FaCirclePlus className='plus-icon' />
                      </Button>
                    </li>
                  </>

                ) : (
                  <>
                    <li className="nav-item pe-2">
                      <NavLink className="nav-link fw-bold" to={routes.LOGIN}>
                        Sign in
                      </NavLink>
                    </li>
                    <li className="nav-item pe-2">
                      <p className='pt-2 font-weight-bold'>or</p>
                    </li>
                    <li className="nav-item ps-2 pe-2">
                      <NavLink className="btn btn-success " to={routes.SIGNUP}>
                        Sign Up
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
      {showError && (
        <ToastContainer className="p-3" position="top-end">
          <Toast onClose={() => setShowError(false)} show={showError}>
            <Toast.Header>
              <strong className="me-suto text-danger">Error</strong>
            </Toast.Header>
            <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </>
  )
}

export default Navbar
