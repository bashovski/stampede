import NavItem from '@/models/NavItem';

const items: Array<NavItem> = [
    new NavItem('Home', '/'),
    new NavItem('Help', '/help'),
    new NavItem('Sign in', '/login', false),
    new NavItem('Sign up', '/register', false),
    new NavItem('Dashboard', '/dashboard', true),
    new NavItem('Logout', '/logout', true)

];

export default {
    items
};
