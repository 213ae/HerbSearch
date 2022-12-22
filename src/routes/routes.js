import { Navigate } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import ResultPage from '../pages/ResultPage'
import DetailPage from '../pages/DetailPage'
const routes = [
    {
        path: '/index',
        element: <HomePage />
    },
    {
        path: '/search',
        element: <ResultPage />
    },
    {
        path: '/:name',
        element: <DetailPage />
    },
    {
        path: '/',
        element: <Navigate to="/index" />
    }
]
export default routes;