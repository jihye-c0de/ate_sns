import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';

/**
 * CreateChoicePage 컴포넌트
 *
 * Props: 없음 (라우트로 렌더링되는 페이지)
 */
function CreateChoicePage() {
  const navigate = useNavigate();

  const options = [
    {
      to: '/create/post',
      icon: <PhotoCameraRoundedIcon sx={{ fontSize: 56 }} />,
      title: '게시물 작성',
      description: '피드에 올라가는\n게시물을 작성해요',
      bgcolor: 'background.paper',
    },
    {
      to: '/create/calendar',
      icon: <CalendarMonthRoundedIcon sx={{ fontSize: 56 }} />,
      title: '캘린더 기록 추가',
      description: '게시물로는 안 올리고\n캘린더에만 기록해요',
      bgcolor: 'background.default',
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: 'calc(100vh - 168px)',
        minHeight: 420,
        mx: { xs: -2, md: -3 },
      }}
    >
      {options.map((option, index) => (
        <ButtonBase
          key={option.to}
          onClick={() => navigate(option.to)}
          sx={{
            flex: 1,
            height: '100%',
            bgcolor: option.bgcolor,
            borderRight: index === 0 ? '1px solid' : 0,
            borderColor: 'divider',
            borderRadius: 0,
          }}
        >
          <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ px: 2, height: '100%' }}>
            <Box sx={{ color: 'secondary.main' }}>{option.icon}</Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' }}>
              {option.title}
            </Typography>
            <Typography
              sx={{ fontSize: '0.85rem', color: 'text.secondary', textAlign: 'center', whiteSpace: 'pre-line' }}
            >
              {option.description}
            </Typography>
          </Stack>
        </ButtonBase>
      ))}
    </Box>
  );
}

export default CreateChoicePage;
