import React, { useLayoutEffect, useRef } from "react";
import { MoreHorizontal } from "lucide-react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card } from "@app/components/ui/card";
import { useTrans } from "@app/hooks/useTranslation";
import type { DashboardChartData } from "../types";
import { getChartColor } from "../utils/chart.utils";

interface DashboardChartProps {
  data: DashboardChartData[];
}

const DashboardChart: React.FC<DashboardChartProps> = ({ data }) => {
  const { t } = useTrans();
  const safeData = Array.isArray(data) ? data : [];
  const chartRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout,
      }),
    );

    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30,
      cellStartLocation: 0.2,
      cellEndLocation: 0.8,
    });

    xRenderer.labels.template.setAll({
      fontSize: 12,
      fill: am5.color(0x6b7280),
      maxWidth: 80,
      oversizedBehavior: "truncate",
      textAlign: "center",
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "name",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      }),
    );

    const yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 20,
    });

    yRenderer.labels.template.setAll({
      fontSize: 12,
      fill: am5.color(0x6b7280),
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: yRenderer,
        maxPrecision: 0,
      }),
    );

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Status",
        xAxis,
        yAxis,
        valueYField: "count",
        categoryXField: "name",
      }),
    );

    series.columns.template.setAll({
      tooltipText: "{categoryX}: {valueY}",
      interactive: true,
      cursorOverStyle: "pointer",
    });

    series.columns.template.setAll({
      width: am5.percent(60),
      cornerRadiusTL: 10,
      cornerRadiusTR: 10,
      strokeOpacity: 0,
    });

    series.columns.template.adapters.add("fill", (_fill, target) => {
      const context = target.dataItem?.dataContext as
        | DashboardChartData
        | undefined;
      const color = getChartColor(context?.color || "gray");
      return am5.color(parseInt(color.replace("#", ""), 16));
    });

    series.columns.template.adapters.add("stroke", (_stroke, target) => {
      const context = target.dataItem?.dataContext as
        | DashboardChartData
        | undefined;
      const color = getChartColor(context?.color || "gray");
      return am5.color(parseInt(color.replace("#", ""), 16));
    });

    xAxis.data.setAll(safeData);
    series.data.setAll(safeData);

    return () => {
      root.dispose();
    };
  }, [safeData]);

  if (safeData.length === 0) {
    return (
      <Card variant="default" padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("dashboardChartTitle")}
          </h3>
          <button
            type="button"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="More"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="h-[320px] flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          {t("dashboardChartNoData")}
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default" padding="lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("dashboardChartTitle")}
        </h3>
      </div>

      <div className="relative h-[400px]">
        <div ref={chartRef} className="h-full w-full" />
      </div>
    </Card>
  );
};

export default DashboardChart;
