import { apiRoutes } from 'constants/apiConstants'
import { apiRequest } from './Api'
import { UserType } from 'models/auth'
import { LoginUserFields } from 'hooks/react-hook-form/useLogin'
import { RegisterUserFields } from 'hooks/react-hook-form/useRegister'

export const signout = async () =>
  apiRequest<undefined, void>('post', apiRoutes.SIGNOUT)

export const login = async (data: LoginUserFields) =>
  apiRequest<LoginUserFields, UserType>('post', apiRoutes.LOGIN, data)

export const createUser = async (data: RegisterUserFields) =>
  apiRequest<RegisterUserFields, void>('post', apiRoutes.USERS_PREFIX, data)

export const currentUser = async () =>
  apiRequest<undefined, UserType>('get', `${apiRoutes.FETCH_USER}`)

export const uploadAvatar = async (formData: FormData, id: string) =>
  apiRequest<FormData, void>(
    'post',
    `${apiRoutes.UPLOAD_AVATAR_IMAGE}/${id}`,
    formData,
  )

export const addPoints = async (id: string) =>
  apiRequest<undefined, UserType>(
    'patch',
    `${apiRoutes.USERS_PREFIX}/pointsAdd/${id}`,
  )