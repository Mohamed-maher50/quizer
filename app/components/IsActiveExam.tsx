"use client";

import { selectExam } from "@/lib/features/exam/ExamSlice";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { useSelector } from "react-redux";

const IsActiveExam = ({ children }: { children: React.ReactNode }) => {
  const { replace } = useRouter();
  const exam = useSelector(selectExam);
  useLayoutEffect(() => {
    if (!exam.isReady) replace("/");
  }, [exam.isReady, replace]);
  if (!exam.isReady) return null;
  return <>{children}</>;
};

export default IsActiveExam;
