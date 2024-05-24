import { yupResolver } from '@hookform/resolvers/yup'
import { LocationType } from 'models/location'

import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

export interface CreateUpdateLocationFields {
    latitude: number
    longitude: number
    user_id: string
}

interface Props {
    defaultValues?: LocationType
}

export const useCreateUpdateLocationForm = ({ defaultValues }: Props) => {
    const CreateUpdateLocationSchema = Yup.object().shape({
        latitude: Yup.number().required(),
        longitude: Yup.number().required(),
        user_id: Yup.string().notRequired(),
    })

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm({
        defaultValues: {
            latitude: 0,
            longitude: 0,
            user_id: '',
            ...defaultValues,
        },
        mode: 'onSubmit',
        resolver: yupResolver(CreateUpdateLocationSchema)
    })

    return {
        handleSubmit,
        errors,
        control,
        reset
    }

}
export type CreateUpdateLocationForm = ReturnType<typeof useCreateUpdateLocationForm>