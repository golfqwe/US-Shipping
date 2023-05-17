import {
    ApertureIcon,
    CopyIcon,
    LayoutDashboardIcon, LoginIcon, MoodHappyIcon, TypographyIcon, UserPlusIcon
} from 'vue-tabler-icons';

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
    { header: 'utilities' },
    {
        title: 'Typography',
        icon: TypographyIcon,
        to: '/admin/ui/typography'
    },
    {
        title: 'Shadow',
        icon: CopyIcon,
        to: '/admin/ui/shadow'
    },
    { header: 'auth' },
    {
        title: 'Login',
        icon: LoginIcon,
        to: '/admin/auth/login'
    },
    {
        title: 'Register',
        icon: UserPlusIcon,
        to: '/admin/auth/register'
    },
    { header: 'Extra' },
    {
        title: 'Icons',
        icon: MoodHappyIcon,
        to: '/admin/icons'
    },
    {
        title: 'Sample Page',
        icon: ApertureIcon,
        to: '/admin/sample-page'
    },
];

export default sidebarItem;
