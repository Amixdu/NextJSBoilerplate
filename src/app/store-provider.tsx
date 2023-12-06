"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
//
import { makeStore, AppStore } from "../lib/redux/store";

/**
 * Wrapper component that creates and shares the store using the React-Redux Provider component.
 * @param children - Child components to be rendered
 * @returns
 */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }
  //
  return <Provider store={storeRef.current}>{children}</Provider>;
}
