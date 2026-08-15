import { supabase } from "./supabaseClient";

export async function testSupabase() {
  const { error } = await supabase
    .from("appointments")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Supabase connection error:", error);
    return false;
  }

  console.log("Supabase connection successful!");
  return true;
}