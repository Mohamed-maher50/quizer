export const getPerformanceMessage = (percentage: number) => {
  if (percentage === 100) return "Perfect Score! 🎉";
  if (percentage >= 80) return "Excellent! 🌟";
  if (percentage >= 60) return "Good Job! 👍";
  if (percentage >= 40) return "Keep Practicing! 📚";
  return "Try Again! 💪";
};
