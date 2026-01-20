import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { fetchQuestions } from "@/lib/features/questions/questions.api";

import { Question } from "../questions/types";
type QuestionWithOptions = Question & {
  options: string[];
};

export const loadQuestions = createAsyncThunk(
  "quiz/loadQuestions",
  async (params: string) => {
    const res = await fetchQuestions(params);
    return res.results;
  },
);
type Answer = QuestionWithOptions & {
  answer?: string;
  takenTime: number;
};

export interface QuestionSliceState {
  questions: QuestionWithOptions[];
  currentQuestionIndex: number;
  activeQuestion: QuestionWithOptions | null;
  answers: Answer[];
  isReady: boolean;
  status: "idle" | "loading" | "failed";
  isCompleted?: boolean;
}

const initialState: QuestionSliceState = {
  status: "idle",
  questions: [],
  currentQuestionIndex: 0,
  activeQuestion: null,
  answers: [],
  isCompleted: false,
  isReady: false,
};

export const examSlice = createSlice({
  name: "exam",
  initialState: initialState,
  reducers: {
    reTakeExam: (state) => {
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.isCompleted = false;
    },
    getCurrentQuestion: (state) => {
      state.activeQuestion = state.questions[state.currentQuestionIndex];
    },
    resetExam: (state) => {
      state.activeQuestion = null;
      state.questions = [];
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.isCompleted = false;
      state.isReady = false;
    },
    setQuestions: (state, action) => {
      state.questions = action.payload;
      state.activeQuestion = state.questions[0];
    },
    setAnswer: (state, action) => {
      const { question, answer, takenTime } = action.payload;
      const prevAnswers = [...state.answers];
      prevAnswers[state.currentQuestionIndex] = {
        ...question,
        answer,
        takenTime,
      };
      state.answers = prevAnswers;
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex + 1 < state.questions.length) {
        state.currentQuestionIndex += 1;
        state.activeQuestion = state.questions[state.currentQuestionIndex];
      } else state.isCompleted = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadQuestions.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(loadQuestions.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(loadQuestions.fulfilled, (state, action) => {
      const questionsWithOptions = action.payload.map((q) => {
        return {
          ...q,
          options: [...q.incorrect_answers, q.correct_answer].sort(
            () => Math.random() - 0.5,
          ),
        };
      });
      state.isReady = true;
      state.questions = questionsWithOptions;
      state.activeQuestion = questionsWithOptions[0];
      state.status = "idle";
      state.answers = [];
      state.currentQuestionIndex = 0;
    });
  },
  selectors: {
    selectActiveQuestion: (state: QuestionSliceState) => state.activeQuestion,
    selectQuestions: (state: QuestionSliceState) => state.questions,
    selectCurrentQuestionIndex: (state: QuestionSliceState) =>
      state.currentQuestionIndex,
    selectExam: (state) => state,
  },
});
export default examSlice.reducer;
export const {
  selectActiveQuestion,
  selectCurrentQuestionIndex,
  selectQuestions,
  selectExam,
} = examSlice.selectors;
export const {
  getCurrentQuestion,
  setQuestions,
  setAnswer,
  nextQuestion,
  resetExam,
  reTakeExam,
} = examSlice.actions;
