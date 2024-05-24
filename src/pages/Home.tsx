import Layout from 'components/ui/Layout'
import { FC } from 'react'


const Home: FC = () => {
  /*const { data} = useQuery(
    ['currentUser'],
    () => API.currentUser(),
  )*/

  return (
    <Layout>
      <div className="p-2 mb-4">
        <div className="container-fluid py-4">
          <h1 className="display-5 fw-bold">Home</h1>
        </div>
      </div>
    </Layout>
  )
}

export default Home
