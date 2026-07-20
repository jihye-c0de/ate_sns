import { supabase } from './supabase';

export async function fetchProfileByUsername(username) {
  const { data, error } = await supabase
    .from('ate_users')
    .select('*')
    .eq('username', username)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchProfileById(userId) {
  const { data, error } = await supabase.from('ate_users').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

export async function uploadAvatarImage(userId, file) {
  const extension = file.type === 'image/png' ? 'png' : 'jpg';
  const fileName = `${userId}/${Date.now()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { contentType: file.type });
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
  return data.publicUrl;
}

export async function fetchFollowCounts(userId) {
  const [{ count: followerCount }, { count: followingCount }] = await Promise.all([
    supabase.from('ate_follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
    supabase.from('ate_follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId),
  ]);
  return { followerCount: followerCount ?? 0, followingCount: followingCount ?? 0 };
}

export async function isFollowing(followerId, followingId) {
  const { data, error } = await supabase
    .from('ate_follows')
    .select('follower_id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function followUser(followerId, followingId) {
  const { error } = await supabase
    .from('ate_follows')
    .insert({ follower_id: followerId, following_id: followingId });
  if (error) throw error;
}

export async function unfollowUser(followerId, followingId) {
  const { error } = await supabase
    .from('ate_follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId);
  if (error) throw error;
}

export async function isPostSaved(userId, postId) {
  const { data, error } = await supabase
    .from('ate_saved_posts')
    .select('post_id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function savePost(userId, postId) {
  const { error } = await supabase.from('ate_saved_posts').insert({ user_id: userId, post_id: postId });
  if (error) throw error;
}

export async function unsavePost(userId, postId) {
  const { error } = await supabase
    .from('ate_saved_posts')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId);
  if (error) throw error;
}

export async function isPostLiked(userId, postId) {
  const { data, error } = await supabase
    .from('ate_likes')
    .select('post_id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function likePost(userId, postId) {
  const { error } = await supabase.from('ate_likes').insert({ user_id: userId, post_id: postId });
  if (error) throw error;
}

export async function unlikePost(userId, postId) {
  const { error } = await supabase
    .from('ate_likes')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId);
  if (error) throw error;
}

export async function fetchSavedPosts(userId) {
  const { data, error } = await supabase
    .from('ate_saved_posts')
    .select(
      'created_at, ate_posts!ate_saved_posts_post_id_fkey(*, ate_users!ate_posts_user_id_fkey(username, display_name, avatar_url))',
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map((row) => row.ate_posts);
}
