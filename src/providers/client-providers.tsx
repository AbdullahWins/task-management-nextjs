"use client";

import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/services/store";
import { useDispatch } from "react-redux";
import { hydrateAuth } from "@/services/store/modules/authSlice";
import { useGetUserQuery } from "@/services/store/modules/api";

export const ClientProviders = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <HydrateAuth>{children}</HydrateAuth>
    </Provider>
  );
};

const HydrateAuth = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const { data, error, isLoading } = useGetUserQuery(userId, {
    skip: !userId,
  });

  useEffect(() => {
    if (data) {
      dispatch(hydrateAuth());
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!userId) {
      dispatch(hydrateAuth());
    }
  }, [userId, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching user data</div>;
  }
  return <>{children}</>;
};
