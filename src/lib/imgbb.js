/**
 * Uploads an image file to imgBB and returns the public URL.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} - The hosted image URL.
 */
export async function uploadToImgBB(file) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error('imgBB API key is not configured. Add NEXT_PUBLIC_IMGBB_API_KEY to your .env file.');
  }

  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `imgBB upload failed (HTTP ${response.status})`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data?.error?.message || 'imgBB upload did not succeed.');
  }

  // Return the direct display URL (permanent, never expires)
  return data.data.url;
}
