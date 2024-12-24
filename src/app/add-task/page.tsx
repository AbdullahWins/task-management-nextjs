"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useAddTaskMutation } from "@/services/store/modules/api"; // Assuming you have an API mutation for adding tasks
import { useRouter } from "next/navigation";

const AddTaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pending"); // Default status
  const dispatch = useDispatch();
  const router = useRouter();
  const [addTask, { isLoading, error }] = useAddTaskMutation();

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Prepare task data
      const newTask = {
        title,
        description,
        dueDate,
        status,
      };

      // Call API to add the task
      const { data } = await addTask(newTask).unwrap();

      // Optionally, dispatch any action if needed
      // dispatch(addTaskSuccess(data)); // Example

      // Reset the form
      setTitle("");
      setDescription("");
      setDueDate("");
      setStatus("pending");

      // Redirect or notify user about success (optional)
      router.push("/"); // Redirect to the tasks page after adding task
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Add New Task
        </h1>
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Task Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter task title"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter task description"
              required
            />
          </div>
          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700"
            >
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg shadow-sm ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-300"
            }`}
          >
            {isLoading ? "Adding task..." : "Add Task"}
          </button>
        </form>
        {error && (
          <p className="text-sm text-red-600 mt-3">
            {JSON.stringify("data" in error ? error.data : "An error occurred")}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddTaskForm;
