import React from "react";
import { Card } from "@app/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { getCardColorScheme } from "@app/utils/mapColor.utils";
import type { DashboardCardData } from "../types";

interface DashboardCardProps extends DashboardCardData {}

const DashboardCard: React.FC<DashboardCardProps> = ({
  name,
  color,
  value,
  change,
  isUp,
}) => {
  const colorScheme = getCardColorScheme(color);
  const changeColor = isUp
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";

  return (
    <Card
      variant="default"
      padding="lg"
      hoverable
      className="transition-all duration-200 hover:shadow-lg"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {name}
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {value.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center justify-between ">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${colorScheme.iconBg}`}
            >
              <div className={`w-4 h-4 rounded-lg ${colorScheme.text}`}>
                <svg
                  className="w-full h-full"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className={`flex items-center gap-1 ${changeColor}`}>
            {isUp ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-semibold">{change}</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            so với kì trước
          </span>
        </div>
      </div>
    </Card>
  );
};

export default DashboardCard;
