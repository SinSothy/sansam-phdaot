"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 min-w-0">
          {children}
        </main>
      </div>
    </>
  );
}
