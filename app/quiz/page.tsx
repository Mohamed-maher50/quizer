"use client";
import TimerIcon from "@mui/icons-material/Timer";
import {
  Box,
  Button,
  Chip,
  ChipOwnProps,
  Container,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { decode } from "html-entities";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTimer } from "react-timer-hook";

import {
  nextQuestion,
  selectExam,
  setAnswer,
} from "@/lib/features/exam/ExamSlice";
import { Difficulty } from "@/lib/features/questions/types";
import { useAppDispatch } from "@/lib/hooks";

import BooleanQuestion from "../components/BooleanQuestion";
import MultipleQuestion from "../components/MuitipleQuestion";
const QUESTION_TIME = 30;
import { useRouter } from "next/navigation";
const INITIAL_TIMER = new Date(Date.now() + QUESTION_TIME * 1000);
const MotionButton = motion.create(Button);
const QuizPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const dispatch = useAppDispatch();
  const { replace } = useRouter();
  const exam = useSelector(selectExam);
  const questionAnswer = exam.answers[exam.currentQuestionIndex]?.answer || "";
  const currentQuestion = exam.questions[exam.currentQuestionIndex];

  const isAnswered = !!questionAnswer;
  const handleNext = () => dispatch(nextQuestion());
  const { seconds, pause, restart } = useTimer({
    expiryTimestamp: INITIAL_TIMER,

    onExpire: () => {
      dispatch(
        setAnswer({
          question: currentQuestion,
          answer: undefined,
          takenTime: QUESTION_TIME,
        }),
      );

      dispatch(nextQuestion());
    },
  });

  const QuestionDifficulty = exam.activeQuestion?.difficulty;
  const defaultColors: Record<Difficulty, ChipOwnProps["color"]> = {
    easy: "success",
    medium: "warning",
    hard: "error",
  };

  const progress =
    ((exam.currentQuestionIndex + 1) / exam.questions.length) * 100;

  const handleSubmit = () => {
    if (!selectedAnswer) {
      alert("Please select an answer");
      return;
    }
    pause();
    dispatch(
      setAnswer({
        question: currentQuestion,
        answer: selectedAnswer,
        takenTime: QUESTION_TIME - seconds,
      }),
    );
    setShowFeedback(true);
    setIsSubmitted(true);
  };
  useEffect(() => {
    if (exam.isCompleted) replace("/result");
  }, [exam.isCompleted, replace]);

  useEffect(() => {
    setShowFeedback(false);
    setIsSubmitted(false);
    restart(new Date(Date.now() + 30 * 1000));
  }, [currentQuestion]);

  if (exam.status != "idle" || exam.questions.length === 0) replace("/");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{ p: 4, borderRadius: 3 }}
          component={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          exit={{ opacity: 0 }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ color: "#666" }}>
                Question {exam.currentQuestionIndex + 1} of{" "}
                {exam.questions.length}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#667eea" }}
              >
                {(
                  (exam.currentQuestionIndex / exam.questions.length) *
                  100
                ).toFixed(0)}
                % Complete
              </Typography>
            </Box>
            <Chip
              icon={<TimerIcon />}
              label={`${seconds} s`}
              color={2 <= 10 ? "error" : "primary"}
              sx={{ fontSize: "1rem", py: 3, px: 2 }}
            />
          </Box>

          {/* Progress Bar */}
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mb: 4, height: 8, borderRadius: 4 }}
          />

          {/* Question */}
          <Typography
            key={currentQuestion?.question}
            component={motion.p}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            variant="h5"
            sx={{ mb: 3, fontWeight: "bold", color: "#333" }}
          >
            {decode(exam.activeQuestion?.question)}
          </Typography>

          {/* Difficulty Badge */}
          <Box sx={{ mb: 3 }}>
            <Chip
              label={QuestionDifficulty?.toUpperCase()}
              color={
                QuestionDifficulty
                  ? defaultColors[QuestionDifficulty]
                  : "default"
              }
              size="small"
              variant="outlined"
            />
          </Box>

          {/* Answer Options */}
          <Box sx={{ mb: 4 }}>
            {
              // currentQuestion.type
              exam.activeQuestion?.type === "multiple" ? (
                <MultipleQuestion
                  isSubmitted={isSubmitted}
                  questionAnswer={selectedAnswer}
                  currentQuestion={currentQuestion}
                  handleAnswerSelect={setSelectedAnswer}
                  isAnswered={isAnswered}
                  showFeedback={showFeedback}
                />
              ) : (
                <BooleanQuestion
                  currentQuestion={currentQuestion}
                  isSubmitted={isSubmitted}
                  questionAnswer={selectedAnswer}
                  handleAnswerSelect={setSelectedAnswer}
                  isAnswered={isAnswered}
                  showFeedback={showFeedback}
                />
              )
            }
          </Box>

          {/* Feedback */}
          {showFeedback && (
            <Box
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                backgroundColor:
                  questionAnswer === currentQuestion.correct_answer
                    ? "#c8e6c9"
                    : "#ffcdd2",
                border: `2px solid ${questionAnswer === currentQuestion.correct_answer ? "#4caf50" : "#f44336"}`,
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>
                {questionAnswer === currentQuestion.correct_answer
                  ? "✓ Correct!"
                  : "✗ Wrong!"}
              </Typography>
              {questionAnswer !== currentQuestion.correct_answer && (
                <Typography sx={{ mt: 1 }}>
                  The correct answer is:{" "}
                  <strong>{decode(currentQuestion.correct_answer)}</strong>
                </Typography>
              )}
            </Box>
          )}

          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 2, overflow: "hidden" }}>
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <MotionButton
                  variant="contained"
                  key={currentQuestion?.question}
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{
                    type: "spring",
                    duration: 0.5,
                  }}
                  exit={{
                    x: "100%",
                    opacity: 0,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    flex: 1,
                    fontWeight: "bold",
                  }}
                >
                  Submit Answer
                </MotionButton>
              ) : (
                <MotionButton
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{
                    x: "100%",
                    opacity: 0,
                  }}
                  key={currentQuestion?.question}
                  whileHover={{ scale: 1.05 }}
                  transition={{
                    type: "spring",
                    duration: 0.5,
                  }}
                  variant="contained"
                  onClick={handleNext}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    flex: 1,
                    fontWeight: "bold",
                  }}
                >
                  {exam.currentQuestionIndex + 1 === exam.questions.length
                    ? "See Results"
                    : "Next Question"}
                </MotionButton>
              )}
            </AnimatePresence>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default QuizPage;
