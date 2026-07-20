import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import PostDetailBlock from '../components/post/post-detail-block';

/**
 * PostDetailPage 컴포넌트
 *
 * Props: 없음 (라우트로 렌더링되는 페이지, useParams로 postId 조회)
 *
 * 그리드/피드에서 postIds 목록을 state로 넘겨받으면 해당 목록을 이어서
 * 렌더링해 인스타그램처럼 스크롤로 다음 게시물을 계속 볼 수 있게 한다.
 * state가 없으면(직접 접속, 공유 링크 등) 해당 게시물 하나만 보여준다.
 */
function PostDetailPage() {
  const { postId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initialIds = location.state?.postIds;
  const [ids, setIds] = useState(() =>
    Array.isArray(initialIds) && initialIds.length > 0 ? initialIds.map(String) : [String(postId)],
  );
  const blockRefs = useRef({});

  useEffect(() => {
    const target = blockRefs.current[String(postId)];
    if (target) {
      target.scrollIntoView({ block: 'start' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleted = (deletedId) => {
    setIds((prev) => {
      const next = prev.filter((id) => id !== String(deletedId));
      if (next.length === 0) navigate('/');
      return next;
    });
  };

  return (
    <Box>
      {ids.map((id) => (
        <PostDetailBlock
          key={id}
          postId={id}
          onDeleted={handleDeleted}
          ref={(node) => {
            blockRefs.current[id] = node;
          }}
        />
      ))}
    </Box>
  );
}

export default PostDetailPage;
