import { supabase } from './supabase';

const POST_SELECT = '*, ate_users!ate_posts_user_id_fkey(username, display_name, avatar_url)';

export async function fetchFeed() {
  const { data, error } = await supabase
    .from('ate_posts')
    .select(POST_SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchExplorePosts({ category } = {}) {
  let query = supabase.from('ate_posts').select(POST_SELECT).order('created_at', { ascending: false });
  if (category) query = query.eq('category', category);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchPostById(postId) {
  const { data, error } = await supabase
    .from('ate_posts')
    .select(POST_SELECT)
    .eq('id', postId)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchUserPosts(userId) {
  const { data, error } = await supabase
    .from('ate_posts')
    .select(POST_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createPost({ userId, caption, imageUrl, category, placeName, placeUrl, isCutout }) {
  const { data, error } = await supabase
    .from('ate_posts')
    .insert({
      user_id: userId,
      caption,
      image_url: imageUrl,
      category,
      place_name: placeName || null,
      place_url: placeUrl || null,
      is_cutout: Boolean(isCutout),
    })
    .select(POST_SELECT)
    .single();
  if (error) throw error;
  return data;
}

export async function updatePostCaption(postId, caption) {
  const { error } = await supabase.from('ate_posts').update({ caption }).eq('id', postId);
  if (error) throw error;
}

export async function deletePost(postId) {
  const { error } = await supabase.from('ate_posts').delete().eq('id', postId);
  if (error) throw error;
}

export async function uploadPostImage(userId, blob) {
  const fileName = `${userId}/${Date.now()}.png`;
  const { error: uploadError } = await supabase.storage
    .from('post-images')
    .upload(fileName, blob, { contentType: 'image/png' });
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from('post-images').getPublicUrl(fileName);
  return data.publicUrl;
}
