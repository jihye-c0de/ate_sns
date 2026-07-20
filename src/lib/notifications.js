import { supabase } from './supabase';

export async function fetchNotifications(userId) {
  const { data: myPosts, error: postsError } = await supabase
    .from('ate_posts')
    .select('id, caption')
    .eq('user_id', userId);
  if (postsError) throw postsError;

  const postIds = myPosts.map((post) => post.id);

  const [commentsResult, followsResult] = await Promise.all([
    postIds.length > 0
      ? supabase
          .from('ate_comments')
          .select('id, content, created_at, post_id, ate_users(username, display_name, avatar_url)')
          .in('post_id', postIds)
          .neq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20)
      : Promise.resolve({ data: [] }),
    supabase
      .from('ate_follows')
      .select('created_at, ate_users!ate_follows_follower_id_fkey(username, display_name, avatar_url)')
      .eq('following_id', userId)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const comments = (commentsResult.data || []).map((comment) => ({
    type: 'comment',
    id: `comment-${comment.id}`,
    createdAt: comment.created_at,
    actor: comment.ate_users,
    postId: comment.post_id,
    content: comment.content,
  }));

  const follows = (followsResult.data || []).map((follow, index) => ({
    type: 'follow',
    id: `follow-${index}-${follow.created_at}`,
    createdAt: follow.created_at,
    actor: follow.ate_users,
  }));

  return [...comments, ...follows].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
