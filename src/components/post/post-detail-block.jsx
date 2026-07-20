import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import PostCard from './post-card';
import { fetchPostById } from '../../lib/posts';

/**
 * PostDetailBlock 컴포넌트
 *
 * Props:
 * @param {number} postId - 표시할 게시물 ID [Required]
 * @param {function} onDeleted - 게시물이 삭제된 후 실행할 콜백 [Optional]
 *
 * Example usage:
 * <PostDetailBlock postId={5} />
 */
function PostDetailBlock({ postId, onDeleted }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPostById(postId)
      .then((data) => {
        if (cancelled) return;
        setPost(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!post) {
    return null;
  }

  return <PostCard post={post} isDetail onDeleted={onDeleted} />;
}

export default PostDetailBlock;
