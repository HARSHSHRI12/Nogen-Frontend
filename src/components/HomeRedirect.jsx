import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Home from '../Pages/Home';

const HomeRedirect = () => {
    const { user } = useAuth();

    if (!user) {
        return <Home />;
    }

    // Redirect based on user role
    const dashboardPath = user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard';
    
    return <Navigate to={dashboardPath} replace />;
};

export default HomeRedirect;
