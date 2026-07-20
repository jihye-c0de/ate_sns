import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import { useAuth } from '../context/AuthContext';
import { createPost, uploadPostImage } from '../lib/posts';
import { withTimeout } from '../utils/with-timeout';
import { trimTransparentPadding } from '../utils/trim-transparent';
import { extractUrl } from '../utils/url';

const BACKGROUND_REMOVAL_TIMEOUT_MS = 20000;

/**
 * CreatePostPage 컴포넌트
 *
 * Props:
 * @param {boolean} calendarOnly - true면 게시물 피드/탐색/마이페이지 게시물 탭에는 노출되지 않고
 *   캘린더에만 추가되는 기록으로 저장 [Optional, 기본값: false]
 *
 * Example usage:
 * <CreatePostPage calendarOnly />
 */
function CreatePostPage({ calendarOnly = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState('');
  const [originalFile, setOriginalFile] = useState(null);
  const [processedBlob, setProcessedBlob] = useState(null);
  const [isCutout, setIsCutout] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('카페');
  const [placeName, setPlaceName] = useState('');
  const [placeUrl, setPlaceUrl] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    setProcessing(true);
    setOriginalFile(file);
    setProcessedBlob(null);
    setIsCutout(false);
    try {
      const removeImageBackground = async () => {
        const { removeBackground } = await import('@imgly/background-removal');
        const cutout = await removeBackground(file, {
          publicPath: `${window.location.origin}${import.meta.env.BASE_URL}bg-removal/`,
          model: 'isnet_quint8',
        });
        return trimTransparentPadding(cutout);
      };
      const blob = await withTimeout(removeImageBackground(), BACKGROUND_REMOVAL_TIMEOUT_MS);
      setProcessedBlob(blob);
      setIsCutout(true);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (removalError) {
      console.error('배경 제거 실패:', removalError);
      setError('사진 배경 제거를 완료하지 못해 원본 사진으로 진행할게요.');
      setProcessedBlob(file);
      setIsCutout(false);
      setPreviewUrl(URL.createObjectURL(file));
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!processedBlob || !user) return;
    setSubmitting(true);
    setError('');
    try {
      const imageUrl = await uploadPostImage(user.id, processedBlob);
      const originalImageUrl = isCutout ? await uploadPostImage(user.id, originalFile) : imageUrl;
      const post = await createPost({
        userId: user.id,
        caption,
        imageUrl,
        originalImageUrl,
        category,
        placeName,
        placeUrl: extractUrl(placeUrl),
        isCutout,
        isCalendarOnly: calendarOnly,
      });
      navigate(calendarOnly ? '/mypage' : `/post/${post.id}`);
    } catch (submitError) {
      console.error('게시물 저장 실패:', submitError);
      setError('게시물을 저장하지 못했어요. 다시 시도해주세요.');
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography component="h1" sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 700, mb: 2 }}>
        {calendarOnly ? '캘린더에 기록 추가' : '오늘의 기록'}
      </Typography>
      {calendarOnly && (
        <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', mb: 2 }}>
          게시물로 올라가지 않고 내 캘린더에만 기록돼요.
        </Typography>
      )}

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          width: '100%',
          aspectRatio: '1 / 1',
          bgcolor: 'background.paper',
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          mb: 2,
          overflow: 'hidden',
        }}
      >
        {previewUrl && !processing && (
          <Box component="img" src={previewUrl} alt="미리보기" sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 2 }} />
        )}
        {processing && (
          <Stack alignItems="center" spacing={1}>
            <CircularProgress color="secondary" />
            <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
              배경을 자동으로 지우는 중이에요...
            </Typography>
          </Stack>
        )}
        {!previewUrl && !processing && (
          <Stack alignItems="center" spacing={1} sx={{ color: 'text.secondary' }}>
            <PhotoCameraRoundedIcon sx={{ fontSize: 48 }} />
            <Typography sx={{ fontSize: '0.85rem' }}>사진을 촬영하거나 선택해주세요</Typography>
          </Stack>
        )}
        <Box
          component="input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
        />
      </Box>

      <Stack spacing={2}>
        <TextField
          label="글귀"
          placeholder="오늘의 한 잔은 어땠나요?"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          multiline
          minRows={2}
          fullWidth
        />

        <ToggleButtonGroup
          value={category}
          exclusive
          onChange={(_event, value) => value && setCategory(value)}
          color="secondary"
          fullWidth
        >
          <ToggleButton value="카페">카페</ToggleButton>
          <ToggleButton value="음식점">음식점</ToggleButton>
        </ToggleButtonGroup>

        <TextField
          label="장소 이름"
          value={placeName}
          onChange={(event) => setPlaceName(event.target.value)}
          fullWidth
        />
        <TextField
          label="네이버 지도 링크 (선택)"
          placeholder="https://naver.me/..."
          value={placeUrl}
          onChange={(event) => setPlaceUrl(event.target.value)}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!processedBlob || processing || submitting}
          fullWidth
        >
          {submitting
            ? calendarOnly
              ? '추가하는 중...'
              : '게시 중...'
            : calendarOnly
              ? '캘린더에 추가하기'
              : '게시하기'}
        </Button>
      </Stack>
    </Box>
  );
}

export default CreatePostPage;
