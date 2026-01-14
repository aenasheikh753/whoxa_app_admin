import { DataTable, type DataTableColumn, Input, Button } from '@/components/ui';
import { useEffect, useState } from 'react';
import { userService, type UsersListItem } from '@/services/global/userService';
import { Breadcrumb } from '@/layouts';
import { useModal } from '@/providers/ModalProvider';

type BlockedUsersResponse = {
  status: boolean;
  data: {
    Records: UsersListItem[];
    Pagination: {
      total_pages: number;
      total_records: number;
      current_page: number;
      records_per_page: number;
    };
  };
  message: string;
  toast: boolean;
};

type Platform = 'App' | 'Web';
type Status = 'Online' | 'Offline' | 'Blocked';

type UserRow = {
  id: number;
  blocked: {
    user_id: number;
    user_name: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_pic: string;
  },
  blocker: {
    user_id: number;
    user_name: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_pic: string;
  }
};


export default function BlockedUserListPage() {
  const mockRows: UserRow[] = [];
  const [rows, setRows] = useState<UserRow[]>(mockRows);
  const [search, setSearch] = useState('');

  function countryFlag(code: string) {
    // Use emoji flags for portability
    const cc = code.toUpperCase();
    return cc.replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
  }
  // const userList = await userService.getUsersList();

  const columns: Array<DataTableColumn<any>> = [
    {
      header: 'ID',
      cell: (r) => (
        <span className="text-primary-600 dark:text-blue-400">#{r.id}</span>
      ),
      className: 'w-16 sm:w-24',
    },
     {
       header: 'Date',
       cell: (r) => {
         const date = new Date(r.date);
         return (
           <div className="flex flex-col">
             <span className="text-xs sm:text-sm text-gray-900 dark:text-slate-50">
               {date.toLocaleDateString(undefined, { 
                 year: 'numeric', 
                 month: 'short', 
                 day: 'numeric' 
               })}
             </span>
             <span className="text-xs text-gray-500 dark:text-slate-400 sm:hidden">
               {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
             </span>
           </div>
         );
       },
       sortable: true,
       className: 'min-w-[100px] sm:min-w-[150px]',
     },
    {
      header: 'Blocked By',
      cell: (r) => (
        <div className="flex items-center gap-2 sm:gap-3 min-w-[150px] sm:min-w-[200px]">
          <img 
            src={r.block_by.profile_pic || '/assets/profile12-img.png'} 
            className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-cover flex-shrink-0" 
            alt="avatar"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/profile12-img.png';
            }}
          />
          <div className="min-w-0 flex-1">
            <div className="text-gray-900 dark:text-slate-50 text-xs sm:text-sm font-medium truncate">{r.block_by.full_name || 'N/A'}</div>
            <div className="text-gray-500 dark:text-slate-400 text-xs font-extralight truncate">{r.block_by.user_name || ''}</div>
          </div>
        </div>
      ),
      className: 'min-w-[150px] sm:min-w-[200px]',
    },
    {
      header: 'Blocked To',
      cell: (r) => (
        <div className="flex items-center gap-2 sm:gap-3 min-w-[150px] sm:min-w-[200px]">
          <img 
            src={r.block_to.profile_pic || '/assets/profile12-img.png'} 
            className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-cover flex-shrink-0" 
            alt="avatar"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/profile12-img.png';
            }}
          />
          <div className="min-w-0 flex-1">
            <div className="text-gray-900 dark:text-slate-50 text-xs sm:text-sm font-medium truncate">{r.block_to.full_name || 'N/A'}</div>
            <div className="text-gray-500 dark:text-slate-400 text-xs font-extralight truncate">{r.block_to.user_name || ''}</div>
          </div>
        </div>
      ),
      className: 'min-w-[150px] sm:min-w-[200px]',
    },
  ];
  // Client-side pagination handled by DataTable; we fetch and combine all pages

  const fetchAll = async (searchTerm: string) => {
    try {
      const first = await userService.getBlockedUserList({ page: 1, pageSize: 50, search: searchTerm }) as unknown as BlockedUsersResponse;
      console.log('Blocked users API response:', first); // Debug log to see actual response structure

      const totalPages: number = first.data?.Pagination?.total_pages ?? 1;
      const restPromises = Array.from({ length: Math.max(0, totalPages - 1) }).map((_, i) =>
        userService.getBlockedUserList({ page: i + 2, pageSize: 50, search: searchTerm })
      );
      const rest = await Promise.all(restPromises);

      // Extract blocked users from Records field
      const allUsers: UsersListItem[] = [first, ...rest]
        .flatMap((r: any) => r?.data?.Records || []);

      const mapped: any[] = allUsers.map((u: UsersListItem, idx: number) => ({
        id: Number(u.user_id ?? idx + 1),
        block_to: {
          user_id: u.blocked.user_id,
          user_name: u.blocked.user_name,
          email: u.blocked.email,
          first_name: u.blocked.first_name,
          last_name: u.blocked.last_name,
          profile_pic: u.blocked.profile_pic,
        },
        block_by: {
          user_id: u.blocker.user_id,
          user_name: u.blocker.user_name,
          email: u.blocker.email,
          first_name: u.blocker.first_name,
          last_name: u.blocker.last_name,
          profile_pic: u.blocker.profile_pic,
        },
        date: u.createdAt
      }));
      setRows(mapped);
    } catch (e) {
      console.error('Failed to load blocked users list:', e);
      setRows([]);
    }
  };

  useEffect(() => {
    fetchAll(search);
  }, [search]);
  return (
    <div className="space-y-4 p-2 sm:p-4">
      <div className="mt-2">
        <Breadcrumb />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-50">Blocked Users List</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') fetchAll(search);
            }}
            placeholder="Search by name or number"
            className="w-full sm:w-64 lg:w-72"
          />
          <Button
            variant="secondary"
            className="text-black dark:text-slate-50 w-full sm:w-auto"
            onClick={() => { fetchAll(search); }}
          >
            Search
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <DataTable data={rows} columns={columns} defaultPageSize={10} />
      </div>
    </div>
  );
}


