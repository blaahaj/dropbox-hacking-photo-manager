import useChart from "@hooks/useChart";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import type Chart from "chart.js/auto";
import { useEffect, useMemo, useRef } from "react";

export const FilesOverTime = () => {
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
            count: d.counts.previewableCount,
            countGPS: d.counts.hasGPSCount,
          }))
        : undefined,
    [latestDaysValue],
  );

  const incremental = useMemo(() => {
    if (!days) return;

    let totalCount = 0;
    let totalCountGPS = 0;
    const inc: (NonNullable<typeof days>[number] & {
      runningTotal: number;
      runningTotalGPS: number;
    })[] = [];
    for (const item of days.filter((d) => d.date >= "2017")) {
      totalCount += item.count;
      totalCountGPS += item.countGPS;
      inc.push({
        ...item,
        runningTotal: totalCount,
        runningTotalGPS: totalCountGPS,
      });
    }

    return inc;
  }, [days]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<"bar", number[] | undefined, string>>(null);

  const ChartConstructor = useChart();

  useEffect(() => {
    if (!canvasRef.current) return;

    const chart = new ChartConstructor(canvasRef.current, {
      type: "bar",
      data: {
        labels: undefined as string[] | undefined,
        datasets: [
          {
            label: "Previewable files without GPS",
            data: undefined,

            // legend
            borderColor: "red",
            backgroundColor: "red",
            borderWidth: 0,

            // pointBorderColor: "red",
            // pointBackgroundColor: "red",
            // showLine: true,
          },
          {
            label: "Previewable files with GPS",
            data: undefined,

            // legend
            borderColor: "blue",
            backgroundColor: "blue",
            borderWidth: 0,

            // pointBorderColor: "blue",
            // pointBackgroundColor: "blue",
          },
          // {
          //   label: "... without GPS",
          //   data: undefined,

          //   // legend
          //   borderColor: "red",
          //   backgroundColor: "red",
          //   borderWidth: 0,

          //   // pointBorderColor: "red",
          //   // pointBackgroundColor: "pink",
          //   // pointBorderWidth: 1,
          // },
        ],
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
            // stacked: true,
            title: {
              display: true,
              text: "Count per month",
            },
            position: "right",
          },
        },
        // plugins: {
        //   zoom: {
        //     pan: { enabled: true },
        //     zoom: {
        //       wheel: { enabled: true },
        //       drag: {
        //         enabled: true,
        //         borderColor: "red",
        //         borderWidth: 5,
        //       },
        //       pinch: { enabled: true },
        //     },
        //   },
        // },
      },
    });

    chartRef.current = chart;

    return () => chart.destroy();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const ds = chartRef.current.data;
    ds.labels = incremental?.map((item) => item.date);
    ds.datasets[0].data = incremental?.map(
      (item) => item.count - item.countGPS,
    );
    ds.datasets[1].data = incremental?.map((item) => item.countGPS);
    // ds.datasets[2].data = incremental?.map(
    //   (item) => item.count - item.countGPS,
    // );
    chartRef.current.update();
  }, [incremental]);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};
