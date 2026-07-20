import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import { useAuth } from '../../context/AuthContext';
import { adjustPostLikes } from '../../lib/posts';
import { isPostSaved, savePost, unsavePost } from '../../lib/social';
import { formatRelativeDate } from '../../utils/date';

/**
 * PostCard 컴포넌트
 *
 * Props:
 * @param {object} post - 게시물 데이터 (ate_users 조인 포함) [Required]
 * @param {boolean} isDetail - 상세 페이지에서 렌더링되는지 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <PostCard post={post} />
 */
function PostCard({ post, isDetail = false }) {
  const { user } = useAuth();
  const author = post.ate_users;
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedChecked, setSavedChecked] = useState(false);

  const checkSaved = async () => {
    if (!user || savedChecked) return;
    const result = await isPostSaved(user.id, post.id);
    setSaved(result);
    setSavedChecked(true);
  };

  const handleLike = async () => {
    if (!user) return;
    const delta = liked ? -1 : 1;
    setLiked(!liked);
    setLikesCount((count) => count + delta);
    try {
      await adjustPostLikes(post.id, delta);
    } catch {
      setLiked(liked);
      setLikesCount((count) => count - delta);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    await checkSaved();
    try {
      if (saved) {
        await unsavePost(user.id, post.id);
        setSaved(false);
      } else {
        await savePost(user.id, post.id);
        setSaved(true);
      }
    } catch {
      /* 저장 실패 시 상태 유지 */
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
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {formatRelativeDate(post.created_at)}
          </Typography>
        </Box>
        <Chip label={post.category} size="small" sx={{ bgcolor: 'background.default' }} />
      </Stack>

      <Box
        component={isDetail ? 'div' : RouterLink}
        to={isDetail ? undefined : `/post/${post.id}`}
        sx={{
          display: 'block',
          width: '100%',
          aspectRatio: '1 / 1',
          bgcolor: 'background.default',
          mt: 2,
        }}
      >
        <Box
          component="img"
          src={post.image_url}
          alt={post.caption || 'post'}
          sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 2 }}
        />
      </Box>

      <CardActions sx={{ px: 2, pt: 1, pb: 0 }}>
        <IconButton onClick={handleLike} disabled={!user} size="small">
          {liked ? <FavoriteRoundedIcon color="error" /> : <FavoriteBorderRoundedIcon />}
        </IconButton>
        <IconButton component={RouterLink} to={`/post/${post.id}`} size="small">
          <ChatBubbleOutlineRoundedIcon />
        </IconButton>
        <IconButton onClick={handleSave} onFocus={checkSaved} onMouseEnter={checkSaved} disabled={!user} size="small">
          {saved ? <BookmarkRoundedIcon /> : <BookmarkBorderRoundedIcon />}
        </IconButton>
        <IconButton onClick={handleShare} size="small" sx={{ ml: 'auto' }}>
          <ShareRoundedIcon />
        </IconButton>
      </CardActions>

      <CardContent sx={{ pt: 1 }}>
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, mb: 0.5 }}>좋아요 {likesCount}개</Typography>
        {post.caption && (
          <Typography sx={{ fontSize: '0.9rem', mb: 1 }}>
            <Box component="span" sx={{ fontWeight: 600, mr: 0.5 }}>
              {author?.username}
            </Box>
            {post.caption}
          </Typography>
        )}
        {post.place_name && (
          <Stack direction="row" spacing={0.5} alignItems="center">
            <PlaceRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            {post.place_url ? (
              <Link href={post.place_url} target="_blank" rel="noopener noreferrer" sx={{ fontSize: '0.8rem' }}>
                {post.place_name}
              </Link>
            ) : (
              <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{post.place_name}</Typography>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default PostCard;
