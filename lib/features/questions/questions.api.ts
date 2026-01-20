import { QuestionResponse } from "./types";

export const fetchQuestions = async (query: string) => {
  const response = await fetch(`https://opentdb.com/api.php${query}`, {
    method: "GET",
  });
  const result: QuestionResponse = await response.json();
  return result;
};
