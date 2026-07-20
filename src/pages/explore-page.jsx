import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchExplorePosts } from '../lib/posts';

const CATEGORIES = [
  { value: '', label: '전체' },
  { value: '카페', label: '카페' },
  { value: '음식점', label: '음식점' },
];

/**
 * ExplorePage 컴포넌트
 *
 * Props: 없음 (라우트로 렌더링되는 페이지)
 */
function ExplorePage() {
  const [category, setCategory] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchExplorePosts({ category: category || undefined })
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <Box>
      <Typography component="h1" sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 700, mb: 2 }}>
        탐색
      </Typography>

      <Tabs
        value={category}
        onChange={(_event, value) => setCategory(value)}
        sx={{ mb: 2, minHeight: 36 }}
        textColor="secondary"
        indicatorColor="secondary"
      >
        {CATEGORIES.map((item) => (
          <Tab key={item.value} value={item.value} label={item.label} sx={{ minHeight: 36, py: 0.5 }} />
        ))}
      </Tabs>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress color="secondary" />
        </Box>
      )}

      {!loading && posts.length === 0 && (
        <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 6 }}>
          해당 카테고리의 게시물이 아직 없어요.
        </Typography>
      )}

      <Grid container spacing={0.5}>
        {posts.map((post) => (
          <Grid key={post.id} size={{ xs: 4 }}>
            <Box
              component={RouterLink}
              to={`/post/${post.id}`}
              state={{ postIds: posts.map((p) => p.id) }}
              sx={{
                display: 'block',
                width: '100%',
                aspectRatio: '1 / 1',
                bgcolor: post.is_cutout ? 'transparent' : 'background.paper',
              }}
            >
              <Box
                component="img"
                src={post.image_url}
                alt={post.caption || 'post'}
                sx={{ width: '100%', height: '100%', objectFit: 'contain', p: post.is_cutout ? 0 : 1 }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ExplorePage;
