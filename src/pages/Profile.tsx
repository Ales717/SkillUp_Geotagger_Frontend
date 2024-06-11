import Layout from 'components/ui/Layout'
import { useQuery } from 'react-query'
import * as API from 'api/Api'
import authStore from 'stores/auth.store'
import { FaCircleUser } from 'react-icons/fa6'
import Avatar from 'react-avatar'
import { LocationTypeId } from 'models/location'
import EditableLocationCard from 'components/location/EditableLocationCard'
import { useState } from 'react'

const Profile = () => {
    const UserId = authStore.user?.id || ''
    const [displayedCount, setDisplayedCount] = useState(5)

    const { data, isLoading } = useQuery(
        ['getLocationsByUserId'],
        () => API.getLocationsByUserId(UserId)
    )

    const loadMore = () => {
        setDisplayedCount((prevCount) => Math.min(prevCount + 5, data?.data.length))
    }

    return (
        <Layout>
            <div className="p-2 mb-4">
                <div className="container-fluid py-4">
                    {!authStore.user ? (
                        <FaCircleUser className='nav-profile-button-icon' />
                    ) : (
                        <div className='d-flex align-items-center mb-3'>
                            <Avatar
                                round
                                src={`${process.env.REACT_APP_API_URL}${authStore.user.avatar}`}
                                alt='avatar'
                                className='user-icon me-3'
                            />
                            <h1 className='font-weight-normal'>{authStore.user.first_name} {authStore.user.last_name}</h1>
                        </div>
                    )}
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <>
                            {data?.data.length === 0 ? (
                                <p>No data found</p>
                            ) : (
                                <>
                                    <h2>My uploads</h2>
                                    <div className="d-flex flex-wrap gap-4 justify-content-center">
                                        {data?.data.slice(0, displayedCount).map((location: LocationTypeId, index: number) => (
                                            <div key={index} className="">
                                                <EditableLocationCard location={location} />
                                            </div>
                                        ))}
                                    </div>
                                    {displayedCount < data?.data.length && (
                                        <div className="text-center mt-4">
                                            <button onClick={loadMore} className="btn btn-secondary">Load More</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default Profile
