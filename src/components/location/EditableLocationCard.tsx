import { useQuery } from 'react-query'
import * as API from 'api/Api'
import { LocationTypeId } from 'models/location'
import { FC } from 'react'

interface Props {
    location: LocationTypeId
}

const EditableLocationCard: FC<Props> = ({ location }) => {
    return (
        <div>
            <div className="location-card">
                <img className="location-card-img" src={`${process.env.REACT_APP_API_URL}${location.image}`} alt="Location" />
            </div>
        </div>
    )
}

export default EditableLocationCard
