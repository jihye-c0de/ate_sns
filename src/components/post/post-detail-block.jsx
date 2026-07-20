import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import PostCard from './post-card';
import CommentList from './comment-list';
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
  const [commentRefresh, setCommentRefresh] = useState(0);

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

  return (
    <Box>
      <PostCard
        post={post}
        isDetail
        onDeleted={onDeleted}
        onCommentAdded={() => setCommentRefresh((n) => n + 1)}
      />
      <Divider sx={{ mb: 3 }} />
      <CommentList postId={post.id} refreshSignal={commentRefresh} />
      <Divider sx={{ mt: 3, mb: 3 }} />
    </Box>
  );
}

export default PostDetailBlock;
