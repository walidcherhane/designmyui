async function uploadAsset(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await fetch(
      `https://api.imgbb.com/1/upload?key=ee7c137fe267b7629568e66f73617e87`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        return data;
      });

    if (!data) return null;
    return data.url;
  } catch (error) {
    return null;
  }
}

export { uploadAsset };
