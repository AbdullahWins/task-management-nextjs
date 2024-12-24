"use client";

import { useEffect } from "react";
import {
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
} from "@/services/store/modules/api";
import TaskCard from "@/components/common/task-card";
import { useRouter } from "next/navigation";

export default function Tasks() {
  const { data: tasks, isLoading, error } = useGetTasksQuery({});
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const router = useRouter();

  // Redirect user if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/auth/signin");
    }
  }, [router]);

  const handleUpdateTask = (id: string, updates: Partial<any>) => {
    updateTask({ _id: id, ...updates }).catch((err) => {
      console.error("Error updating task:", err);
    });
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id).catch((err) => {
      console.error("Error deleting task:", err);
    });
  };

  interface Task {
    _id: string;
    userId: string;
    title: string;
    description: string;
    dueDate: number;
    status: "pending" | "completed" | "overdue";
    [key: string]: any;
  }

  const pendingTasks = tasks?.data?.filter(
    (task: Task) => task.status === "pending"
  );
  const completedTasks: Task[] = tasks?.data?.filter(
    (task: Task) => task.status === "completed"
  );
  const overdueTasks: Task[] = tasks?.data?.filter(
    (task: Task) => task.status === "overdue"
  );

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading tasks...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-500">
        Error loading tasks:{" "}
        {error instanceof Error ? error.message : "An unknown error occurred"}
      </p>
    );
  }

  return (
    <div className="space-y-12 px-6 py-8">

      {/* Pending Tasks */}
      <div>
        <h3 className="text-3xl font-bold text-center text-gray-800 bg-gray-100 py-4 mb-4">
          Pending Tasks
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingTasks?.map((task: Task) => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      </div>

      {/* Completed Tasks */}
      <div>
        <h3 className="text-3xl font-bold text-center text-gray-800 bg-gray-100 py-4 mb-4">
          Completed Tasks
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedTasks?.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      </div>

      {/* Overdue Tasks */}
      <div>
        <h3 className="text-3xl font-bold text-center text-gray-800 bg-gray-100 py-4 mb-4">
          Overdue Tasks
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {overdueTasks?.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
