import supabase from "./supabase";

export async function getCabins() {
  try {
    let { data, error } = await supabase.from("cabins").select("*");

    return data;
  } catch (error) {
    throw new Error("Cabins could not be loaded");
  }
}

export async function deleteCabins(id) {
  try {
    const { error } = await supabase
      .from("cabins")
      .delete()
      .eq("id", id);
  } catch (error) {
    throw new Error("Cabin could not be deleted");
  }
}
