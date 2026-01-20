"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  LinearProgress,
  Typography,
  Paper,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Chip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useSelector } from "react-redux";
import {
  resetExam,
  reTakeExam,
  selectExam,
} from "@/lib/features/exam/ExamSlice";
import { decode } from "html-entities";
import { getPerformanceMessage } from "@/utils/PerformaceMessage";
import { useAppDispatch } from "@/lib/hooks";
import IsActiveExam from "../components/IsActiveExam";

const ResultPage = () => {
  const router = useRouter();
  const exam = useSelector(selectExam);
  const dispatch = useAppDispatch();
  const questions = exam.questions;
  const score = exam.answers.reduce((acc, answer) => {
    if (answer.answer === answer.correct_answer) return acc + 1;
    return acc;
  }, 0);

  const totalQuestions = questions.length;
  const percentage = (score / totalQuestions) * 100;

  const handleRetakeQuiz = () => {
    dispatch(reTakeExam());
    router.push("/quiz");
  };
  const handleEndQuiz = () => {
    dispatch(resetExam());
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <EmojiEventsIcon sx={{ fontSize: 60, color: "#667eea", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              Quiz Completed!
            </Typography>
            <Typography variant="h6" sx={{ color: "#666" }}>
              {getPerformanceMessage(percentage)}
            </Typography>
          </Box>

          {/* Score Card */}
          <Card
            sx={{
              mb: 4,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h2" sx={{ fontWeight: "bold", mb: 1 }}>
                {score}/{totalQuestions}
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {percentage.toFixed(1)}% Score
              </Typography>
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  transition: 0.5,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "rgba(255,255,255,0.3)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#4caf50",
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={6}>
              <Card sx={{ backgroundColor: "#c8e6c9" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <CheckCircleIcon
                    sx={{ fontSize: 40, color: "#4caf50", mb: 1 }}
                  />
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#2e7d32" }}
                  >
                    {score}
                  </Typography>
                  <Typography sx={{ color: "#558b2f" }}>Correct</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={6}>
              <Card sx={{ backgroundColor: "#ffcdd2" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <CancelIcon sx={{ fontSize: 40, color: "#f44336", mb: 1 }} />
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#d32f2f" }}
                  >
                    {totalQuestions - score}
                  </Typography>
                  <Typography sx={{ color: "#c62828" }}>Wrong</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Detailed Results */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Detailed Results
            </Typography>
            <TableContainer
              component={Paper}
              sx={{ backgroundColor: "#f5f5f5" }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: "#667eea" }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Q.
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Question
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Your Answer
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Correct Answer
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exam.answers.map((answer, index) => {
                    const question = answer?.question;
                    const isCorrect = answer.answer === answer.correct_answer;

                    return (
                      <TableRow
                        key={answer?.question}
                        sx={{
                          "&:nth-of-type(even)": {
                            backgroundColor: "#fafafa",
                          },
                        }}
                      >
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {index + 1}
                        </TableCell>
                        <TableCell>{decode(question)}</TableCell>
                        <TableCell>
                          {decode(answer.answer) || "Not answered"}
                        </TableCell>
                        <TableCell>
                          {isCorrect || decode(answer.correct_answer)}
                        </TableCell>
                        {answer.answer && (
                          <TableCell>
                            {isCorrect ? (
                              <Chip
                                icon={<CheckCircleIcon />}
                                label="Correct"
                                color="success"
                                size="small"
                              />
                            ) : (
                              <Chip
                                icon={<CancelIcon />}
                                label="Wrong"
                                color="error"
                                size="small"
                              />
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Action Buttons */}
          <Stack spacing={2}>
            <Button
              variant="contained"
              size="large"
              onClick={handleRetakeQuiz}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                fontWeight: "bold",
                fontSize: "1rem",
                py: 1.5,
              }}
            >
              Retake Quiz
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleEndQuiz}
              sx={{
                borderColor: "#667eea",
                color: "#667eea",
                fontWeight: "bold",
                fontSize: "1rem",
                py: 1.5,
              }}
            >
              Back to Home
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default () => (
  <IsActiveExam>
    <ResultPage />
  </IsActiveExam>
);
