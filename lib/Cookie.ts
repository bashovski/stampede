interface CookieOptions {
    domain : string,
    sameSite : string,
    expires : Date,
    secure : boolean,
    path : string
}

class Cookie {

    private readonly name : string;
    private readonly value : string;
    private readonly options : CookieOptions;

    constructor(
        name : string,
        value : string,
        options : CookieOptions
    ) {
        this.name = name;
        this.value = value;
        this.options = options;
    }

    public getName() {
        return this.name;
    }

    public getValue() {
        return this.value;
    }

    public getOptions() {
        return this.options;
    }

}

export default Cookie;
