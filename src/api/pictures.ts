import axiosInstance from '.';
import { PROFILE_PICTURE_PATH } from './constants';

export async function uploadImage(image: File): Promise<string> {
  const response = await axiosInstance.post<string>(
    PROFILE_PICTURE_PATH,
    image,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}
