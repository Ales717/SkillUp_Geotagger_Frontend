import Layout from 'components/ui/Layout'
import { FC, useState } from 'react'
import { useQuery } from 'react-query'
import * as API from 'api/Api'
import authStore from 'stores/auth.store'
import { LocationTypeId } from 'models/location'
import LocationCard from 'components/location/LocationCard'


const Home: FC = () => {
  const [displayedCount, setDisplayedCount] = useState(15)

  const { data, isLoading } = useQuery(
    ['getLocations'],
    () => API.getLocations()
  )

  const loadMore = () => {
    setDisplayedCount((prevCount) => Math.min(prevCount + 5, data?.data.length))
  }

  return (
    <Layout>
      <div className="p-2 mb-4">
        <div className="container-fluid py-4">

          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              {data?.data.length === 0 ? (
                <p>No data found</p>
              ) : (
                <>
                  <h2 className='text-green'>New locations</h2>
                  <p>New uploads from users. Try to guess all the locations by pressing on a picture.</p>
                  <div className="d-flex flex-wrap gap-4 justify-content-center">
                    {data?.data.slice(0, displayedCount).map((location: LocationTypeId, index: number) => (
                      <div key={index} className="">
                        <LocationCard location={location} />
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

export default Home
