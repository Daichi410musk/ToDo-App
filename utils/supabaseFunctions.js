import { supabase } from "./supabase";

export const getAllTodos = async () => {
  const { data, error } = await supabase.from("study-record").select("*");

  if (error) {
    console.error("エラー:", error);
    return [];
  }
  return data;
};

export const addStudyRecord = async (title, time) => {
  const { data, error } = await supabase
    .from("study-record")
    .insert([{ title: title, time: parseInt(time) }])
    .select();

  if (error) {
    throw error;
  }
  console.log(data);
  return data[0];
};

export const deleteStudyRecord = async (id) => {
  const { error } = await supabase.from("study-record").delete().eq("id", id);

  if (error) {
    throw error;
  }
};
