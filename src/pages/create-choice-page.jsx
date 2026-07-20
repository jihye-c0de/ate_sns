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
      icon: <PhotoCameraRoundedIcon sx={{ fontSize: 36 }} />,
      title: '게시물 작성',
      description: '피드에 올라가는 게시물을 작성해요',
    },
    {
      to: '/create/calendar',
      icon: <CalendarMonthRoundedIcon sx={{ fontSize: 36 }} />,
      title: '캘린더 기록 추가',
      description: '게시물로는 안 올리고 캘린더에만 기록해요',
    },
  ];

  return (
    <Box>
      <Typography component="h1" sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 700, mb: 3 }}>
        무엇을 기록할까요?
      </Typography>

      <Stack spacing={2}>
        {options.map((option) => (
          <ButtonBase
            key={option.to}
            onClick={() => navigate(option.to)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 3,
              borderRadius: 0,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              textAlign: 'left',
            }}
          >
            <Box sx={{ color: 'secondary.main' }}>{option.icon}</Box>
            <Box>
              <Typography sx={{ fontWeight: 700 }}>{option.title}</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                {option.description}
              </Typography>
            </Box>
          </ButtonBase>
        ))}
      </Stack>
    </Box>
  );
}

export default CreateChoicePage;
