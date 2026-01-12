import React, { useEffect, useState, Fragment } from "react";
import ReactApexChart from "react-apexcharts";
import { userService } from "@/services/global/userService";
import { toast } from "sonner";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const ActiveUser: React.FC = () => {
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const startYear = 2020;
    const currentYear = currentDate.getFullYear();

    const months = [
        { value: 1, name: "January" }, { value: 2, name: "February" }, { value: 3, name: "March" },
        { value: 4, name: "April" }, { value: 5, name: "May" }, { value: 6, name: "June" },
        { value: 7, name: "July" }, { value: 8, name: "August" }, { value: 9, name: "September" },
        { value: 10, name: "October" }, { value: 11, name: "November" }, { value: 12, name: "December" },
    ];

    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);

    const [chartData, setChartData] = useState<any>({
        series: [{ name: "Active Users", data: [] }],
        options: {
            chart: { type: "area", height: 300, zoom: { enabled: false }, toolbar: { show: false } },
            colors: ["#4caf50"],
            dataLabels: { enabled: false },
            stroke: { width: 2, curve: "smooth" },
            xaxis: { categories: [], labels: { style: { colors: "var(--color-text-muted)" } } },
            yaxis: { labels: { style: { colors: "var(--color-text-muted)" } } },
            grid: { borderColor: "var(--color-border)" },
            tooltip: { theme: "dark", style: { fontSize: "12px", fontFamily: "inherit" } },
            legend: { horizontalAlign: "center" },
            responsive: [{ breakpoint: 768, options: { xaxis: { tickAmount: 10 } } }]
        }
    });

    const fetchDailyActiveUsers = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await userService.getDailyactiveUsers({ month: selectedMonth, year: selectedYear });
            if (response.status && response.data) {
                const categories = response.data.map(item => {
                    const date = new Date(item.date);
                    return `${date.getDate()}\n${months[date.getMonth()].name.substring(0, 3)}`;
                });
                const counts = response.data.map(item => item.count);

                setChartData(prev => ({
                    ...prev,
                    series: [{ name: "Active Users", data: counts }],
                    options: { ...prev.options, xaxis: { ...prev.options.xaxis, categories } }
                }));
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load daily active users data");
            toast.error("Failed to load daily active users data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDailyActiveUsers();
    }, [selectedMonth, selectedYear]);

    return (
        <div className="my-3 panel w-full h-full p-0 shadow-default rounded-lg">
            <div className="flex items-center justify-between mb-5 p-5">
                <h5 className="text-lg font-semibold text-table-header-text">Daily Active Users</h5>
                <div className="flex gap-4">

                    {/* Month Listbox */}
                    <Listbox value={selectedMonth} onChange={setSelectedMonth} disabled={isLoading}>
                        <div className="relative">
                            <Listbox.Button className="relative w-30 cursor-pointer rounded-md bg-transparent border   text-black  dark:text-white border-gray-300  py-2 pl-3 pr-10 text-left text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                                {months.find(m => m.value === selectedMonth)?.name}
                                <ChevronUpDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4  pointer-events-none" />
                            </Listbox.Button>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md  bg-transparent py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">

                                    {months.map((month) => (
                                        <Listbox.Option
                                            key={month.value}
                                            value={month.value}
                                            className={({ active }) =>
                                                `cursor-pointer select-none relative py-1 px-2 ${active ? "bg-table-row-hover text-primary" : "text-table-header-text"}`
                                            }
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span className={`block ${selected ? "font-medium" : "font-normal"}`}>
                                                        {month.name}
                                                    </span>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 right-2 flex items-center text-primary">
                                                            <CheckIcon className="h-4 w-4" />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>

                    {/* Year Listbox */}
                    <Listbox value={selectedYear} onChange={setSelectedYear} disabled={isLoading}>
                        <div className="relative">
                            <Listbox.Button className="relative w-24 cursor-pointer rounded-md bg-transparent border text-black  dark:text-white border-gray-300 py-2 pl-3 pr-10 text-left text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                                {selectedYear}
                                <ChevronUpDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" />
                            </Listbox.Button>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md   bg-transparent py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                    {years.map((year) => (
                                        <Listbox.Option
                                            key={year}
                                            value={year}
                                            className={({ active }) =>
                                                `cursor-pointer select-none relative py-1 px-2 ${active ? "bg-table-row-hover text-primary" : "text-table-header-text"}`
                                            }
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span className={`block ${selected ? "font-medium" : "font-normal"}`}>
                                                        {year}
                                                    </span>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 right-2 flex items-center text-primary">
                                                            <CheckIcon className="h-4 w-4" />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>

                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center" style={{ height: 300 }}>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : error ? (
                <div className="flex items-center justify-center text-red-500" style={{ height: 300 }}>{error}</div>
            ) : (
                <ReactApexChart options={chartData.options} series={chartData.series} type="area" height={300} />
            )}
        </div>
    );
};

export default ActiveUser;
