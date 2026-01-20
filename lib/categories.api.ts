interface triviaCategoriesResponse {
  trivia_categories: Category[];
}
export type Category = {
  id: string;
  name: string;
};
export const fetchCategories = async (query?: string) => {
  const response = await fetch(
    `https://opentdb.com/api_category.php${query || ""}`,
    {
      method: "GET",
    },
  );
  const result: triviaCategoriesResponse = await response.json();
  return result;
};
