import { RegisterUserFields, useRegisterForm } from 'hooks/react-hook-form/useRegister'
import { ChangeEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as API from 'api/Api'
import { StatusCode } from 'constants/errorConstants'
import authStore from 'stores/auth.store'
import { Button, Form, FormLabel } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { routes } from 'constants/routesConstants'
import { FaCircleUser } from 'react-icons/fa6'

const RegisterForm = () => {
    const navigate = useNavigate()
    const { handleSubmit, errors, control } = useRegisterForm()
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [file, setFile] = useState<File | null>(null)

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState)
    }
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(prevState => !prevState)
    }

    const onSubmit = handleSubmit(async (data: RegisterUserFields) => {
        try {
            const formData = new FormData()
            formData.append('email', data.email)
            formData.append('first_name', data.first_name)
            formData.append('last_name', data.last_name)
            formData.append('password', data.password)
            formData.append('confirm_password', data.confirm_password)
            if (file) {
                formData.append('file', file, file.name)
            }


            const response = await API.createUser(data)

            if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
                setApiError(response.data.message)
                setShowError(true)
            } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
                setApiError(response.data.message)
                setShowError(true)
            } else {
                const fileResponse = await API.uploadAvatar(
                    formData,
                    response.data.id,
                )
                if (fileResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
                    setApiError(fileResponse.data.message)
                    setShowError(true)
                } else if (
                    fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
                ) {
                    setApiError(fileResponse.data.message)
                    setShowError(true)
                } else {
                    const loginResponse = await API.login({
                        email: data.email,
                        password: data.password,
                    })
                    if (loginResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
                        setApiError(loginResponse.data.message)
                        setShowError(true)
                    } else if (loginResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
                        setApiError(loginResponse.data.message)
                        setShowError(true)
                    } else {

                        authStore.login(loginResponse.data)
                        navigate('/')
                    }
                }


            }

        } catch (error) {
            setApiError('An error occurred. Please try again later.')
            setShowError(true)
        }
    })

    const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.files) {
            const myfile = target.files[0]
            setFile(myfile)
        }
    }
    const handleRemoveImage = () => {
        setFile(null)
    }

    return (
        <>
            <div className='d-flex flex-column align-items-center justify-content-center'>
                <h2 className="display-5 fw-bold">Sing up</h2>
                <p className='text-center  w-75'>Your name will apperar on posts and you public profile.</p>
                <Form className="register-form pt-0" onSubmit={onSubmit}>
                    <Form.Group className="mb-3">
                        <div className="image-upload-container">
                            {!file && (
                                <label htmlFor="file" className="add-image-button">
                                    <input
                                        type="file"
                                        id="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                    <div className="nav-profile-button-big"><FaCircleUser className='nav-profile-button-icon' /></div>
                                </label>
                            )}
                            {file && (
                                <div className="selected-image-container">
                                    <img className='selected-img' src={URL.createObjectURL(file)} alt="Selected" />
                                    <Button onClick={handleRemoveImage} className='x-button pt-0 pb-3 ps-0 mb-5'>
                                        X
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Form.Group>

                    <Controller
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <Form.Group className="mb-3">
                                <FormLabel htmlFor="email">E-mail</FormLabel>
                                <input
                                    {...field}
                                    type="email"
                                    placeholder="example@gmail.com"
                                    aria-label="Email"
                                    aria-describedby="email"
                                    className={
                                        errors.email ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
                                    }
                                />
                                {errors.email && (
                                    <div className="invalid-feedback text-danger">
                                        {errors.email.message}
                                    </div>
                                )}
                            </Form.Group>
                        )}
                    />
                    <div className="row">
                        <div className="col">
                            <Controller
                                control={control}
                                name="first_name"
                                render={({ field }) => (
                                    <Form.Group className="mb-3">
                                        <FormLabel htmlFor="first_name">First name</FormLabel>
                                        <input
                                            {...field}
                                            type="text"
                                            aria-label="First name"
                                            aria-describedby="first_name"
                                            placeholder='John'
                                            className={
                                                errors.first_name ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
                                            }
                                        />
                                        {errors.first_name && (
                                            <div className="invalid-feedback text-danger">
                                                {errors.first_name.message}
                                            </div>
                                        )}
                                    </Form.Group>
                                )}
                            />
                        </div>
                        <div className="col">
                            <Controller
                                control={control}
                                name="last_name"
                                render={({ field }) => (
                                    <Form.Group className="mb-3">
                                        <FormLabel htmlFor="last_name">Last name</FormLabel>
                                        <input
                                            {...field}
                                            type="text"
                                            aria-label="Last name"
                                            aria-describedby="last_name"
                                            placeholder='Doe'
                                            className={
                                                errors.last_name ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
                                            }
                                        />
                                        {errors.last_name && (
                                            <div className="invalid-feedback text-danger">
                                                {errors.last_name.message}
                                            </div>
                                        )}
                                    </Form.Group>
                                )}
                            />
                        </div>
                    </div>

                    <Controller
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <Form.Group className="mb-3">
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <div className="input-group">
                                    <input
                                        {...field}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="******"
                                        aria-label="Password"
                                        aria-describedby="password"
                                        className={
                                            errors.password ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary form-rounded"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <BsEyeSlash /> : <BsEye />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <div className="invalid-feedback text-danger">
                                        {errors.password.message}
                                    </div>
                                )}
                            </Form.Group>
                        )}
                    />

                    <Controller
                        control={control}
                        name="confirm_password"
                        render={({ field }) => (
                            <Form.Group className="mb-3">
                                <FormLabel htmlFor="confirm_password">Confirm password</FormLabel>
                                <div className="input-group">
                                    <input
                                        {...field}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="******"
                                        aria-label="Confirm password"
                                        aria-describedby="confirm_password"
                                        className={
                                            errors.password ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary form-rounded"
                                        onClick={toggleConfirmPasswordVisibility}
                                    >
                                        {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <div className="invalid-feedback text-danger">
                                        {errors.password.message}
                                    </div>
                                )}
                            </Form.Group>
                        )}
                    />
                    <Button className="w-100 btn btn-success mb-2" type="submit">
                        Sing up
                    </Button>

                    <div className="d-flex flex-column mb-4 pb-4">
                        <div className="d-flex justify-content-between">
                            <p className="mb-0 pe-5">Already have an account?</p>
                            <Link className="text-decoration-none link-green ps-4" to={routes.LOGIN}>
                                Sign in
                            </Link>
                        </div>
                    </div>
                </Form>

            </div>
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

export default RegisterForm
