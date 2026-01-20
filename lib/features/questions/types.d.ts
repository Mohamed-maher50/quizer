type Boolean_answersType = {
  type: "boolean";
  incorrect_answers: ["False" | "True"];
};
export type MultipleAnswersType = {
  type: "multiple";
  incorrect_answers: string[];
};
export type Difficulty = "easy" | "medium" | "hard";
export type Question = {
  difficulty: "easy" | "medium" | "hard"; // Difficulty level
  category: string; // Category of the question
  question: string; // The question text
  correct_answer: string; // Correct answer
} & (MultipleAnswersType | Boolean_answersType);

// Type for the full API response
type QuestionResponse = {
  response_code: number;
  results: Question[];
};
