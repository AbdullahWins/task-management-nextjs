// taskSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { api } from "./api";

interface TaskState {
  tasks: any[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // You can still keep some local reducers if necessary
    setTasks(state, action) {
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Tasks (fetched by RTK Query)
      .addMatcher(api.endpoints.getTasks.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(api.endpoints.getTasks.matchFulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addMatcher(api.endpoints.getTasks.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      // Add Task (fetched by RTK Query)
      .addMatcher(api.endpoints.addTask.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(api.endpoints.addTask.matchFulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.loading = false;
      })
      .addMatcher(api.endpoints.addTask.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add task";
      })
      // Update Task (fetched by RTK Query)
      .addMatcher(api.endpoints.updateTask.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(api.endpoints.updateTask.matchFulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex(
          (task) => task._id === updatedTask._id
        );
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
        state.loading = false;
      })
      .addMatcher(api.endpoints.updateTask.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update task";
      })
      // Delete Task (fetched by RTK Query)
      .addMatcher(api.endpoints.deleteTask.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(api.endpoints.deleteTask.matchFulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
        state.loading = false;
      })
      .addMatcher(api.endpoints.deleteTask.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete task";
      });
  },
});

export const { setTasks } = taskSlice.actions;

export default taskSlice.reducer;
