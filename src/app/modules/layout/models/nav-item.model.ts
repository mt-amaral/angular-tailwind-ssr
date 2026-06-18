export interface NavItem {
  name: string;
  icon?: string;
  routerLink?: string;
  children?: NavItem[];
}
