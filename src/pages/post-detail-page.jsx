import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import PostDetailBlock from '../components/post/post-detail-block';

function buildInitialIds(postId, postIds) {
  const list = Array.isArray(postIds) && postIds.length > 0 ? postIds.map(String) : [String(postId)];
  const clickedIndex = list.indexOf(String(postId));
  if (clickedIndex <= 0) return list;
  return [...list.slice(clickedIndex), ...list.slice(0, clickedIndex)];
}

/**
 * PostDetailPage 컴포넌트
 *
 * Props: 없음 (라우트로 렌더링되는 페이지, useParams로 postId 조회)
 *
 * 그리드/피드에서 postIds 목록을 state로 넘겨받으면, 클릭한 게시물이 항상
 * 목록 맨 앞에 오도록 순서를 재배열해 렌더링한다. 그래야 각 게시물이
 * 비동기로 로딩되며 높이가 바뀌어도 처음 보여야 할 게시물이 스크롤 위치
 * 변화로 밀려나지 않는다. 이어서 스크롤하면 나머지 게시물이 원래 순서대로
 * 계속 보인다. state가 없으면(직접 접속, 공유 링크 등) 해당 게시물 하나만
 * 보여준다.
 */
function PostDetailPage() {
  const { postId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [ids, setIds] = useState(() => buildInitialIds(postId, location.state?.postIds));

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
        <PostDetailBlock key={id} postId={id} onDeleted={handleDeleted} />
      ))}
    </Box>
  );
}

export default PostDetailPage;
