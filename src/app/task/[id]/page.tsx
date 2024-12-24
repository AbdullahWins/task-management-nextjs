"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useGetTaskQuery,
  useFetchAISummaryMutation,
  useFetchAIPlanMutation,
} from "@/services/store/modules/api";

export default function ViewTask() {
  const router = useRouter();
  const { id: taskId } = useParams(); // Extract the taskId from the URL

  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiPlan, setAiPlan] = useState<string | null>(null);

  // Check if taskId is available in the URL
  if (!taskId) {
    return (
      <p className="text-center text-gray-500">
        Task ID is missing from the URL.
      </p>
    );
  }

  // Fetch the task data using the taskId
  const { data: task, isLoading, error } = useGetTaskQuery(taskId); // Fetch the task by ID
  const [fetchAISummary, { isLoading: isSummaryLoading }] =
    useFetchAISummaryMutation();
  const [fetchAIPlan, { isLoading: isPlanLoading }] = useFetchAIPlanMutation();

  // Fetch AI summary
  const handleAISummary = async () => {
    try {
      const { data } = await fetchAISummary({ taskId }).unwrap();
      setAiSummary(data.summary);
    } catch (err) {
      console.error("Error fetching AI summary:", err);
    }
  };

  // Fetch AI plan
  const handleAIPlan = async () => {
    try {
      const { data } = await fetchAIPlan({ taskId }).unwrap();
      setAiPlan(data.planToFinish);
    } catch (err) {
      console.error("Error fetching AI plan:", err);
    }
  };

  // Redirect if task is not found or if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/auth/signin");
    }
  }, [router]);

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading task...</p>;
  }

  if (error || !task) {
    return <p className="text-center text-red-500">Error loading task.</p>;
  }

  return (
    <div className="space-y-12 px-6 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Task Details
      </h1>

      {/* Task Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <h2 className="text-xl font-medium text-gray-700">Task Title</h2>
          <p>{task.data.title}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-medium text-gray-700">Description</h2>
          <p>{task.data.description}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-medium text-gray-700">Due Date</h2>
          <p>{task.data.dueDate}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-medium text-gray-700">Status</h2>
          <p>{task.data.status}</p>
        </div>
      </div>

      {/* AI Summary and Plan Buttons */}
      <div className="space-y-3 mt-6">
        <button
          onClick={handleAISummary}
          disabled={isSummaryLoading}
          className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-300"
        >
          {isSummaryLoading ? "Fetching AI Summary..." : "Get AI Summary"}
        </button>
        {aiSummary && (
          <div className="mt-4">
            <h3 className="font-medium text-lg">AI Summary:</h3>
            <div>{aiSummary}</div>
          </div>
        )}

        <button
          onClick={handleAIPlan}
          disabled={isPlanLoading}
          className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-300"
        >
          {isPlanLoading ? "Fetching AI Plan..." : "Get AI Plan"}
        </button>
        {aiPlan && (
          <div className="mt-4">
            <h3 className="font-medium text-lg">AI Plan:</h3>
            <div>{aiPlan}</div>
          </div>
        )}
      </div>
    </div>
  );
}
