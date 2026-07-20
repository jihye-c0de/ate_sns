import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PostCard from '../components/post/post-card';
import { fetchFeed } from '../lib/posts';

/**
 * HomePage 컴포넌트
 *
 * Props: 없음 (라우트로 렌더링되는 페이지)
 */
function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchFeed()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = useMemo(() => {
    if (!keyword.trim()) return posts;
    const lower = keyword.trim().toLowerCase();
    return posts.filter((post) => {
      const haystack = [post.caption, post.place_name, post.ate_users?.username, post.ate_users?.display_name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(lower);
    });
  }, [posts, keyword]);

  return (
    <Box>
      <Typography component="h1" sx={{ fontSize: { xs: '1.75rem', md: '2rem' }, fontWeight: 700, mb: 2 }}>
        ate
      </Typography>

      <TextField
        fullWidth
        placeholder="카페, 음식점, 유저 검색"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        size="small"
        sx={{ mb: 3, bgcolor: 'background.paper', borderRadius: 3 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress color="secondary" />
        </Box>
      )}

      {!loading && filteredPosts.length === 0 && (
        <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 6 }}>
          아직 게시물이 없어요. 첫 기록을 남겨보세요!
        </Typography>
      )}

      {filteredPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Box>
  );
}

export default HomePage;
