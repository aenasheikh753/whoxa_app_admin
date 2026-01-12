import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/global/userService';
import type { CountryUsersCountResponse, CountryUsersCount } from '@/services/global/userService';
import { Chart } from 'react-google-charts';

interface CountryUserActiveCardProps {
    title?: string;
    colors?: [string, string]; // gradient colors for the map
}


const demoCountries = [
  { country: 'Unknown', count: 1 },
  { country: 'Albania', count: 1 },
  { country: 'India', count: 2 },
  { country: 'USA', count: 1 },
  { country: 'Germany', count: 1 },
  { country: 'France', count: 1 },
  { country: 'Brazil', count: 1 },
  { country: 'Japan', count: 1 },
  { country: 'Canada', count: 1 },
  { country: 'Australia', count: 1 }
]

const CountryUserActiveCardLast30mins: React.FC<CountryUserActiveCardProps> = ({
    title = 'Active Users',
    colors = ['#e0f7ff', '#0891b2'],
}) => {
    const { data: countryData, isLoading } = useQuery<CountryUsersCountResponse>({
        queryKey: ['usersByCountry'],
        queryFn: () => userService.getUsersByCountryLast30mins(),
    });

    const countryCounts = countryData?.data || [];
    const topCountries = countryCounts;

console.log("topCountriestopCountries" ,topCountries)

    const totalActiveUsers = countryCounts.reduce((sum: number, country: CountryUsersCount) => {
        const count = typeof country.count === 'string' ? parseInt(country.count, 10) : country.count || 0;
        return sum + count;
    }, 0);

    // Different colors for the dots
    const dotColors = ['#22d3ee', '#0891b2', '#0ea5e9'];

    // Prepare map data for the world map
    const mapData = [
        ['Country', 'Active Users'],
        ...countryCounts.map((country: CountryUsersCount) => [
            country.country,
            typeof country.count === 'string' ? parseInt(country.count, 10) : country.count
        ])
    ];

    const maxUsers = countryCounts.reduce((max: number, country: CountryUsersCount) => {
        const count = typeof country.count === 'string' ? parseInt(country.count, 10) : country.count || 0;
        return Math.max(max, count);
    }, 0);

    const chartContainerStyle = {
        width: '100%',
        height: '100%',
    };

    const mapOptions = {
        colorAxis: {
            colors: colors,
            minValue: 0,
            maxValue: maxUsers,
        },
        backgroundColor: 'transparent',
        datalessRegionColor: '#f1f5f9',
        defaultColor: '#f1f5f9',
        legend: 'none',
        tooltip: {
            textStyle: {
                fontSize: 12,
            },
        },
    };

    return (
        <div className="bg-secondary shadow-default p-6 rounded-lg  max-w-full mx-auto">
            {/* Header */}


            <h2 className="text-lg font-semibold text-table-header-text mb-2">{title}  <span className="font-normal text-sm">(Last 30 Minutes Users)</span>
            </h2>
            <div className="mb-6">
                <div className="text-7xl font-bold text-table-header-text mb-8">
                    {isLoading ? '...' : totalActiveUsers.toLocaleString()}
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
                {/* Left side - Table */}
                {/* Left side - Table */}
                <div className='col-span-2 self-start   mt-4'>
                    <div className="bg-secondary rounded-lg  max-h-[330px] overflow-y-auto border border-table-divider">
                        {/* Table Header */}
                        <div className='px-2 py-3 '>
                            <div className="grid grid-cols-2 gap-4 px-4 py-3 bg-table-header-bg rounded-lg">
                                <div className="text-sm font-medium text-table-header-text uppercase tracking-wide w-full">
                                    Country
                                </div>
                                <div className="text-sm font-medium text-table-header-text uppercase tracking-wide">
                                    Active User
                                </div>
                            </div>
                        </div>

                        {/* Table Rows - Show top 3 countries or "No Data" */}
                        {topCountries.length > 0 ? (
                            topCountries.map((country: CountryUsersCount, index: number) => {
                                const count = typeof country.count === 'string'
                                    ? parseInt(country.count, 10)
                                    : country.count;
                                const dotColor = dotColors[index % dotColors.length];

                                return (
                                    <div
                                        key={index}
                                        className="grid grid-cols-2 gap-4 px-4 py-4  border-b border-table-divider last:border-b-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: dotColor }}
                                            ></div>
                                            <span className="text-text-muted font-medium">
                                                {country.country}
                                            </span>
                                        </div>
                                        <div className="text-text-muted font-semibold">
                                            {count}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex items-center justify-center   h-[260px] text-text-muted font-medium">
                                No Data
                            </div>
                        )}
                    </div>
                </div>


                {/* Right side - Map */}
                <div className="relative  col-span-2">
                    <div className="bg-secondary rounded-lg p-4 h-full">
                        <div className="h-full w-full ">
                            <div style={chartContainerStyle}>
                                <Chart
                                    chartType="GeoChart"
                                    width="100%"
                                    height="100%"
                                    data={mapData}
                                    options={mapOptions}
                                />
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default CountryUserActiveCardLast30mins;