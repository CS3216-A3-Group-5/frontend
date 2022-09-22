import axiosInstance from '.';
import { PROFILE_PICTURE_PATH } from './constants';

export async function uploadImage(image: File): Promise<string> {
  const form_data = new FormData();
  form_data.append('profile_pic', image, image.name);
  const response = await axiosInstance.post<string>(
    PROFILE_PICTURE_PATH,
    form_data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}
