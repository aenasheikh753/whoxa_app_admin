import { DataTable, type DataTableColumn, Button, Modal, Input } from '@/components/ui';
import { useState, useEffect } from 'react';
import { groupService, type Chat } from '@/services/global/groupService';
import { Breadcrumb } from '@/layouts';
import { Search } from 'lucide-react';

// Types moved to groupService

type GroupRow = {
  id: number;
  group_icon: string;
  group_name: string;
  group_description: string;
  is_group_blocked: string;
  countryCode: string; // ISO alpha-2
  country: string;
  createdAt: string; // ISO date
  participants: Chat['participants'];
};

const columns: Array<DataTableColumn<GroupRow>> = [
  {
    header: 'ID',
    cell: (r: GroupRow) => (
      <span className="text-primary-600">#{r.id}</span>
    ),
    className: 'w-24',
  },
  {
    header: 'Full Name',
    cell: (r: GroupRow) => (
      <div className="flex items-center gap-3">
        <img src={r.group_icon} className="h-8 w-8 rounded-full" alt="avatar" />
        <div>
          <div className="text-table-text text-sm font-medium">{r.group_name}</div>
          <div className="text-xs text-text-muted">{r.group_description}</div>
        </div>
      </div>
    ),
  },
  // {
  //   header: 'User Name',
  //   accessor: '',
  //   sortable: true,
  // },
  // {
  //   header: 'Country',
  //   cell: (r) => (
  //     <div className="inline-flex items-center gap-2">
  //       <span className="text-lg leading-none">{countryFlag(r.countryCode)}</span>
  //       <span className="text-sm text-table-text">{r.country}</span>
  //     </div>
  //   ),
  // },

  {
    header: 'Participants',
    cell: (r: GroupRow) => (
      <span >
        {r.participants.length}
      </span>
    ),
    sortable: true,
    accessor: 'participants'
  },
  {
    header: 'Creation date',
    accessor: 'createdAt',
    cell: (r: GroupRow) => new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
    sortable: true,
  },

  {
    header: 'Actions',
    cell: (row: GroupRow) => <ViewMembersButton group={row} />,
    className: 'w-56',
  },
];

const ViewMembersButton = ({ group }: { group: GroupRow }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="inline-flex items-center gap-3 w-full">
        <Button
          size='sm'
          className="text-black bg-primary-dark hover:underline text-sm  text-left"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
        >
          View Members
        </Button>
        {/* <span className="text-gray-400">⋮</span> */}
      </div>

      <MembersModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        group={group}
      />
    </>
  );
};

const MembersModal = ({
  isOpen,
  onClose,
  group
}: {
  isOpen: boolean;
  onClose: () => void;
  group: GroupRow | null
}) => {
  if (!group) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${group.group_name} - Members (${group.participants?.length || 0})`}
      size="md"

    >
      <div className="space-y-4 p-6">
        <div className="max-h-[60vh] overflow-y-auto">
          {group.participants?.length ? (
            <ul className="divide-y divide-table-divider">
              {group.participants.map((participant, index) => (
                <li key={index} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={participant.User?.profile_pic || '/default-avatar.png'}
                      alt={participant.User?.full_name || 'User'}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-bold text-text-muted">
                        {participant.User?.full_name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-text-muted">
                        @{participant.User?.user_name || 'nousername'}
                      </p>
                    </div>
                  </div>
                  {participant.is_creator ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-dark text-black">
                    Admin
                  </span> : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-text-muted">
                    Member
                  </span>}

                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center font-bold text-text-muted py-4">No members found in this group.</p>
          )}
        </div>
        {/* <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button 
            onClick={onClose}
            variant="outline"
          >
            Close
          </Button>
        </div> */}
      </div>
    </Modal>
  );
};

export default function GroupListPage() {
  const [rows, setRows] = useState<GroupRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumnIndex, setSortColumnIndex] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1,
  });

  // Debounce search is now handled in the main effect
  // Remove the separate debounce effect since we're handling it in the main effect

  // Handle data fetching
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);

        // Get sort field from columns if sort is active
        let sortField: string | undefined;
        if (sortColumnIndex !== null && sortColumnIndex < columns.length) {
          const sortColumn = columns[sortColumnIndex];
          if (sortColumn && sortColumn.accessor && typeof sortColumn.accessor === 'string') {
            sortField = sortColumn.accessor;
          }
        }

        const params: any = {
          page: pagination.currentPage,
          pageSize: pagination.itemsPerPage,
        };

        // Only add sort parameters if we have a sort field
        if (sortField) {
          console.log("sortby", sortField);

          if (sortField == "participants") {
            params.sortBy = "user_count"
          }
          else {

            params.sortBy = sortField;
          }
          params.sortOrder = sortDirection;
        }

        // Add search term if provided
        if (searchTerm) {
          params.search = searchTerm;
        }
        console.log("params", params);

        const response = await groupService.getGroupList(params);

        if (!isMounted) return;

        const data = response?.data || {};
        const groups = data.chats || [];
        const paginationData = data.pagination || {};

        setPagination(prev => ({
          ...prev,
          currentPage: pagination.currentPage || 1,
          itemsPerPage: paginationData.pageSize || 1,
          totalItems: paginationData.total || 0,
          totalPages: paginationData.total_pages || 1,
        }));

        const mapped: GroupRow[] = groups.map((chat: Chat) => {
          // Safely handle createdAt date
          let createdAt: string;
          try {
            const dateValue = (chat as any).createdAt || (chat as any).created_at;
            createdAt = dateValue ? new Date(dateValue).toISOString() : new Date().toISOString();
          } catch (e) {
            console.warn('Error parsing date, using current date', e);
            createdAt = new Date().toISOString();
          }

          return {
            id: chat.chat_id,
            group_icon: chat.group_icon || '/assets/group-default.png',
            group_name: chat.group_name || 'Unnamed Group',
            group_description: chat.group_description || '',
            is_group_blocked: chat.is_group_blocked ? 'Blocked' : 'Active',
            countryCode: 'IN',
            country: 'India',
            createdAt,
            participants: chat.participants || []
          };
        });

        setRows(mapped);
      } catch (e) {
        if (isMounted) {
          console.error('Failed to load Group list:', e);
          setRows([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [pagination.currentPage, pagination.itemsPerPage, sortColumnIndex, sortDirection, searchTerm]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      itemsPerPage: pageSize,
      currentPage: 1 // Reset to first page when changing page size
    }));
  };

  const handleSearch = () => {
    // The search is now handled by the main effect which watches searchTerm
    // Just reset to first page when search is triggered
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  const handleSortChange = (columnIndex: number | null, direction: 'ASC' | 'DESC') => {
    console.log("hitted", columnIndex);

    setSortColumnIndex(columnIndex);
    setSortDirection(direction);
    // Reset to first page when sorting changes
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  return (
    <div className="space-y-4">
      <div className="mt-2">
        <div className="mb-5">
          <Breadcrumb />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-muted">Group List</h1>
        <div className="flex items-center gap-2 relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 font-extrabold text-text-muted" />

          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}

            placeholder="Search by name or number"
            className="pl-9 bg-secondary/80 text-text-muted w-full min-w-[200px]"
          />
        </div>

        
      </div>
      <DataTable
        data={rows}
        columns={columns}
        className={isLoading ? 'opacity-50' : ''}
        // Controlled pagination props
        currentPage={pagination.currentPage}
        itemsPerPage={pagination.itemsPerPage}
        totalItems={pagination.totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        sortColumnIndex={sortColumnIndex}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        serverPagination={true}
      />
    </div>
  );
}
