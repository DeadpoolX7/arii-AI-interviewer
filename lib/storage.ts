// Constants for Cloudinary
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const uploadResumeFile = async (file: File, userId: string) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET!);
    formData.append('folder', `resumes/${userId}`);
    formData.append('resource_type', 'raw');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();

    return {
      downloadURL: result.secure_url,
      fileName: result.public_id,
      error: null,
    };
  } catch (error: any) {
    return {
      downloadURL: null,
      fileName: null,
      error: error.message,
    };
  }
};

export const deleteResumeFile = async (publicId: string) => {
  try {
    // For security reasons, file deletion should be handled by your backend
    // You'll need to create an API route to handle deletion
    const response = await fetch('/api/delete-file', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error('Delete failed');
    }

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};
