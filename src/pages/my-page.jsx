import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchUserPosts } from '../lib/posts';
import {
  fetchFollowCounts,
  fetchProfileById,
  fetchProfileByUsername,
  followUser,
  isFollowing,
  unfollowUser,
  uploadAvatarImage,
} from '../lib/social';
import { supabase } from '../lib/supabase';
import CalendarGrid from '../components/calendar/calendar-grid';

/**
 * MyPage 컴포넌트
 *
 * Props: 없음 (라우트로 렌더링, username 파라미터가 없으면 본인 프로필)
 */
function MyPage() {
  const { username } = useParams();
  const { user, signOut, refreshProfile } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [counts, setCounts] = useState({ followerCount: 0, followingCount: 0 });
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('posts');
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

  const isOwnProfile = !username;

  useEffect(() => {
    if (isOwnProfile && !user) return;

    let cancelled = false;
    setLoading(true);

    const load = async () => {
      try {
        const targetProfile = isOwnProfile
          ? await fetchProfileById(user.id)
          : await fetchProfileByUsername(username);
        if (cancelled) return;
        if (!targetProfile) return;

        setProfile(targetProfile);
        setDisplayName(targetProfile.display_name || '');
        setBio(targetProfile.bio || '');

        const [userPosts, followCounts] = await Promise.all([
          fetchUserPosts(targetProfile.id),
          fetchFollowCounts(targetProfile.id),
        ]);
        if (cancelled) return;
        setPosts(userPosts);
        setCounts(followCounts);

        if (!isOwnProfile && user) {
          const result = await isFollowing(user.id, targetProfile.id);
          if (!cancelled) setFollowing(result);
        }
      } catch (error) {
        console.error('마이페이지를 불러오지 못했어요:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [isOwnProfile, username, user]);

  const handleToggleFollow = async () => {
    if (!user || !profile) return;
    if (following) {
      await unfollowUser(user.id, profile.id);
      setFollowing(false);
      setCounts((prev) => ({ ...prev, followerCount: prev.followerCount - 1 }));
    } else {
      await followUser(user.id, profile.id);
      setFollowing(true);
      setCounts((prev) => ({ ...prev, followerCount: prev.followerCount + 1 }));
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileError('');
    try {
      let avatarUrl = profile.avatar_url;
      if (avatarFile) {
        avatarUrl = await uploadAvatarImage(user.id, avatarFile);
      }
      const { error } = await supabase
        .from('ate_users')
        .update({ display_name: displayName, bio, avatar_url: avatarUrl })
        .eq('id', profile.id);
      if (error) throw error;
      setProfile((prev) => ({ ...prev, display_name: displayName, bio, avatar_url: avatarUrl }));
      setAvatarFile(null);
      setAvatarPreview('');
      await refreshProfile();
      setEditing(false);
    } catch (saveError) {
      console.error('프로필 저장 실패:', saveError);
      setProfileError(saveError.message || '프로필을 저장하지 못했어요. 다시 시도해주세요.');
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!profile) {
    return <Typography sx={{ textAlign: 'center', py: 8 }}>사용자를 찾을 수 없어요.</Typography>;
  }

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar src={avatarPreview || profile.avatar_url} sx={{ width: 72, height: 72 }}>
            {profile.display_name?.[0] ?? '?'}
          </Avatar>
          {isOwnProfile && editing && (
            <IconButton
              component="label"
              size="small"
              sx={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
                '&:hover': { bgcolor: 'secondary.dark' },
              }}
            >
              <PhotoCameraRoundedIcon sx={{ fontSize: 16 }} />
              <Box
                component="input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                sx={{ display: 'none' }}
              />
            </IconButton>
          )}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
            {profile.display_name || profile.username}
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>@{profile.username}</Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
            <Typography sx={{ fontSize: '0.85rem' }}>게시물 {posts.length}</Typography>
            <Typography sx={{ fontSize: '0.85rem' }}>팔로워 {counts.followerCount}</Typography>
            <Typography sx={{ fontSize: '0.85rem' }}>팔로잉 {counts.followingCount}</Typography>
          </Stack>
        </Box>
      </Stack>

      {profile.bio && !editing && (
        <Typography sx={{ fontSize: '0.9rem', mb: 2 }}>{profile.bio}</Typography>
      )}

      {isOwnProfile ? (
        editing ? (
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            {profileError && <Alert severity="error">{profileError}</Alert>}
            <TextField
              label="표시 이름"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="소개글"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              size="small"
              multiline
              fullWidth
            />
            <Stack direction="row" spacing={1}>
              <Button variant="contained" size="small" onClick={handleSaveProfile} disabled={savingProfile}>
                {savingProfile ? '저장 중...' : '저장'}
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setEditing(false);
                  setAvatarFile(null);
                  setAvatarPreview('');
                }}
              >
                취소
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Button variant="outlined" size="small" onClick={() => setEditing(true)}>
              프로필 편집
            </Button>
            <Button component={RouterLink} to="/map" variant="outlined" size="small">
              내 지도
            </Button>
            <Button size="small" color="error" onClick={signOut}>
              로그아웃
            </Button>
          </Stack>
        )
      ) : (
        user && (
          <Button
            variant={following ? 'outlined' : 'contained'}
            size="small"
            onClick={handleToggleFollow}
            sx={{ mb: 3 }}
          >
            {following ? '팔로잉' : '팔로우'}
          </Button>
        )
      )}

      <Tabs value={tab} onChange={(_event, value) => setTab(value)} sx={{ mb: 2, minHeight: 36 }} textColor="secondary" indicatorColor="secondary">
        <Tab value="posts" label="게시물" sx={{ minHeight: 36 }} />
        <Tab value="calendar" label="먹은 기록 캘린더" sx={{ minHeight: 36 }} />
      </Tabs>

      {tab === 'posts' && (
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
                  alt=""
                  sx={{ width: '100%', height: '100%', objectFit: 'contain', p: post.is_cutout ? 0 : 1 }}
                />
              </Box>
            </Grid>
          ))}
          {posts.length === 0 && (
            <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 4, width: '100%' }}>
              아직 게시물이 없어요.
            </Typography>
          )}
        </Grid>
      )}

      {tab === 'calendar' && <CalendarGrid posts={posts} />}
    </Box>
  );
}

export default MyPage;
