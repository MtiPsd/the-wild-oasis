import supabase from "./supabase";

export async function getCabins() {
  let { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    new Error("Cabins could not be loaded");
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
