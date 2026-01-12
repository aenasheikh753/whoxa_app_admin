import UserCountCard from './DashboardComponents/cards/UserCountCard';
import GroupCountCard from './DashboardComponents/cards/GroupCountCard';
import AudioCountCard from './DashboardComponents/cards/AudioCallCountCard';
import VideoCountCard from './DashboardComponents/cards/VideoCallCountCard';
import YearlyChart from '@/components/ui/YearlyChart';
import YearlyUserData from './DashboardComponents/YearlyUserData';
import CountryUserActiveCardLast30mins from '@/components/ui/CountryUserActiveCard';
import PlatformActivityChart from '@/components/ui/Platformactivitycard';
import WeeklyNewUsers from '@/components/ui/WeeklyNewUser';
import { RecentUserList } from './DashboardComponents/RecentUserList';
import ActiveUser from '@/components/ui/DailyActiveUser';
import CountryUserCard from '@/components/ui/CountryUserCard';
import { RecentGroupList } from './DashboardComponents/RecentGroupList';
import YearlyCallData from './DashboardComponents/YearlyCallData';
import NewUpdateYearlyUserData from './DashboardComponents/NewUpdateYearlyUserData';

export default function DashboardPage() {
  return (
    <div className="h-full w-full grid gap-6 p-4 md:p-6">
      {/* Cards Row: 4 cards in one row on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <UserCountCard className="w-full" />
        <GroupCountCard className="w-full" />
        <AudioCountCard className="w-full" />
        <VideoCountCard className="w-full" />
      </div>

      {/* Charts */}
      <div className="w-full">
        {/* <NewUpdateYearlyUserData /> */}
        <YearlyUserData />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <CountryUserActiveCardLast30mins
            title="Active Users by Country"
            colors={['#e0f7ff', '#0891b2']} // gradient for map
          />
        </div>
        <div className="col-span-1">
          <PlatformActivityChart />
        </div>
        <div className='col-span-1'>
          <WeeklyNewUsers />
        </div>
        <div className='col-span-1 md:col-span-1 lg:col-span-3'>
          <RecentUserList />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <ActiveUser />
        </div>
        <div className='col-span-1 md:col-span-1 lg:col-span-2'>
          <CountryUserCard />
        </div>
        <div className='col-span-1 md:col-span-1 lg:col-span-2'>
          <RecentGroupList />
        </div>
        <div className='col-span-1 md:col-span-2 lg:col-span-4'>
          <YearlyCallData />
        </div>
      </div>
    </div>
  );
}