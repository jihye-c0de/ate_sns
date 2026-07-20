import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useAuth } from '../../context/AuthContext';
import { deleteComment, fetchComments } from '../../lib/comments';
import { formatRelativeDate } from '../../utils/date';

/**
 * CommentList 컴포넌트
 *
 * Props:
 * @param {number} postId - 댓글을 표시할 게시물 ID [Required]
 * @param {number} refreshSignal - 값이 바뀔 때마다 댓글 목록을 다시 불러옴 [Optional]
 *
 * Example usage:
 * <CommentList postId={post.id} refreshSignal={commentRefresh} />
 */
function CommentList({ postId, refreshSignal }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments(postId)
      .then(setComments)
      .finally(() => setLoading(false));
  }, [postId, refreshSignal]);

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
    </Box>
  );
}

export default CommentList;
