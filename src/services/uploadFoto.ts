export const uploadToCloudinary = async (file: any) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "kiwipets");

  const res = await fetch("https://api.cloudinary.com/v1_1/dayhhjn4m/upload", {
    method: "POST",
    body: data,
  });

  const json = await res.json();
  return json.secure_url;
};
