import React from "react";
import { TbTrendingDown3, TbTrendingUp3 } from "react-icons/tb";

type StatsCardProps = {
    title: string;
    value: number | string;
    lastMonthValue: number | string;
    percentageChange: number; // positive or negative
    gradient?: string; // 👈 tailwind classes for bg
};

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    lastMonthValue,
    percentageChange,
    gradient = "bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700", // ConvoX Blue default
}) => {
    const isPositive = percentageChange >= 0;

    return (
        <div
            className={`${gradient} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between border border-white/20 backdrop-blur-sm h-full min-h-[180px]`}
        >
            {/* Header */}
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-white drop-shadow-sm">{title}</h3>
                <span
                    className={`flex items-center text-sm font-medium px-3 py-1.5 rounded-xl shadow-sm ${isPositive
                            ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                        }`}
                >
                    {percentageChange}%
                    {isPositive ? (
                        <TbTrendingUp3 className="w-4 h-4 ml-1" />
                    ) : (
                        <TbTrendingDown3 className="w-4 h-4 ml-1" />
                    )}
                </span>
            </div>

            {/* Value */}
            <p className="text-4xl font-bold text-white mt-4 drop-shadow-md">{value}</p>

            {/* Comparison */}
            <p className="text-white/90 text-sm mt-2">
                vs last month: <span className="font-bold">{lastMonthValue}</span>
            </p>
        </div>
    );
};

export default StatsCard;
