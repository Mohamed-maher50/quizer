"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

import { Category, fetchCategories } from "@/lib/categories.api";
import { loadQuestions, selectExam } from "@/lib/features/exam/ExamSlice";
import { useAppDispatch } from "@/lib/hooks";
import { getDirtyValues } from "@/utils/dirtyFields";
export const quizFormSchema = z.object({
  difficulty: z.enum(
    ["easy", "medium", "hard"],
    "Please select a difficulty level",
  ),
  type: z.enum(["multiple", "boolean", ""], "Please select question type"),
  amount: z
    .number("Number of questions is required")
    .min(1, "At least 1 question is required"),
  category: z.string().min(1, "Please select a category"),
});

export default function IndexPage() {
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const router = useRouter();
  const exam = useSelector(selectExam);
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,

    formState: { errors, dirtyFields },
  } = useForm<z.infer<typeof quizFormSchema>>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      category: "",
      amount: 10,
      difficulty: "easy",
      type: "",
    },
  });

  useEffect(() => {
    (async () => {
      const category = await fetchCategories();
      setCategoryOptions(category.trivia_categories);
    })();
  }, []);
  const handleStartQuiz = async (data: z.infer<typeof quizFormSchema>) => {
    const amount = data.amount.toString();
    const filteredData = getDirtyValues(dirtyFields, data);
    const searchParams = new URLSearchParams({
      ...filteredData,
      amount,
    }).toString();
    dispatch(loadQuestions(`?${searchParams}`));
  };
  useEffect(() => {
    if (exam.isReady) router.push("/quiz");
  }, [exam.isReady, router]);
  return (
    <form onSubmit={handleSubmit(handleStartQuiz)}>
      {/* // box like div in jsx */}
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          {/* paper this make shadow */}
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                mb: 1,
                fontWeight: "bold",
                textAlign: "center",
                color: "#667eea",
              }}
            >
              Quiz Master
            </Typography>
            <Typography
              variant="body2"
              component="h2"
              sx={{ mb: 4, textAlign: "center", color: "#666" }}
            >
              Test your knowledge across different topics
            </Typography>
            <Stack direction={"column"} sx={{ gap: 3 }}>
              <FormControl>
                <FormLabel sx={{ mb: 1, fontWeight: "bold", color: "#333" }}>
                  Difficulty Level
                </FormLabel>
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => {
                    return (
                      <RadioGroup {...field}>
                        <FormControlLabel
                          value="easy"
                          control={<Radio />}
                          label="Easy"
                        />
                        <FormControlLabel
                          value="medium"
                          control={<Radio />}
                          label="Medium"
                        />
                        <FormControlLabel
                          value="hard"
                          control={<Radio />}
                          label="Hard"
                        />
                      </RadioGroup>
                    );
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel sx={{ mb: 1, fontWeight: "bold", color: "#333" }}>
                  Multiple Choice
                </FormLabel>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => {
                    return (
                      <RadioGroup {...field}>
                        <FormControlLabel
                          value=""
                          control={<Radio />}
                          label="Mixed Types"
                        />
                        <FormControlLabel
                          value="multiple"
                          control={<Radio />}
                          label="Multiple Choice"
                        />
                        <FormControlLabel
                          value="boolean"
                          control={<Radio />}
                          label="True / False"
                        />
                      </RadioGroup>
                    );
                  }}
                />
              </FormControl>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      variant="outlined"
                      label="Number of Questions"
                      type="number"
                    />
                  );
                }}
              />

              <FormControl fullWidth error={!!errors.category}>
                <InputLabel
                  sx={{ mb: 1, fontWeight: "bold", color: "#333" }}
                  id="demo-simple-select-helper-label"
                >
                  Questions Category
                </InputLabel>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Questions Category">
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {categoryOptions.map((category) => (
                        <MenuItem
                          value={category.id.toString()}
                          key={category.id}
                        >
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors?.category?.message && (
                  <FormHelperText>{errors?.category?.message}</FormHelperText>
                )}
              </FormControl>

              <Button
                variant="contained"
                size="large"
                type="submit"
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  py: 1.5,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5568d3 0%, #6a3a8f 100%)",
                  },
                }}
              >
                Start Quiz
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </form>
  );
}
