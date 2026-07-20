import { Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute 컴포넌트
 *
 * Props:
 * @param {node} children - 로그인 시에만 보여줄 화면 [Required]
 *
 * Example usage:
 * <ProtectedRoute><CreatePostPage /></ProtectedRoute>
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
