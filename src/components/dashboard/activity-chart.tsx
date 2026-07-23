"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ActivityChart({
  data,
}: {
  data: { date: string; scans: number; views: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Guest activity</CardTitle>
        <p className="text-sm text-muted-foreground">QR scans &amp; guide views, last 7 days</p>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -20, right: 12, top: 8 }}>
              <defs>
                <linearGradient id="scans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F8CFF" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#4F8CFF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="views" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#232735" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#131722",
                  border: "1px solid #232735",
                  borderRadius: 12,
                  fontSize: 13,
                }}
                labelStyle={{ color: "#94A3B8" }}
              />
              <Area
                type="monotone"
                dataKey="scans"
                stroke="#4F8CFF"
                strokeWidth={2}
                fill="url(#scans)"
                name="QR scans"
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#22C55E"
                strokeWidth={2}
                fill="url(#views)"
                name="Guide views"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
