import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ScanHeatmap({ data }: { data: number[][] }) {
  const max = Math.max(1, ...data.flat());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">QR scan activity</CardTitle>
        <p className="text-sm text-muted-foreground">By day &amp; hour, last 30 days</p>
      </CardHeader>
      <CardContent className="overflow-x-auto pb-6">
        <div className="flex min-w-[640px] gap-1">
          <div className="flex flex-col gap-1 pr-2 pt-5">
            {DAYS.map((day) => (
              <div key={day} className="flex h-4 items-center text-[10px] text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          <div className="flex-1">
            <div className="mb-1 flex gap-1">
              {Array.from({ length: 24 }).map((_, hour) => (
                <div key={hour} className="w-4 flex-1 text-center text-[9px] text-muted-foreground">
                  {hour % 6 === 0 ? hour : ""}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              {data.map((row, dayIndex) => (
                <div key={dayIndex} className="flex gap-1">
                  {row.map((value, hourIndex) => (
                    <div
                      key={hourIndex}
                      title={`${value} scans`}
                      className="h-4 flex-1 rounded-sm"
                      style={{
                        background:
                          value === 0
                            ? "var(--secondary)"
                            : `color-mix(in oklab, var(--primary) ${Math.max(15, (value / max) * 100)}%, var(--secondary))`,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
