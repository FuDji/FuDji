import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DAYS = ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub"];

export function ScanHeatmap({ data }: { data: number[][] }) {
  const max = Math.max(1, ...data.flat());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Aktivnost skeniranja QR koda</CardTitle>
        <p className="text-sm text-muted-foreground">Po danu i satu, poslednjih 30 dana</p>
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
                      title={`${value} skeniranja`}
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
