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
      <span className="text-primary-600">#{r.id}</span>
    ),
    className: 'w-24',
  },
  {
    header: 'Full Name',
    cell: (r) => (
      <div className="flex items-center gap-3">
        <img src={r.profile_pic} className="h-8 w-8 rounded-full" alt="avatar" />
        <div>
          <div className="text-table-text text-sm font-medium">{r.fullName}</div>
          <div className="text-xs text-text-muted">{r.emailMasked}</div>
        </div>
      </div>
    ),
  },
  {
    header: 'User Name',
    accessor: 'username',
    sortable: true,
  },
  {
    header: 'Country',
    cell: (r) => (
      <div className="inline-flex items-center gap-2">
        <span className="text-lg leading-none">{countryFlag(r.countryCode)}</span>
        <span className="text-sm text-table-text">{r.country}</span>
      </div>
    ),
  },
  {
    header: 'Joining date',
    cell: (r) => new Date(r.joinedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
    sortable: true,
  },
  {
    header: 'Platform',
    cell: (r) => (
      <span className={r.platform === 'Web' ? 'text-green-500 border font-medium border-green-300 px-2 py-1 rounded-full text-xs' : 'text-yellow-700 border font-medium font-bold border-yellow-500 px-2 py-1 rounded-full text-xs'}>
        {r.platform}
      </span>
    ),
  },
  {
    header: 'Report Counts',
    accessor: 'reportCounts',
    // sortable: true,
  },
  {
    header: 'Status',
    cell: (r) => (
      <span className={r.status === 'Online' ? 'text-green-600 border border-emerald-100 px-2 py-1 rounded-full text-xs' : 'text-red-500 border border-red-400 px-2 py-1 rounded-full text-xs'}>{r.status}</span>
    ),
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
          className="p-2"
        />
      ),
      className: 'w-28',
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
    <div className="space-y-4">
        <h1 className="text-xl font-semibold text-table-header-text">User List</h1>
       
      <div className="flex items-center justify-between ">
        <div className="mt-2">
          <Breadcrumb />
        </div>
        <div className="flex items-center gap-2 relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 font-extrabold text-text-muted" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchAll(search);
            }}
            placeholder="Search by name or number"
            className="pl-9 bg-secondary/80 text-text-muted sm:w-full  min-w-[200px]"
          />
        </div>

      </div>
      <DataTable data={rows} columns={columns} defaultPageSize={10} />
    </div>
  );
}


