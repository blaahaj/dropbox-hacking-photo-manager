import Chart from "chart.js/auto";
import { _adapters } from "chart.js/auto";
import temporalAdapter from "chartjs-adapter-temporal";
import zoom from "chartjs-plugin-zoom";

_adapters._date.override(temporalAdapter);
Chart.register(zoom);

export default function useChart() {
  return Chart;
}
