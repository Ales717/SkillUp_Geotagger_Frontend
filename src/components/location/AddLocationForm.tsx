import { useQuery } from 'react-query'
import * as API from 'api/Api'
import { CreateUpdateLocationFields, useCreateUpdateLocationForm } from 'hooks/react-hook-form/useCreateUpdateLocation'
import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Controller } from 'react-hook-form'
import { Button, Form, FormLabel } from 'react-bootstrap'
import { StatusCode } from 'constants/errorConstants'
import { routes } from 'constants/routesConstants'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'


const AddLocationForm = () => {
    const { handleSubmit, errors, control } = useCreateUpdateLocationForm({})

    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)
    const navigate = useNavigate()
    const [file, setFile] = useState<File | null>(null)

    const { data } = useQuery(
        ['currentUser'],
        () => API.currentUser(),
    )

    const userId = data?.data.id

    const onSubmit = handleSubmit(async (data: CreateUpdateLocationFields) => {
        try {
            const formData = new FormData()
            formData.append('user_id', userId.toString())
            formData.append('latitude', data.latitude.toString())
            formData.append('longitude', data.longitude.toString())
            if (file) {
                formData.append('file', file, file.name)
            }

            if (userId) {
                data.user_id = userId
            } else {
                return
            }


            if (!file) return
            const response = await API.createLocation(data)
            if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
                setApiError(response.data.message)
                setShowError(true)
            } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
                setApiError(response.data.message)
                setShowError(true)
            } else {

                const fileResponse = await API.uploadImage(
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
                    navigate(`${routes.PROFILE}`)
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
            <div className='d-flex flex-column justify-content-center'>
                <div>
                    <h2>Add a new <span id='location-span'>Location</span>.</h2>
                </div>
                <div>
                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3">
                            <div className="image-upload-container">
                                {!file && (
                                    <label htmlFor="image" className="add-image-button">
                                        <input
                                            type="file"
                                            id="image"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                        <div className='btn-add-img'>Add Image</div>
                                    </label>
                                )}
                                {file && (
                                    <div className="selected-image-container">
                                        <img src={URL.createObjectURL(file)} alt="Selected" />
                                        <Button onClick={handleRemoveImage} className='rounded-btn'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                            </svg>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Form.Group>

                        <Controller
                            control={control}
                            name="latitude"
                            render={({ field }) => (
                                <Form.Group className="mb-3">
                                    <FormLabel htmlFor="latitude">latitude</FormLabel>
                                    <input
                                        {...field}
                                        type="number"
                                        step="any"
                                        aria-label="latitude"
                                        aria-describedby="latitude"
                                        className={
                                            errors.latitude ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
                                        }
                                    />
                                    {errors.latitude && (
                                        <div className="invalid-feedback text-danger">
                                            {errors.latitude.message}
                                        </div>
                                    )}
                                </Form.Group>
                            )}
                        />
                        <Controller
                            control={control}
                            name="longitude"
                            render={({ field }) => (
                                <Form.Group className="mb-3">
                                    <FormLabel htmlFor="longitude">longitude</FormLabel>
                                    <input
                                        {...field}
                                        type="number"
                                        step="any"
                                        aria-label="longitude"
                                        aria-describedby="latilongitudeude"
                                        className={
                                            errors.longitude ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
                                        }
                                    />
                                    {errors.longitude && (
                                        <div className="invalid-feedback text-danger">
                                            {errors.longitude.message}
                                        </div>
                                    )}
                                </Form.Group>
                            )}
                        />
                        <Button className="btn btn-success" type="submit"> Add new </Button>
                    </Form>
                </div>

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

export default AddLocationForm
