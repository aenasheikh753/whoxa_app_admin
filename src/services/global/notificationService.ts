import { BaseApiService } from "@/services/api/baseApi";
import { API_CONFIG } from "@/config/api";

export interface IsNotificationAvailableResponse {
    status: boolean;
    data: IsNotificationAvailableResponseData;
    message: string;
    toast: boolean;
}

export interface IsNotificationAvailableResponseData {
    is_available: boolean;
}


export interface NotificationListResponse {
    status: boolean;
    data: NotificationListResponseData;
    message: string;
    toast: boolean;
}

export interface NotificationListResponseData {
    newUsers: NewUser[];
    Pagination: Pagination;
}

export interface Pagination {
    total_pages: number;
    total_records: number;
    current_page: number;
    records_per_page: number;
}

export interface NewUser {
    user_name: string;
    mobile_num: string;
    user_id: number;
    first_name: string;
    last_name: null | string;
    profile_pic:  null | string;
    createdAt:string

}


export interface NotificationListParams{
    page?: number,
    limit?:number
}

class NotificationService extends BaseApiService {
    constructor() {
        super("admin");
    }

    async isNotificationAvailable(): Promise<IsNotificationAvailableResponse> {
        return this.get<IsNotificationAvailableResponse, IsNotificationAvailableResponse>("/is-notification-available" );
    }

    async notificationList(params: NotificationListParams = {}): Promise<NotificationListResponse> {
        return this.post<NotificationListResponse, NotificationListResponse>("/new-user-notifications", {
          page: params.page ?? API_CONFIG.PAGINATION.DEFAULT_PAGE,
          limit: params.limit ?? API_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
        });
      }
}

export const notificationService = new NotificationService();
