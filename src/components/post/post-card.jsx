import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { useAuth } from '../../context/AuthContext';
import { deletePost, updatePostCaption } from '../../lib/posts';
import { isPostLiked, isPostSaved, likePost, savePost, unlikePost, unsavePost } from '../../lib/social';
import { addComment } from '../../lib/comments';
import { formatRelativeDate } from '../../utils/date';
import { extractUrl } from '../../utils/url';
import CommentList from './comment-list';

/**
 * PostCard 컴포넌트
 *
 * Props:
 * @param {object} post - 게시물 데이터 (ate_users 조인 포함) [Required]
 * @param {boolean} isDetail - 상세 페이지에서 렌더링되는지 여부 [Optional, 기본값: false]
 * @param {array} feedPostIds - 같은 목록에 속한 게시물 ID 배열 (상세 페이지에서 이어서 스크롤할 때 사용) [Optional]
 * @param {function} onDeleted - 게시물이 삭제된 후 실행할 함수 [Optional]
 *
 * Example usage:
 * <PostCard post={post} feedPostIds={posts.map((p) => p.id)} />
 */
function PostCard({ post, isDetail = false, feedPostIds, onDeleted }) {
  const { user } = useAuth();
  const author = post.ate_users;
  const isOwner = user?.id === post.user_id;

  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentInputOpen, setCommentInputOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState(post.caption || '');
  const [commentRefresh, setCommentRefresh] = useState(0);

  useEffect(() => {
    if (!user) {
      setLiked(false);
      setSaved(false);
      return;
    }
    let cancelled = false;
    Promise.all([isPostLiked(user.id, post.id), isPostSaved(user.id, post.id)]).then(
      ([likedResult, savedResult]) => {
        if (cancelled) return;
        setLiked(likedResult);
        setSaved(savedResult);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [user, post.id]);

  const handleLike = async () => {
    if (!user) return;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((count) => count + (nextLiked ? 1 : -1));
    try {
      if (nextLiked) {
        await likePost(user.id, post.id);
      } else {
        await unlikePost(user.id, post.id);
      }
    } catch {
      setLiked(!nextLiked);
      setLikesCount((count) => count + (nextLiked ? -1 : 1));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    const nextSaved = !saved;
    setSaved(nextSaved);
    try {
      if (nextSaved) {
        await savePost(user.id, post.id);
      } else {
        await unsavePost(user.id, post.id);
      }
    } catch {
      setSaved(!nextSaved);
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!commentText.trim() || !user) return;
    setCommentSubmitting(true);
    try {
      await addComment(post.id, user.id, commentText.trim());
      setCommentText('');
      setCommentInputOpen(false);
      setCommentRefresh((n) => n + 1);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/post/${post.id}`;
    if (navigator.share) {
      await navigator.share({ title: 'ate', url: shareUrl }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
  };

  const handleSaveCaption = async () => {
    await updatePostCaption(post.id, caption);
    setEditing(false);
  };

  const handleDelete = async () => {
    setMenuAnchor(null);
    if (!window.confirm('이 게시물을 삭제할까요?')) return;
    await deletePost(post.id);
    onDeleted?.(post.id);
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 0, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 2, pt: 2 }}>
        <Avatar
          component={RouterLink}
          to={`/mypage/${author?.username}`}
          src={author?.avatar_url}
          sx={{ width: 36, height: 36 }}
        >
          {author?.display_name?.[0] ?? '?'}
        </Avatar>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            component={RouterLink}
            to={`/mypage/${author?.username}`}
            sx={{ fontWeight: 600, fontSize: '0.95rem', color: 'text.primary', textDecoration: 'none' }}
          >
            {author?.display_name || author?.username}
          </Typography>
          {post.place_name ? (
            <Stack direction="row" spacing={0.3} alignItems="center">
              <PlaceRoundedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
              {post.place_url ? (
                <Link
                  href={extractUrl(post.place_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ fontSize: '0.75rem' }}
                >
                  {post.place_name}
                </Link>
              ) : (
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{post.place_name}</Typography>
              )}
            </Stack>
          ) : (
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              {formatRelativeDate(post.created_at)}
            </Typography>
          )}
        </Box>
        {isOwner && (
          <>
            <IconButton size="small" onClick={(event) => setMenuAnchor(event.currentTarget)}>
              <MoreVertRoundedIcon />
            </IconButton>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
              <MenuItem
                onClick={() => {
                  setMenuAnchor(null);
                  setEditing(true);
                }}
              >
                글 수정
              </MenuItem>
              <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                삭제
              </MenuItem>
            </Menu>
          </>
        )}
      </Stack>

      <Box
        component={isDetail ? 'div' : RouterLink}
        to={isDetail ? undefined : `/post/${post.id}`}
        state={isDetail ? undefined : { postIds: feedPostIds }}
        sx={{
          display: 'block',
          width: '100%',
          aspectRatio: '4 / 5',
          maxHeight: 480,
          mt: 2,
        }}
      >
        <Box
          component="img"
          src={post.image_url}
          alt={post.caption || 'post'}
          sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </Box>

      <CardActions sx={{ px: 2, pt: 1, pb: 0 }}>
        <IconButton onClick={handleLike} disabled={!user} size="small">
          {liked ? <FavoriteRoundedIcon color="error" /> : <FavoriteBorderRoundedIcon />}
        </IconButton>
        <IconButton onClick={() => setCommentInputOpen((open) => !open)} disabled={!user} size="small">
          <ChatBubbleOutlineRoundedIcon />
        </IconButton>
        <IconButton onClick={handleSave} disabled={!user} size="small">
          {saved ? <BookmarkRoundedIcon /> : <BookmarkBorderRoundedIcon />}
        </IconButton>
        <IconButton onClick={handleShare} size="small" sx={{ ml: 'auto' }}>
          <ShareRoundedIcon />
        </IconButton>
      </CardActions>

      {commentInputOpen && user && (
        <Stack component="form" direction="row" spacing={1} onSubmit={handleCommentSubmit} sx={{ px: 2, pb: 1 }}>
          <TextField
            fullWidth
            size="small"
            autoFocus
            placeholder="댓글 달기..."
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
          />
          <IconButton type="submit" color="primary" disabled={!commentText.trim() || commentSubmitting}>
            <SendRoundedIcon />
          </IconButton>
        </Stack>
      )}

      <CardContent sx={{ pt: 1 }}>
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, mb: 0.5 }}>좋아요 {likesCount}개</Typography>

        {editing ? (
          <Stack spacing={1} sx={{ mb: 1 }}>
            <TextField
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              multiline
              fullWidth
              size="small"
              autoFocus
            />
            <Stack direction="row" spacing={1}>
              <Button variant="contained" size="small" onClick={handleSaveCaption}>
                저장
              </Button>
              <Button size="small" onClick={() => setEditing(false)}>
                취소
              </Button>
            </Stack>
          </Stack>
        ) : (
          caption && (
            <Typography sx={{ fontSize: '0.9rem', mb: 0.5 }}>
              <Box component="span" sx={{ fontWeight: 600, mr: 0.5 }}>
                {author?.username}
              </Box>
              {caption}
            </Typography>
          )
        )}

        {post.place_name && (
          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mb: 1 }}>
            {formatRelativeDate(post.created_at)}
          </Typography>
        )}

        {isDetail && <CommentList postId={post.id} refreshSignal={commentRefresh} />}
      </CardContent>
    </Card>
  );
}

export default PostCard;
