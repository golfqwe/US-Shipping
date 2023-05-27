import {
  TicketIcon,
  FileInvoiceIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  TruckIcon,
  BuildingBankIcon,
  CalendarIcon,
  QuestionMarkIcon,
  HeadsetIcon,
  ShoppingCartIcon
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
    to: '/admin/trackings'
  },
  {
    title: 'แจ้งชำระบิล',
    icon: FileInvoiceIcon,
    to: '/admin/payment'
  },
  {
    title: 'บันทึกรูปสินค้า',
    icon: TicketIcon,
    to: '/admin/takePhoto'
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
    to: '/admin/bookBank'
  },
  { header: 'utilities' },
  {
    title: 'ตารางรอบนำเข้า',
    icon: CalendarIcon,
    to: '/admin/nextDayService'
  },
  {
    title: 'คำถามที่พบบ่อย',
    icon: QuestionMarkIcon,
    to: '/admin/faq'
  },
  {
    title: 'บริการรับกดสั่งสินค้า ประมูลสินค้า',
    icon: ShoppingCartIcon,
    to: '/admin/auction'
  },
  {
    title: 'ติดต่อเจ้าหน้าที่',
    icon: HeadsetIcon,
    to: '/admin/customService'
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
