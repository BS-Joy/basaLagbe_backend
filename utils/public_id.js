export const getPublicId = (url) => {
  // Use regex to match the public ID part (between "upload/" and the file extension)
  const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
  let publicId = match ? match[1] : null;

  // Replace "%20" with a space
  publicId = publicId.replace(/%20/g, " ");

  return publicId;
};
