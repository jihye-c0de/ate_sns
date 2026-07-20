import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import { useAuth } from '../context/AuthContext';
import { fetchNotifications } from '../lib/notifications';
import { formatRelativeDate } from '../utils/date';

/**
 * NotificationsPage 컴포넌트
 *
 * Props: 없음 (라우트로 렌더링되는 페이지)
 */
function NotificationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchNotifications(user.id)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box>
      <Typography component="h1" sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 700, mb: 2 }}>
        알림
      </Typography>

      {items.length === 0 && (
        <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 6 }}>
          아직 알림이 없어요.
        </Typography>
      )}

      <Stack divider={<Divider />} spacing={1.5}>
        {items.map((item) => (
          <Stack key={item.id} direction="row" spacing={1.5} alignItems="center" sx={{ py: 0.5 }}>
            <Avatar
              component={RouterLink}
              to={`/mypage/${item.actor?.username}`}
              src={item.actor?.avatar_url}
              sx={{ width: 40, height: 40 }}
            >
              {item.actor?.display_name?.[0] ?? '?'}
            </Avatar>
            <Box sx={{ color: 'secondary.main' }}>
              {item.type === 'comment' ? <ChatBubbleRoundedIcon fontSize="small" /> : <PersonAddRoundedIcon fontSize="small" />}
            </Box>
            <Box
              onClick={item.type === 'comment' ? () => navigate(`/post/${item.postId}`) : undefined}
              sx={{
                flexGrow: 1,
                cursor: item.type === 'comment' ? 'pointer' : 'default',
              }}
            >
              <Typography sx={{ fontSize: '0.9rem' }}>
                <Box
                  component={RouterLink}
                  to={`/mypage/${item.actor?.username}`}
                  onClick={(event) => event.stopPropagation()}
                  sx={{ fontWeight: 600, color: 'inherit', textDecoration: 'none' }}
                >
                  {item.actor?.display_name || item.actor?.username}
                </Box>{' '}
                {item.type === 'comment' ? `님이 댓글을 남겼어요: "${item.content}"` : '님이 나를 팔로우했어요'}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                {formatRelativeDate(item.createdAt)}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>

      <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', textAlign: 'center', mt: 4 }}>
        <FavoriteRoundedIcon sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
        좋아요 알림은 추후 지원될 예정이에요
      </Typography>
    </Box>
  );
}

export default NotificationsPage;
