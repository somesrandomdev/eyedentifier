import { supabase } from '../utils/supabase';

export const uploadService = {
  // Upload photo to Supabase storage
  async uploadPhoto(file: File, citizenId?: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = citizenId
      ? `${citizenId}-photo.${fileExt}`
      : `temp-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('photos-cni')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('photos-cni')
      .getPublicUrl(data.path);

    return publicUrl;
  },

  // Upload iris images (simulated for now)
  async uploadIrisImages(leftIrisFile: File, rightIrisFile: File, citizenId: string): Promise<{ leftUrl: string; rightUrl: string }> {
    // In a real implementation, these would be processed iris images
    // For now, we'll just upload placeholder files or simulate

    const leftFileName = `${citizenId}-iris-left.jpg`;
    const rightFileName = `${citizenId}-iris-right.jpg`;

    // Upload left iris
    const { data: leftData, error: leftError } = await supabase.storage
      .from('photos-cni')
      .upload(leftFileName, leftIrisFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (leftError) throw leftError;

    // Upload right iris
    const { data: rightData, error: rightError } = await supabase.storage
      .from('photos-cni')
      .upload(rightFileName, rightIrisFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (rightError) throw rightError;

    // Get public URLs
    const { data: { publicUrl: leftUrl } } = supabase.storage
      .from('photos-cni')
      .getPublicUrl(leftData.path);

    const { data: { publicUrl: rightUrl } } = supabase.storage
      .from('photos-cni')
      .getPublicUrl(rightData.path);

    return { leftUrl, rightUrl };
  },

  // Delete file from storage
  async deleteFile(fileName: string) {
    const { error } = await supabase.storage
      .from('photos-cni')
      .remove([fileName]);

    if (error) throw error;
  },
};