import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  let { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    new Error("Cabins could not be loaded");
  }
  return data;
}

export async function createCabin(newCabin) {
  // if there is any slash included in image name
  // supabase will create a folder with a name after '/'
  // and that's not what we want
  const imageName = `${Math.random()}-${
    newCabin.image.name
  }`.replaceAll("/", "");
  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. create cabin
  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...newCabin, image: imagePath }])
    .select();

  if (error) {
    throw new Error("Cabin could not be created");
  }
  // 2. upload image
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. Delete the cabin if there was am error uploading the image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    throw new Error("Cabin image could not be uploaded");
  }

  return data;
}

export async function deleteCabins(id) {
  const { data, error } = await supabase
    .from("cabins")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error("Cabin could not be deleted");
  }

  return data;
}
