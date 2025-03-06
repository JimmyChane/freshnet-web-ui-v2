import type { Model } from '@/model/Model';
import { serverRequest } from '@/model/Server';
import { optNumber, textContains, trimId, trimText } from '@/utils/U';

export enum UserTypeId {
  None = -1,
  Admin = 0,
  Staff = 1,
  Customer = 2,
}
export enum ReservedUsername {
  Admin = 'admin',
  Staff = 'staff',
}

export interface UserData {
  username?: string;
  name?: string;
  userType?: number;
}

export class UserModel implements Model {
  username: string;
  name: string;
  userType: UserTypeId;

  constructor(data: UserData) {
    this.username = trimId(data.username);
    this.name = trimText(data.name);
    this.userType = optNumber(data.userType, UserTypeId.None);
  }

  toData(): UserData {
    return {
      username: trimId(this.username),
      name: trimText(this.name),
      userType: this.userType,
    };
  }

  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (textContains(this.username, str)) count++;
      if (textContains(this.name, str)) count++;
      return count;
    }, 0);
  }

  toTextUserType(): string {
    if (this.isTypeAdmin()) return 'Admin';
    if (this.isTypeStaff()) return 'Staff';
    if (this.isTypeCustomer()) return 'Customer';
    return 'Other';
  }

  isTypeNone(): boolean {
    return (
      this.userType === UserTypeId.None ||
      (!this.isTypeAdmin() && !this.isTypeStaff() && !this.isTypeCustomer())
    );
  }

  isTypeAdmin(): boolean {
    return this.userType === UserTypeId.Admin;
  }

  isTypeStaff(): boolean {
    return this.userType === UserTypeId.Staff;
  }

  isTypeCustomer(): boolean {
    return this.userType === UserTypeId.Customer;
  }

  isDefault(): boolean {
    return (
      this.username === ReservedUsername.Admin ||
      this.username === ReservedUsername.Staff
    );
  }

  compare(item: UserModel): number {
    return 0;
  }

  getUnique(): string {
    return this.username;
  }
}

export class UserRequest {
  static list(): Promise<any> {
    return serverRequest().path('users').sendJson();
  }
  static add(
    username: string,
    name: string,
    passwordNew: string,
    passwordRepeat: string,
  ): Promise<any> {
    return serverRequest()
      .path('users/user')
      .POST()
      .bodyJson({ username, name, passwordNew, passwordRepeat })
      .sendJson();
  }
  static remove(username: string): Promise<any> {
    return serverRequest()
      .DELETE()
      .path('users/user')
      .bodyJson({ username })
      .sendJson();
  }
  static update(username: string, userType: string): Promise<any> {
    return serverRequest()
      .path('users/user')
      .PUT()
      .bodyJson({ username, userType })
      .sendJson();
  }
}
