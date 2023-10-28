import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  let { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    new Error("Cabins could not be loaded");
  }
  return data;
}

export async function createEditCabin(newCabin, id) {
  // * [Edge Case] : in the UI "CreateCabinForm", and only for editing a cabin
  // * if you specify an image ==> you will send a FileList type for image value
  // * if you don't ==> you will send a url as image type
  const hasImagePath = newCabin.image?.startsWith?.(supabase);

  // if there is any slash included in image name
  // supabase will create a folder with a name after '/'
  // and that's not what we want
  const imageName = `${Math.random()}-${
    newCabin.image.name
  }`.replaceAll("/", "");
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. create/edit cabin
  let query = supabase.from("cabins");

  // A) CREATE
  if (!id) {
    query.insert([{ ...newCabin, image: imagePath }]);
  }

  // B) EDIT
  if (id) {
    query
      .update({ other_column: "otherValue" })
      .eq("id", id)
      .select();
  }

  const { data, error } = await query.select().single();

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
