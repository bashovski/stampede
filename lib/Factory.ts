export interface FactoryOptions {
    model: any,
    persistenceCount: number,
    fields?: any
}

class Factory {

    private readonly model: any;
    private readonly persistenceCount: number;
    private readonly fields: any;

    constructor({ model, persistenceCount, fields }: FactoryOptions) {
        this.model = model;
        this.persistenceCount = persistenceCount;
        this.fields = fields;
    }

    public async populate() {
        for (let i = 0; i < this.persistenceCount; i++) {
            const payload: any = {};
            for (const field in this.fields) {
                payload[field] = this.fields[field] && {}.toString.call(this.fields[field]) === '[object Function]' ? this.fields[field]() : this.fields[field];
            }
            await this.model.create(payload);
        }
    }

    public getModel(): any {
        return this.model;
    }

    public getPersistenceCount(): number {
        return this.persistenceCount;
    }

    public getFields(): any {
        return this.fields;
    }
}

export default Factory;
