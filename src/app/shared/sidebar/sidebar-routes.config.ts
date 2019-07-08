import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    {
        path: '/users', title: 'Users', icon: 'ft-users', class: '',
        badge: '', badgeClass: '', isExternalLink: false, submenu: []
    },
    {
        path: '/profiles', title: 'Profiles', icon: 'ft-grid', class: '',
        badge: '', badgeClass: '', isExternalLink: false, submenu: []
    },
    {
        path: '/page', title: 'Pages', icon: 'ft-copy', class: '',
        badge: '', badgeClass: '', isExternalLink: false, submenu: []
    },
    {
        path: '/features', title: 'Features', icon: 'ft-list', class: 'has-sub',
        badge: '', badgeClass: '', isExternalLink: false, submenu: [
            {
                path: '/features', title: 'Features', icon: '', class: '',
                badge: '', badgeClass: '', isExternalLink: false, submenu: []
            },
            {
                path: '/config', title: 'Config Features', icon: '', class: '',
                badge: '', badgeClass: '', isExternalLink: false, submenu: []
            }
        ]
    },
    {
        path: '', title: 'Maintainers', icon: 'ft-settings', class: 'has-sub',
        badge: '', badgeClass: '', isExternalLink: false, submenu: [
            {
                path: '/sections', title: 'Sections', icon: '', class: '',
                badge: '', badgeClass: '', isExternalLink: false, submenu: []
            },
            {
                path: '/directories', title: 'Directories', icon: '', class: '',
                badge: '', badgeClass: '', isExternalLink: false, submenu: []
            },
            {
                path: '/institutions', title: 'Institution', icon: '', class: '',
                badge: '', badgeClass: '', isExternalLink: false, submenu: []
            },
        ]
    },
];
