import { useQuery } from 'react-query'
import * as API from 'api/Api'
import { LocationTypeId } from 'models/location'
import { FC } from 'react'

interface Props {
    location: LocationTypeId
}

const EditableLocationCard: FC<Props> = ({ location }) => {
    return (
        <div className="location-card-editable">
            <img className="location-card-img" src={`${process.env.REACT_APP_API_URL}${location.image}`} alt="Location" />
        </div>
    )
}

export default EditableLocationCard
