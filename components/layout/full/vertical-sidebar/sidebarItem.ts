import {
  TicketIcon,
  FileInvoiceIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  TruckIcon,
  BuildingBankIcon,
  CalendarIcon,
  QuestionMarkIcon
} from 'vue-tabler-icons'

export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
}

const sidebarItem: menu[] = [
  { header: 'Home' },
  {
    title: 'Dashboard',
    icon: LayoutDashboardIcon,
    to: '/admin/'
  },
  { header: 'Customer' },
  {
    title: 'Tracking',
    icon: TicketIcon,
    to: '/admin/ui/typography'
  },
  {
    title: 'แจ้งชำระบิล',
    icon: FileInvoiceIcon,
    to: '/admin/ui/typography'
  },
  { header: 'Warehouse' },
  {
    title: 'ที่อยู่โกดัง',
    icon: MapPinIcon,
    to: '/admin/warehouse'
  },
  {
    title: 'ประเภทขนส่ง',
    icon: TruckIcon,
    to: '/admin/localCarriers'
  },
  { header: 'Payment' },
  {
    title: 'ข้อมูลบัญชีที่รับชำระ',
    icon: BuildingBankIcon,
    to: '/admin/ui/typography'
  },
  { header: 'utilities' },
  {
    title: 'ตารางรอบนำเข้า',
    icon: CalendarIcon,
    to: '/admin/ui/typography'
  },
  {
    title: 'คำถามที่พบบ่อย',
    icon: QuestionMarkIcon,
    to: '/admin/sample-page'
  }
//   { header: 'utilities' },
//   {
//     title: 'Typography',
//     icon: TypographyIcon,
//     to: '/admin/ui/typography'
//   },
//   {
//     title: 'Shadow',
//     icon: CopyIcon,
//     to: '/admin/ui/shadow'
//   },
//   { header: 'auth' },
//   {
//     title: 'Login',
//     icon: LoginIcon,
//     to: '/admin/auth/login'
//   },
//   {
//     title: 'Register',
//     icon: UserPlusIcon,
//     to: '/admin/auth/register'
//   },
//   { header: 'Extra' },
//   {
//     title: 'Icons',
//     icon: MoodHappyIcon,
//     to: '/admin/icons'
//   },
//   {
//     title: 'Sample Page',
//     icon: ApertureIcon,
//     to: '/admin/sample-page'
//   }
]

export default sidebarItem
