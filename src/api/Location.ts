import { apiRoutes } from 'constants/apiConstants'
import { apiRequest } from './Api'
import { CreateUpdateLocationFields } from 'hooks/react-hook-form/useCreateUpdateLocation'
import { LocationType } from 'models/location'

export const createLocation = async (data: CreateUpdateLocationFields) =>
    apiRequest<CreateUpdateLocationFields, LocationType>(
        'post',
        `${apiRoutes.LOCATIONS_PREFIX}`,
        data
    )

export const uploadImage = async (formData: FormData, id: string) =>
    apiRequest<FormData, void>(
        'post',
        `${apiRoutes.UPLOAD_LOCATION_IMAGE}/${id}`,
        formData,
    )