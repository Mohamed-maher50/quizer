"use client";
import { Box, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { decode } from "html-entities";
import { AnimatePresence, motion } from "framer-motion";
const RadioMotion = motion.create(Radio);
interface MultipleQuestionProps {
  questionAnswer?: string;
  handleAnswerSelect: (answer: string) => void;
  isAnswered: boolean;
  showFeedback: boolean;
  isSubmitted: boolean;
  currentQuestion: {
    correct_answer: string;
    options: string[];
  };
}
const MultipleQuestion = ({
  questionAnswer,
  currentQuestion,
  handleAnswerSelect,
  isAnswered,
  isSubmitted,
  showFeedback,
}: MultipleQuestionProps) => {
  return (
    <AnimatePresence mode="popLayout">
      <RadioGroup
        key={currentQuestion.correct_answer}
        value={questionAnswer}
        onChange={(e) => !isSubmitted && handleAnswerSelect(e.target.value)}
      >
        <Stack
          spacing={2}
          sx={{
            overflow: "hidden",
          }}
        >
          {currentQuestion?.options?.map((option, idx) => (
            <Box
              component={motion.div}
              initial={{
                y: "-100%",
                opacity: 0,
              }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: idx * 0.09 + 0.5,
                type: "spring",
                stiffness: 100,
                duration: 0.7,
              }}
              exit={{
                y: 300,

                transition: {
                  duration: 0.6,
                  delay: (currentQuestion.options.length - idx) * 0.05,
                },
              }}
              key={option}
              sx={{
                cursor: isAnswered ? "default" : "pointer",

                backgroundColor:
                  showFeedback && option === currentQuestion.correct_answer
                    ? "#c8e6c9"
                    : showFeedback && option === questionAnswer && !isAnswered
                      ? "#ffcdd2"
                      : questionAnswer === option && !showFeedback
                        ? "#e3f2fd"
                        : "#f5f5f5",
                border:
                  questionAnswer === option
                    ? "2px solid #667eea"
                    : "1px solid #e0e0e0",
                "&:hover": !isAnswered ? { backgroundColor: "#e3f2fd" } : {},
              }}
              onClick={() => !isSubmitted && handleAnswerSelect(option)}
            >
              <Box
                sx={{
                  p: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <RadioMotion
                  checked={questionAnswer === option}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 1.5,
                  }}
                />
                <Typography sx={{ flex: 1 }}>{decode(option)}</Typography>
                {showFeedback && option === currentQuestion.correct_answer && (
                  <CheckCircleIcon sx={{ color: "green" }} />
                )}
                {showFeedback && option !== currentQuestion.correct_answer && (
                  <CancelIcon sx={{ color: "red" }} />
                )}
              </Box>
            </Box>
          ))}
        </Stack>
      </RadioGroup>
    </AnimatePresence>
  );
};

export default MultipleQuestion;
