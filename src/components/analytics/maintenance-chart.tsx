"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MaintenanceChart({ data }: { data: { label: string; count: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Maintenance frequency</CardTitle>
        <p className="text-sm text-muted-foreground">Issues reported per month, last 6 months</p>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: -20, right: 12, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232735" vertical={false} />
              <XAxis dataKey="label" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "#131722", border: "1px solid #232735", borderRadius: 12, fontSize: 13 }}
                labelStyle={{ color: "#94A3B8" }}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} name="Issues" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
