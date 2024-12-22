import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/services/store/modules/api";

interface Task {
  _id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: number;
  status: "pending" | "completed" | "overdue";
  [key: string]: any;
}

interface TaskCardProps {
  task: Task;
  
  onUpdate: (id: string, updates: Partial<any>) => void;

  onDelete: (id: string) => void;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const [updateTask] = useUpdateTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate);

  // Handle status change (pending -> completed -> overdue)
  const handleStatusUpdate = async () => {
    const newStatus =
      task.status === "pending"
        ? "completed"
        : task.status === "completed"
        ? "overdue"
        : "pending";

    try {
      await updateTaskStatus({ _id: task._id, status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleUpdate = () => {
    const updatedTask = {
      _id: task._id,
      title,
      description,
      dueDate,
      userId: task.userId,
      status: task.status,
    };

    updateTask(updatedTask)
      .unwrap()
      .catch((err) => {
        console.error("Error updating task:", err);
      });
  };

  const handleDelete = () => {
    deleteTask(task._id).catch((err) => {
      console.error("Error deleting task:", err);
    });
  };

  return (
    <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h3>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter task title"
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
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter task description"
            rows={4}
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
            value={new Date(dueDate).toISOString().split("T")[0]}
            onChange={(e) => setDueDate(new Date(e.target.value).getTime())}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        {/* Status Update Button */}
        <button
          onClick={handleStatusUpdate}
          className={`px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-300 transition ${
            task.status === "pending"
              ? "bg-indigo-600 text-white hover:bg-indigo-500"
              : task.status === "completed"
              ? "bg-green-600 text-white hover:bg-green-500"
              : "bg-red-600 text-white hover:bg-red-500"
          }`}
        >
          {task.status === "pending"
            ? "Mark as Completed"
            : task.status === "completed"
            ? "Move to Overdue"
            : "Move to Pending"}
        </button>

        {/* Update Task Button */}
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-500 focus:ring-2 focus:ring-green-300"
        >
          Update Task
        </button>

        {/* Delete Task Button */}
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-500 focus:ring-2 focus:ring-red-300"
        >
          Delete Task
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
