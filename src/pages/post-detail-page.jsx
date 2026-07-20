import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import PostCard from '../components/post/post-card';
import CommentList from '../components/post/comment-list';
import { useAuth } from '../context/AuthContext';
import { deletePost, fetchPostById, updatePostCaption } from '../lib/posts';

/**
 * PostDetailPage 컴포넌트
 *
 * Props: 없음 (라우트로 렌더링되는 페이지, useParams로 postId 조회)
 */
function PostDetailPage() {
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    fetchPostById(postId)
      .then((data) => {
        setPost(data);
        setCaption(data.caption || '');
      })
      .finally(() => setLoading(false));
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
    navigate('/');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!post) {
    return <Typography sx={{ textAlign: 'center', py: 8 }}>게시물을 찾을 수 없어요.</Typography>;
  }

  return (
    <Box>
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

      <Divider sx={{ mb: 2 }} />
      <CommentList postId={post.id} />
    </Box>
  );
}

export default PostDetailPage;
