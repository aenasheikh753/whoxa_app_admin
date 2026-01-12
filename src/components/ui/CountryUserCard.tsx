import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/global/userService';
import type { CountryUsersCountResponse, CountryUsersCount } from '@/services/global/userService';
import { Chart } from 'react-google-charts';
import ReactCountryFlag from 'react-country-flag';
import { CardTitle } from './Card';

// Map country names to ISO 3166-1 alpha-2 codes
const countryNameToCode: Record<string, string> = {
    "India": "IN",
    "United States": "US",
    "Canada": "CA",
    "Australia": "AU",
    "Germany": "DE",
    "France": "FR",
    "United Kingdom": "GB",
    "Japan": "JP",
    // add more as needed
};

interface CountryUserActiveCardProps {
    title?: string;
    colors?: [string, string]; // gradient colors for the map
}

const CountryUserCard: React.FC<CountryUserActiveCardProps> = ({
    title = 'Active Users',
    colors = ['#e0f7ff', '#0891b2'],
}) => {
    const { data: countryData, isLoading } = useQuery<CountryUsersCountResponse>({
        queryKey: ['usersByCountryOverAll'],
        queryFn: () => userService.getUsersByCountry(),
    });

    const allCountries = countryData?.data || [];

    // ✅ sort all countries by count (high → low)
    const sortedCountries = [...allCountries].sort((a, b) => {
        const countA = typeof a.count === 'string' ? parseInt(a.count, 10) : a.count || 0;
        const countB = typeof b.count === 'string' ? parseInt(b.count, 10) : b.count || 0;
        return countB - countA;
    });

    // ✅ take only top 5 after sorting
    const topCountries = sortedCountries.slice(0, 5);

    const totalActiveUsers = allCountries.reduce((sum: number, country: CountryUsersCount) => {
        const count = typeof country.count === 'string' ? parseInt(country.count, 10) : country.count || 0;
        return sum + count;
    }, 0);

    // ✅ prepare map data (skip empty country names)
    const mapData = [
        ['Country', 'Active Users'],
        ...sortedCountries
            .filter((c: CountryUsersCount) => c.country && c.country.trim() !== "")
            .map((country: CountryUsersCount) => [
                country.country,
                typeof country.count === 'string' ? parseInt(country.count, 10) : country.count
            ])
    ];

    const maxUsers = sortedCountries.reduce((max: number, country: CountryUsersCount) => {
        const count = typeof country.count === 'string' ? parseInt(country.count, 10) : country.count || 0;
        return Math.max(max, count);
    }, 0);

    const chartContainerStyle = { width: '100%', height: '100%' };

    const mapOptions = {
        colorAxis: { colors: colors, minValue: 0, maxValue: maxUsers },
        backgroundColor: 'transparent',
        datalessRegionColor: '#f1f5f9',
        defaultColor: '#f1f5f9',
        legend: 'none',
        tooltip: { textStyle: { fontSize: 12 } },
    };

    return (
        <div className="bg-secondary shadow-default p-6 h-full my-auto rounded-lg  border-none max-w-full mx-auto">
            <CardTitle className="text-lg font-semibold text-table-header-text">Countrywise Users</CardTitle>

            <div className="grid grid-cols-1 h-full lg:grid-cols-5  items-center">
                {/* Left side - Map */}
                <div className="relative col-span-3">
                    <div className="bg-secondary rounded-lg py-4 px-1 h-full">
                        <div className="h-full w-full">
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

                {/* Right side - Table */}
                <div className="col-span-2 pl-4">
                    {/* <div className="mb-6">
                        <h2 className="text-lg font-medium text-table-header-text mb-2">{title}</h2>
                        <div className="text-7xl font-bold text-table-header-text mb-8">
                            {isLoading ? '...' : totalActiveUsers.toLocaleString()}
                        </div>
                    </div> */}

                    <div className="bg-secondary rounded-lg overflow-hidden ">
                        {/* Table Header */}
                        {/* <div className="px-2 py-3">
                            <div className="grid grid-cols-2 gap-4 px-4 py-3 bg-table-header-bg rounded-lg">
                                <div className="text-sm font-medium text-table-header-text uppercase tracking-wide w-full">Country</div>
                                <div className="text-sm font-medium text-table-header-text uppercase tracking-wide">Active User</div>
                            </div>
                        </div> */}

                        {/* ✅ Table Rows - Top 5 sorted countries */}
                        {topCountries.map((country: CountryUsersCount, index: number) => {
                            const count = typeof country.count === 'string'
                                ? parseInt(country.count, 10)
                                : country.count;

                            const hasName = country.country && country.country.trim() !== "";
                            const countryName = hasName ? country.country : "Unknown";
                            const countryCode = hasName ? (countryNameToCode[country.country] || 'US') : 'UN'; // fallback

                            return (
                                <div
                                    key={index}
                                    className="grid grid-cols-2 gap-3 px-3 pl-6 py-4  text-sm border-b border-table-divider last:border-b-0"
                                >
                                    <div className="flex items-center gap-2">
                                        {hasName ? (
                                            <>
                                            <ReactCountryFlag
                                                countryCode={countryCode}
                                                svg
                                                style={{ width: '20px', height: '20px'}}
                                                title={countryName}
                                                />
                                                <span className='text-text-muted font-bold'>
                                                    {countryName}
                                                </span>
                                                </>
                                        ) : (
                                            <span className="">🌐</span> // fallback icon for empty country
                                        )}
                                    </div>
                                    <span className="text-text-muted text-end font-bold">{count} Users</span>

                                    {/* <div className="text-text-muted font-semibold"></div> */}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CountryUserCard;
