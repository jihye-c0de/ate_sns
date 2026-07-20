import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { useAuth } from '../context/AuthContext';
import { fetchUserPosts } from '../lib/posts';

/**
 * MapPage 컴포넌트
 *
 * Props: 없음 (라우트로 렌더링되는 페이지, 로그인한 본인이 올린 장소 목록을 모아 보여줌)
 */
function MapPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchUserPosts(user.id)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [user]);

  const places = useMemo(() => {
    const map = new Map();
    posts
      .filter((post) => post.place_name)
      .forEach((post) => {
        const key = post.place_name;
        if (!map.has(key)) {
          map.set(key, { name: post.place_name, url: post.place_url, posts: [] });
        }
        map.get(key).posts.push(post);
      });
    return Array.from(map.values());
  }, [posts]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box>
      <Typography component="h1" sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 700, mb: 1 }}>
        내가 다녀온 곳
      </Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 3 }}>
        장소명을 누르면 네이버 지도에서 확인할 수 있어요.
      </Typography>

      {places.length === 0 && (
        <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 6 }}>
          아직 등록된 장소가 없어요.
        </Typography>
      )}

      <Stack divider={<Divider />} spacing={2}>
        {places.map((place) => (
          <Stack key={place.name} direction="row" spacing={1.5} alignItems="center">
            <PlaceRoundedIcon sx={{ color: 'secondary.main' }} />
            <Box sx={{ flexGrow: 1 }}>
              {place.url ? (
                <Link
                  href={place.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                >
                  {place.name}
                  <OpenInNewRoundedIcon sx={{ fontSize: 14 }} />
                </Link>
              ) : (
                <Typography sx={{ fontWeight: 600 }}>{place.name}</Typography>
              )}
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                방문 기록 {place.posts.length}건
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.5}>
              {place.posts.slice(0, 3).map((post) => (
                <Avatar
                  key={post.id}
                  component={RouterLink}
                  to={`/post/${post.id}`}
                  variant="rounded"
                  src={post.image_url}
                  sx={{ width: 36, height: 36, bgcolor: 'background.default' }}
                />
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

export default MapPage;
