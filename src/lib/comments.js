import { supabase } from './supabase';

export async function fetchComments(postId) {
  const { data, error } = await supabase
    .from('ate_comments')
    .select('*, ate_users(username, display_name, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addComment(postId, userId, content) {
  const { data, error } = await supabase
    .from('ate_comments')
    .insert({ post_id: postId, user_id: userId, content })
    .select('*, ate_users(username, display_name, avatar_url)')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteComment(commentId) {
  const { error } = await supabase.from('ate_comments').delete().eq('id', commentId);
  if (error) throw error;
}
