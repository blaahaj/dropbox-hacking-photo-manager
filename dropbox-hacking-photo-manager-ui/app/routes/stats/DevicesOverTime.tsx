import useChart from "@hooks/useChart";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import type Chart from "chart.js/auto";
import { useEffect, useMemo, useRef } from "react";

export const DevicesOverTime = () => {
  const latestDaysValue = useLatestValueFromServerFeed({
    type: "rx.ng.list-of-days",
    withSamples: false,
    groupBy: "calendar-month",
  });

  const dayZero = Temporal.PlainDate.from("1970-01-01");

  const days = useMemo(
    () =>
      latestDaysValue
        ? latestDaysValue.map((d) => ({
            date: d.date,
            daysSinceDayZero: Temporal.PlainDate.from(d.date).since(dayZero)
              .days,
            byDevice: d.counts.byDevice,
          }))
        : undefined,
    [latestDaysValue],
  );

  const incremental = useMemo(() => {
    if (!days) return;

    const runningTotalByDevice = {} as Record<string, number>;

    const inc: (NonNullable<typeof days>[number] & {
      runningTotalByDevice: Record<string, number>;
    })[] = [];

    for (const item of days) {
      for (const [k, v] of Object.entries(item.byDevice)) {
        runningTotalByDevice[k] = (runningTotalByDevice[k] ?? 0) + v;
      }
      inc.push({ ...item, runningTotalByDevice: { ...runningTotalByDevice } });
    }

    return inc;
  }, [days]);

  const incrementalNoLongTail = useMemo(() => {
    if (!incremental || incremental.length === 0) return;

    const finalStats = incremental.at(-1)!.runningTotalByDevice;
    const devices = Object.keys(finalStats).toSorted();

    const total = Object.values(finalStats).reduce((a, b) => a + b, 0);
    const longTailDevices = devices.filter((d) => finalStats[d] < total * 0.02);

    if (longTailDevices.length === 0) return incremental;

    return incremental.map((item) => {
      const copy = { ...item.runningTotalByDevice };
      let n = 0;
      for (const dev of longTailDevices) {
        n += copy[dev] ?? 0;
        delete copy[dev];
      }
      copy["Other"] = n;

      return {
        ...item,
        runningTotalByDevice: copy,
      };
    });
  }, [incremental]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<"line", number[] | undefined, string>>(null);

  const ChartConstructor = useChart();

  useEffect(() => {
    if (!canvasRef.current) return;

    const chart = new ChartConstructor(canvasRef.current, {
      type: "line",
      data: {
        labels: undefined as string[] | undefined,
        datasets: [] as { label: string; data: undefined }[],
      },
      options: {
        locale: "en-gb",
        animation: false,
        scales: {
          x: {
            type: "time",
            time: {
              unit: "month",
            },
          },
          y: {
            title: {
              display: true,
              text: "Count per month",
            },
            position: "right",
          },
        },
      },
    });

    chartRef.current = chart;

    return () => chart.destroy();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const data = chartRef.current.data;

    if (incrementalNoLongTail) {
      const finalStats = incrementalNoLongTail.at(-1)!.runningTotalByDevice;
      const devices = Object.keys(finalStats).toSorted(
        (a, b) => finalStats[a] - finalStats[b],
      );
      // const i = devices.indexOf("Other");
      // if (i >= 0) {
      //   devices.splice(i, 1);
      //   devices.push("Other");
      // }

      data.labels = incremental?.map((item) => item.date);
      data.datasets = devices.map((device) => ({
        fill: true,
        label: device || "None",
        data: incrementalNoLongTail.map((item) => item.byDevice[device] ?? 0),
      }));
    } else {
      data.labels = undefined;
      data.datasets = [];
    }

    chartRef.current.update();
  }, [incrementalNoLongTail]);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};
