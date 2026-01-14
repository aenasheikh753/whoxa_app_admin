import { DataTable, type DataTableColumn, Input, Button, Toggle } from '@/components/ui';
import { useEffect,  useState } from 'react';
import { userService, type UsersListItem } from '@/services/global/userService';
import { Breadcrumb } from '@/layouts';
import { Search } from 'lucide-react';
import { useDemoGuard } from '@/utils/demoGuard';
type Platform = 'App' | 'Web';
type Status = 'Online' | 'Offline';

type UserRow = {
  id: number;
  profile_pic: string;
  fullName: string;
  emailMasked: string;
  username: string;
  countryCode: string; // ISO alpha-2
  country: string;
  joinedAt: string; // ISO date
  platform: Platform;
  reportCounts: number;
  status: Status;
  is_blocked: boolean
};

function countryFlag(code: string) {
  // Use emoji flags for portability
  const cc = code.toUpperCase();
  return cc.replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}
// const userList = await userService.getUsersList();
const mockRows: UserRow[] = [];


export default function DashboardUserListPage() {
  const [rows, setRows] = useState<UserRow[]>(mockRows);
  const [search, setSearch] = useState('');
  const { checkDemo } = useDemoGuard();

  const columns: Array<DataTableColumn<UserRow>> = [
  {
    header: 'ID',
    cell: (r) => (
      <span className="text-blue-600 text-xs sm:text-sm">#{r.id}</span>
    ),
    className: 'w-16 sm:w-24',
  },
  {
    header: 'Full Name',
    cell: (r) => (
      <div className="flex items-center gap-2 sm:gap-3">
        <img src={r.profile_pic} className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-cover" alt="avatar" />
        <div className="min-w-0">
          <div className="text-table-text text-xs sm:text-sm font-medium truncate">{r.fullName}</div>
          <div className="text-xs text-text-muted truncate hidden sm:block">{r.emailMasked}</div>
        </div>
      </div>
    ),
  },
  {
    header: 'User Name',
    accessor: 'username',
    sortable: true,
    className: 'hidden md:table-cell',
  },
  {
    header: 'Country',
    cell: (r) => (
      <div className="inline-flex items-center gap-1 sm:gap-2">
        <span className="text-base sm:text-lg leading-none">{countryFlag(r.countryCode)}</span>
        <span className="text-xs sm:text-sm text-table-text truncate max-w-[80px] sm:max-w-none">{r.country}</span>
      </div>
    ),
    className: 'hidden lg:table-cell',
  },
  {
    header: 'Joining date',
    cell: (r) => {
      const date = new Date(r.joinedAt);
      return (
        <div className="text-xs sm:text-sm">
          <span className="hidden xl:inline">{date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span className="xl:hidden">{date.toLocaleDateString(undefined, { year: '2-digit', month: 'short', day: 'numeric' })}</span>
        </div>
      );
    },
    sortable: true,
    className: 'hidden md:table-cell',
  },
  {
    header: 'Platform',
    cell: (r) => (
      <span className={r.platform === 'Web' ? 'text-green-500 border font-medium border-green-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs' : 'text-yellow-700 border font-medium font-bold border-yellow-500 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs'}>
        {r.platform}
      </span>
    ),
    className: 'hidden sm:table-cell',
  },
  {
    header: 'Report Counts',
    accessor: 'reportCounts',
    className: 'hidden lg:table-cell',
    // sortable: true,
  },
  {
    header: 'Status',
    cell: (r) => (
      <span className={r.status === 'Online' ? 'text-green-600 border border-emerald-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs' : 'text-red-500 border border-red-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs'}>{r.status}</span>
    ),
    className: 'hidden xl:table-cell',
  },
  {
      header: 'Block',
      cell: (r) => (
        
        <Toggle
          checked={r.is_blocked}
          onChange={async (checked) => {
            // 1. update UI immediately
            if (checkDemo()) return;
            setRows((prev) =>
              prev.map((row) =>
                row.id === r.id ? { ...row, is_blocked: checked } : row
              )
            );
  
            try {
              // 2. call API
              await userService.blockUserByAdmin({
                id: r.id,
                is_blocked: checked,
              });
            } catch (err) {
              console.error('Block toggle failed', err);
  
              // 3. revert if API fails
              setRows((prev) =>
                prev.map((row) =>
                  row.id === r.id ? { ...row, is_blocked: !checked } : row
                )
              );
            }
          }}
          className="p-1 sm:p-2"
        />
      ),
      className: 'w-20 sm:w-28',
    },
  ];

  // Client-side pagination handled by DataTable; we fetch and combine all pages

  const fetchAll = async (searchTerm: string) => {
    try {
      const first = await userService.getUsersList({ page: 1, pageSize: 50, search: searchTerm });
      const totalPages: number = first.data?.pagination?.total_pages ?? 1;
      const restPromises = Array.from({ length: Math.max(0, totalPages - 1) }).map((_, i) =>
        userService.getUsersList({ page: i + 2, pageSize: 50, search: searchTerm })
      );
      const rest = await Promise.all(restPromises);
      const allUsers: UsersListItem[] = [first, ...rest]
        .flatMap((r: any) => r?.data?.users || []);
      const mapped: UserRow[] = allUsers.map((u: UsersListItem, idx: number) => ({
        id: Number(u.user_id ?? idx + 1),
        profile_pic: u.profile_pic ?? '/assets/Avatar.png',
        fullName: u.full_name || u.user_name || '-',
        emailMasked: u.email ? u.email.replace(/(.{4}).+(@.*)/, '$1xxxxxxxx$2') : 'xxxxxxxxxxxxxx@demo',
        username: u.user_name || '-',
        countryCode: (u.country_short_name || 'IN').toUpperCase(),
        country: u.country || 'India',
        joinedAt: u.createdAt || new Date().toISOString(),
        platform: (u.platforms || ['android']).includes('web') ? 'Web' : 'App',
        reportCounts: 0,
        status: Array.isArray((u as any).socket_ids) && ((u as any).socket_ids.length > 0) ? 'Online' : 'Offline',
        is_blocked: u?.blocked_by_admin
      }));
      setRows(mapped);
    } catch (e) {
      console.error('Failed to load users list:', e);
      setRows([]);
    }
  };

  useEffect(() => {
    fetchAll(search);
  }, [search]);
  return (
    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6">
        <h1 className="text-lg sm:text-xl font-semibold text-table-header-text">User List</h1>
       
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="mt-2">
          <Breadcrumb />
        </div>
        <div className="flex items-center gap-2 relative w-full sm:w-auto sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 font-extrabold text-text-muted" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchAll(search);
            }}
            placeholder="Search by name or number"
            className="pl-8 sm:pl-9 bg-secondary/80 text-text-muted w-full sm:min-w-[200px] text-sm sm:text-base"
          />
        </div>

      </div>
      <div className="w-full overflow-x-auto">
        <DataTable data={rows} columns={columns} defaultPageSize={10} />
      </div>
    </div>
  );
}


