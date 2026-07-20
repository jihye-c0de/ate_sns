import { Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import BottomNav from './components/common/bottom-nav';
import ProtectedRoute from './components/common/protected-route';
import LoginPage from './pages/login-page';
import SignupPage from './pages/signup-page';
import HomePage from './pages/home-page';
import ExplorePage from './pages/explore-page';
import PostDetailPage from './pages/post-detail-page';
import CreateChoicePage from './pages/create-choice-page';
import CreatePostPage from './pages/create-post-page';
import MyPage from './pages/my-page';
import MapPage from './pages/map-page';
import NotificationsPage from './pages/notifications-page';

function AppLayout({ children }) {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#ffffff' }}>
      <Container
        maxWidth="sm"
        disableGutters
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          px: { xs: 2, md: 3 },
          pb: { xs: 10, md: 11 },
          pt: { xs: 2, md: 3 },
        }}
      >
        {children}
      </Container>
      <BottomNav />
    </Box>
  );
}

function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="sm" sx={{ py: 4, px: { xs: 2, md: 3 } }}>
        {children}
      </Container>
    </Box>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
      <Route path="/signup" element={<AuthLayout><SignupPage /></AuthLayout>} />
      <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
      <Route path="/explore" element={<AppLayout><ExplorePage /></AppLayout>} />
      <Route path="/post/:postId" element={<AppLayout><PostDetailPage /></AppLayout>} />
      <Route
        path="/create"
        element={
          <AppLayout>
            <ProtectedRoute>
              <CreateChoicePage />
            </ProtectedRoute>
          </AppLayout>
        }
      />
      <Route
        path="/create/post"
        element={
          <AppLayout>
            <ProtectedRoute>
              <CreatePostPage />
            </ProtectedRoute>
          </AppLayout>
        }
      />
      <Route
        path="/create/calendar"
        element={
          <AppLayout>
            <ProtectedRoute>
              <CreatePostPage calendarOnly />
            </ProtectedRoute>
          </AppLayout>
        }
      />
      <Route path="/mypage" element={<AppLayout><ProtectedRoute><MyPage /></ProtectedRoute></AppLayout>} />
      <Route path="/mypage/:username" element={<AppLayout><MyPage /></AppLayout>} />
      <Route path="/map" element={<AppLayout><ProtectedRoute><MapPage /></ProtectedRoute></AppLayout>} />
      <Route
        path="/notifications"
        element={
          <AppLayout>
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          </AppLayout>
        }
      />
    </Routes>
  );
}

export default App;
