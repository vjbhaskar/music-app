import noImage from "../assets/no-image.webp";
const getCroppedImageUrl = (url: string, height: number, width: number) => {
  if (!url) return noImage;
  return url.replace(/\/(\d+)x(\d+)/, `/${height}x${width}`);
};

export default getCroppedImageUrl;
