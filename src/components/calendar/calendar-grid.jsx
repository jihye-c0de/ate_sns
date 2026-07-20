import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { getMonthMatrix, WEEKDAY_LABELS } from '../../utils/calendar';
import { toDateKey } from '../../utils/date';

/**
 * CalendarGrid 컴포넌트
 *
 * Props:
 * @param {array} posts - 캘린더에 표시할 게시물 목록 [Required]
 *
 * Example usage:
 * <CalendarGrid posts={posts} />
 */
function CalendarGrid({ posts }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [previewPost, setPreviewPost] = useState(null);

  const postsByDate = useMemo(() => {
    const map = new Map();
    posts.forEach((post) => {
      const key = toDateKey(post.created_at);
      if (!map.has(key)) map.set(key, post);
    });
    return map;
  }, [posts]);

  const weeks = useMemo(() => getMonthMatrix(year, month), [year, month]);

  const goPrevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 0,
        p: { xs: 1.5, md: 2 },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <IconButton onClick={goPrevMonth} size="small" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeftRoundedIcon />
        </IconButton>
        <Typography sx={{ fontWeight: 700, lineHeight: 1, display: 'flex', alignItems: 'center' }}>
          {year}.{String(month + 1).padStart(2, '0')}
        </Typography>
        <IconButton onClick={goNextMonth} size="small" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronRightRoundedIcon />
        </IconButton>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 0.5 }}>
        {WEEKDAY_LABELS.map((label) => (
          <Typography key={label} sx={{ textAlign: 'center', fontSize: '0.75rem', color: 'text.secondary' }}>
            {label}
          </Typography>
        ))}
      </Box>

      <Stack spacing={0.5}>
        {weeks.map((week, weekIndex) => (
          // eslint-disable-next-line react/no-array-index-key
          <Box key={weekIndex} sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
            {week.map((day, dayIndex) => {
              if (!day) {
                // eslint-disable-next-line react/no-array-index-key
                return <Box key={dayIndex} sx={{ aspectRatio: '1 / 1' }} />;
              }
              const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const post = postsByDate.get(dateKey);

              const cellContent = (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 0,
                    bgcolor: post && !post.is_cutout ? 'background.default' : 'transparent',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {post ? (
                    <Box
                      component="img"
                      src={post.image_url}
                      alt=""
                      sx={{ width: '100%', height: '100%', objectFit: 'contain', p: post.is_cutout ? 0 : 0.5 }}
                    />
                  ) : (
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{day}</Typography>
                  )}
                </Box>
              );

              return (
                <Box key={dateKey} sx={{ aspectRatio: '1 / 1' }}>
                  {post && post.is_calendar_only ? (
                    <Box
                      component="button"
                      type="button"
                      onClick={() => setPreviewPost(post)}
                      sx={{
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        p: 0,
                        border: 0,
                        bgcolor: 'transparent',
                        cursor: 'pointer',
                      }}
                    >
                      {cellContent}
                    </Box>
                  ) : post ? (
                    <Box
                      component={RouterLink}
                      to={`/post/${post.id}`}
                      state={{ postIds: posts.map((p) => p.id) }}
                      sx={{ display: 'block', width: '100%', height: '100%' }}
                    >
                      {cellContent}
                    </Box>
                  ) : (
                    cellContent
                  )}
                </Box>
              );
            })}
          </Box>
        ))}
      </Stack>

      <Dialog open={Boolean(previewPost)} onClose={() => setPreviewPost(null)} maxWidth="xs" fullWidth>
        {previewPost && (
          <>
            <DialogContent sx={{ p: 0 }}>
              <Box
                component="img"
                src={previewPost.image_url}
                alt=""
                sx={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'contain', display: 'block', bgcolor: 'background.default' }}
              />
              <Stack spacing={0.5} sx={{ p: 2 }}>
                {previewPost.place_name && (
                  <Typography
                    noWrap
                    sx={{ fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    {previewPost.place_name}
                  </Typography>
                )}
                {previewPost.caption && (
                  <Typography noWrap sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                    {previewPost.caption}
                  </Typography>
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPreviewPost(null)} fullWidth>
                닫기
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default CalendarGrid;
