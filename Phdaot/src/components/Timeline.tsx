"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export function Timeline() {
  const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8:00 to 18:00

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Daily Timeline</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="relative pl-4 border-l-2 border-muted h-full space-y-8">
          {hours.map((hour) => (
            <div key={hour} className="relative">
              <span className="absolute -left-[25px] top-0 flex h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
              <div className="text-sm font-semibold text-muted-foreground -mt-1.5 mb-2">
                {hour}:00
              </div>
              <div className="min-h-[40px] pl-4">
                {/* Example Task placement on timeline */}
                {hour === 10 && (
                  <div className="rounded-md border p-2 bg-secondary/50 text-sm">
                    <div className="font-semibold text-primary">Team Sync</div>
                    <div className="text-xs text-muted-foreground">Meeting</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
