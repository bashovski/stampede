class NavItem {

    label: string;
    url: string;
    authRequired: boolean | null;

    constructor(label: string, url: string, authRequired: boolean | null = null) {
        this.label = label;
        this.url = url;
        this.authRequired = authRequired;
    }
}

export default NavItem;
