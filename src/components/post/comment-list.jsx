import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useAuth } from '../../context/AuthContext';
import { addComment, deleteComment, fetchComments } from '../../lib/comments';
import { formatRelativeDate } from '../../utils/date';

/**
 * CommentList 컴포넌트
 *
 * Props:
 * @param {number} postId - 댓글을 표시할 게시물 ID [Required]
 *
 * Example usage:
 * <CommentList postId={post.id} />
 */
function CommentList({ postId }) {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments(postId)
      .then(setComments)
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim() || !user) return;
    const newComment = await addComment(postId, user.id, content.trim());
    setComments((prev) => [...prev, { ...newComment, ate_users: profile }]);
    setContent('');
  };

  const handleDelete = async (commentId) => {
    await deleteComment(commentId);
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  };

  if (loading) return null;

  return (
    <Box sx={{ mt: 1 }}>
      <Stack spacing={1.5} sx={{ mb: 2 }}>
        {comments.map((comment) => (
          <Stack key={comment.id} direction="row" spacing={1.5} alignItems="flex-start">
            <Avatar
              component={RouterLink}
              to={`/mypage/${comment.ate_users?.username}`}
              src={comment.ate_users?.avatar_url}
              sx={{ width: 28, height: 28 }}
            >
              {comment.ate_users?.display_name?.[0] ?? '?'}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ fontSize: '0.85rem' }}>
                <Box component="span" sx={{ fontWeight: 600, mr: 0.5 }}>
                  {comment.ate_users?.username}
                </Box>
                {comment.content}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                {formatRelativeDate(comment.created_at)}
              </Typography>
            </Box>
            {user?.id === comment.user_id && (
              <IconButton size="small" onClick={() => handleDelete(comment.id)}>
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        ))}
        {comments.length === 0 && (
          <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
            첫 댓글을 남겨보세요.
          </Typography>
        )}
      </Stack>

      {user && (
        <Stack component="form" direction="row" spacing={1} onSubmit={handleSubmit}>
          <TextField
            fullWidth
            size="small"
            placeholder="댓글 달기..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          <IconButton type="submit" color="primary" disabled={!content.trim()}>
            <SendRoundedIcon />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
}

export default CommentList;
