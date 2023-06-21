import {
  TicketIcon,
  FileInvoiceIcon,
  MapPinIcon,
  TruckIcon,
  BuildingBankIcon,
  CalendarIcon,
  QuestionMarkIcon,
  HeadsetIcon,
  ShoppingCartIcon,
  UserPlusIcon,
  CurrencyDollarIcon,
  BadgeIcon,
  RectangleIcon,
  AddressBookIcon
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
  { header: 'Customer' },
  {
    title: 'จัดการผู้ใช้งาน',
    icon: UserPlusIcon,
    to: '/admin/'
  },
  { header: 'Trackings' },
  {
    title: 'บิลค่าขนส่ง',
    icon: FileInvoiceIcon,
    to: '/admin/createBill'
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
  { header: 'pages' },
  {
    title: 'ค่านำเข้าสินค้า',
    icon: CurrencyDollarIcon,
    to: '/admin/freight'
  },
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
  },
  { header: 'utilities' },
  {
    title: 'Logo',
    icon: BadgeIcon,
    to: '/admin/logo'
  },
  {
    title: 'Banner',
    icon: RectangleIcon,
    to: '/admin/banner'
  },
  {
    title: 'Contact',
    icon: AddressBookIcon,
    to: '/admin/contact'
  }
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
