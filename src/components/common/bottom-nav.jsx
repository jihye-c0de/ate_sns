import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

const NAV_ITEMS = [
  { value: '/', label: '홈', icon: <HomeRoundedIcon /> },
  { value: '/explore', label: '탐색', icon: <SearchRoundedIcon /> },
  { value: '/create', label: '작성', icon: <AddCircleRoundedIcon sx={{ fontSize: 44 }} /> },
  { value: '/notifications', label: '알림', icon: <FavoriteBorderRoundedIcon /> },
  { value: '/mypage', label: '마이페이지', icon: <PersonRoundedIcon /> },
];

/**
 * BottomNav 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <BottomNav />
 */
function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentValue = useMemo(() => {
    const match = NAV_ITEMS.find((item) => item.value === location.pathname);
    return match ? match.value : false;
  }, [location.pathname]);

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 'sm',
        zIndex: (theme) => theme.zIndex.appBar,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <BottomNavigation
        showLabels
        value={currentValue}
        onChange={(_event, newValue) => navigate(newValue)}
        sx={{ height: { xs: 64, md: 72 } }}
      >
        {NAV_ITEMS.map((item) => (
          <BottomNavigationAction
            key={item.value}
            value={item.value}
            label={item.label}
            icon={
              item.value === '/create' ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main',
                  }}
                >
                  {item.icon}
                </Box>
              ) : (
                item.icon
              )
            }
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
