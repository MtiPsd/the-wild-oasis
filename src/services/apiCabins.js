import supabase from "./supabase";

export async function getCabins() {
  try {
    let { data, error } = await supabase.from("cabins").select("*");

    return data;
  } catch (error) {
    throw new Error("Cabins could not be loaded");
  }
}
