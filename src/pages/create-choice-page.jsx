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
      icon: <PhotoCameraRoundedIcon sx={{ fontSize: 44 }} />,
      title: '게시물 작성',
      description: '피드에 올라가는\n게시물을 작성해요',
    },
    {
      to: '/create/calendar',
      icon: <CalendarMonthRoundedIcon sx={{ fontSize: 44 }} />,
      title: '캘린더 기록 추가',
      description: '게시물로는 안 올리고\n캘린더에만 기록해요',
    },
  ];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 200px)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {options.map((option) => (
          <ButtonBase
            key={option.to}
            onClick={() => navigate(option.to)}
            sx={{
              width: '47%',
              aspectRatio: '1 / 1',
              bgcolor: 'background.paper',
              borderRadius: '30px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              p: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Stack alignItems="center" justifyContent="center" spacing={1.5} sx={{ width: '100%' }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  bgcolor: 'background.default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'secondary.main',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{option.icon}</Box>
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', textAlign: 'center' }}>
                {option.title}
              </Typography>
              <Typography
                sx={{ fontSize: '0.75rem', color: 'text.secondary', textAlign: 'center', whiteSpace: 'pre-line' }}
              >
                {option.description}
              </Typography>
            </Stack>
          </ButtonBase>
        ))}
      </Box>
    </Box>
  );
}

export default CreateChoicePage;
