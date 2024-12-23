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
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return (
      <p>
        Error loading tasks:{" "}
        {error instanceof Error ? error.message : "An unknown error occurred"}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {/* Add New Task */}
      <div>
        <h2 className="text-2xl font-semibold">Add New Task</h2>
        <button
          onClick={() => router.push("/add-task")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Add Task
        </button>
      </div>
      {/* Pending Tasks */}
      <div>
        <h2 className="text-2xl font-semibold">Pending Tasks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <h2 className="text-2xl font-semibold">Completed Tasks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <h2 className="text-2xl font-semibold">Overdue Tasks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
