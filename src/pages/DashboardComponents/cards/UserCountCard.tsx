import StatsCard from "@/components/ui/StatCard";
import { cn } from "@/lib/utils";
import { userService } from "@/services/global/userService";
import { useQuery } from "@tanstack/react-query";

interface UserCountCardProps {
    className?: string;
}

export default function UserCountCard({ className }: UserCountCardProps) {
    const { data: userStats, isLoading, isError } = useQuery({
        queryKey: ['userStats'],
        queryFn: () => userService.getUsersCard(),
    });

    // Calculate percentage change
    const calculatePercentageChange = (current: number, previous: number) => {
        if (previous === 0) return 0;
        return Math.round(((current - previous) / previous) * 100);
    };

    // Get the total users and users from start to one month ago
    const totalUsers = userStats?.data?.totalUsers || 0;
    const usersFromStartToOneMonthAgo = userStats?.data?.usersFromStartToOneMonthAgo || 0;
    
    // Calculate the number of users added in the last month
    const usersThisMonth = totalUsers - usersFromStartToOneMonthAgo;
    
    // Calculate percentage change compared to previous period
    const percentageChange = calculatePercentageChange(usersThisMonth, usersFromStartToOneMonthAgo);

    if (isLoading || isError) {
        return (
            <div className={cn("space-y-4", className)}>
                <StatsCard
                    title="Total Users"
                    value={0}
                    lastMonthValue={0}
                    percentageChange={0}
                    gradient="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700"
                />
            </div>
        );
    }

    return (
        <div className={cn("space-y-4", className)}>
            <StatsCard
                title="Total Users"
                value={totalUsers}
                lastMonthValue={usersFromStartToOneMonthAgo}
                percentageChange={percentageChange}
                gradient="bg-gradient-to-r from-cyan-500 to-cyan-400"

            />
        </div>
    );
}
