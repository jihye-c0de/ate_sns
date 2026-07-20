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
 * SignupPage 컴포넌트
 *
 * Props: 없음 (라우트로 렌더링되는 페이지)
 */
function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setSubmitting(true);
    const { error: signUpError } = await signUp({ email, password, username, displayName });
    setSubmitting(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setNotice('가입이 완료되었습니다. 이메일 인증이 필요할 수 있어요.');
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <Stack spacing={3} component="form" onSubmit={handleSubmit} sx={{ textAlign: 'center' }}>
      <Typography
        component="h1"
        sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, color: 'primary.main' }}
      >
        회원가입
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {notice && <Alert severity="success">{notice}</Alert>}

      <TextField
        label="아이디 (@username)"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        required
        fullWidth
      />
      <TextField
        label="표시 이름"
        value={displayName}
        onChange={(event) => setDisplayName(event.target.value)}
        fullWidth
      />
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
        가입하기
      </Button>
      <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
        이미 계정이 있으신가요?{' '}
        <Link component={RouterLink} to="/login">
          로그인
        </Link>
      </Typography>
    </Stack>
  );
}

export default SignupPage;
