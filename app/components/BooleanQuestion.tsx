import { Box, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
interface BooleanQuestionProps {
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
const BooleanQuestion = ({
  questionAnswer,
  handleAnswerSelect,
  isAnswered,
  showFeedback,
  isSubmitted,
  currentQuestion,
}: BooleanQuestionProps) => {
  return (
    <RadioGroup
      value={questionAnswer}
      onChange={(e) => !isSubmitted && handleAnswerSelect(e.target.value)}
    >
      <Stack spacing={2}>
        {currentQuestion?.options?.map((option) => (
          <Box
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
              transition: "all 0.3s",
              "&:hover": !isAnswered ? { backgroundColor: "#e3f2fd" } : {},
            }}
            onClick={() => !isSubmitted && handleAnswerSelect(option)}
          >
            <Box
              sx={{
                py: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Radio checked={questionAnswer === option} />
              <Typography sx={{ flex: 1 }}>{option}</Typography>
              {/*  */}
              {showFeedback && option === currentQuestion.correct_answer && (
                <CheckCircleIcon sx={{ color: "green" }} />
              )}
              {showFeedback && option === questionAnswer && !isAnswered && (
                <CancelIcon sx={{ color: "red" }} />
              )}
            </Box>
          </Box>
        ))}
      </Stack>
    </RadioGroup>
  );
};

export default BooleanQuestion;
