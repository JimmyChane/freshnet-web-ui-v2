import type { GroupAsset, IconAsset } from '@/utils/U';

export interface NavigationParent {
  key: string;
  title: string;
  icon?: IconAsset;
  userPermissions: unknown[];
  groups: NavigationGroup[];

  isExpanded: () => boolean;
  isSelected: () => boolean;
  isWide: () => boolean;
  clickExpand: () => void;
  click: () => void;
}

export interface NavigationGroup {
  key: string;
  title: string;
  icon: unknown;
  values: GroupAsset[];
  children: unknown;
  userPermissions: unknown[];
  isLink: boolean;
  isQuery: boolean;
  groups: NavigationView[];

  isExpanded: () => boolean;
  isWide: () => boolean;
  getParent: () => NavigationParent;
}

export interface NavigationView {
  key: string;
  title: string;
  icon?: IconAsset;

  isExpanded: () => boolean;
  isSelected: () => boolean;
  isWide: () => boolean;

  getParent: () => NavigationGroup;
  getLink: () => string;

  click: () => void;
}
