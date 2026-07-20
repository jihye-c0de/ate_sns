import { forwardRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import PostCard from './post-card';
import CommentList from './comment-list';
import { useAuth } from '../../context/AuthContext';
import { deletePost, fetchPostById, updatePostCaption } from '../../lib/posts';

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
const PostDetailBlock = forwardRef(function PostDetailBlock({ postId, onDeleted }, ref) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPostById(postId)
      .then((data) => {
        if (cancelled) return;
        setPost(data);
        setCaption(data.caption || '');
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  const isOwner = user && post && user.id === post.user_id;

  const handleSaveCaption = async () => {
    await updatePostCaption(post.id, caption);
    setPost((prev) => ({ ...prev, caption }));
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('이 게시물을 삭제할까요?')) return;
    await deletePost(post.id);
    if (onDeleted) {
      onDeleted(post.id);
    } else {
      navigate('/');
    }
  };

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
    <Box ref={ref}>
      <PostCard post={post} isDetail />

      {isOwner && (
        <Stack spacing={1} sx={{ mb: 3 }}>
          {editing ? (
            <>
              <TextField
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                multiline
                fullWidth
                size="small"
              />
              <Stack direction="row" spacing={1}>
                <Button variant="contained" size="small" onClick={handleSaveCaption}>
                  저장
                </Button>
                <Button size="small" onClick={() => setEditing(false)}>
                  취소
                </Button>
              </Stack>
            </>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button size="small" onClick={() => setEditing(true)}>
                글 수정
              </Button>
              <Button size="small" color="error" onClick={handleDelete}>
                삭제
              </Button>
            </Stack>
          )}
        </Stack>
      )}

      <Divider sx={{ mb: 3 }} />
      <CommentList postId={post.id} />
      <Divider sx={{ mt: 3, mb: 3 }} />
    </Box>
  );
});

export default PostDetailBlock;
