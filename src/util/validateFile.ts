export const validateFile = (
  file: any,
  maxSizeInMB: number,
  acceptedFormats: string[]
) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  const fileExtension = file?.name?.split(".").pop().toLowerCase();
  // console.log(fileExtension);

  if (file.size > maxSizeInBytes) {
    return `File size exceeds the maximum limit of ${maxSizeInMB} MB.`;
  }

  // Check file extension against accepted formats
  if (!acceptedFormats.includes(fileExtension)) {
    return `Invalid file format. Only ${acceptedFormats.join(
      ", "
    )} are allowed.`;
  }

  return null;
};
