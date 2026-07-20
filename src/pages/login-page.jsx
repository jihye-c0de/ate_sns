import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import { useAuth } from '../context/AuthContext';

/**
 * LoginPage 컴포넌트
 *
 * Props: 없음 (라우트로 렌더링되는 페이지)
 */
function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const { error: signInError } = await signIn({ email, password });
    setSubmitting(false);
    if (signInError) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      return;
    }
    navigate('/');
  };

  return (
    <Stack spacing={3} component="form" onSubmit={handleSubmit} sx={{ textAlign: 'center' }}>
      <Typography
        component="h1"
        sx={{ fontSize: { xs: '2.5rem', md: '3rem' }, fontWeight: 700, color: 'primary.main' }}
      >
        ate
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>
        오늘 방문한 카페와 음식점을 기록해보세요
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="이메일"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        fullWidth
      />
      <TextField
        label="비밀번호"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        fullWidth
      />
      <Button type="submit" variant="contained" size="large" disabled={submitting} fullWidth>
        로그인
      </Button>
      <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
        아직 계정이 없으신가요?{' '}
        <Link component={RouterLink} to="/signup">
          회원가입
        </Link>
      </Typography>
    </Stack>
  );
}

export default LoginPage;
