import { DataTypes } from 'https://raw.githubusercontent.com/eveningkid/denodb/abed3063dd92436ceb4f124227daee5ee6604b2d/mod.ts';
import Model from '../lib/Model.ts';

class __replace_me__ extends Model {

    static table = '__replace_plural_model_name__';
    static timestamps = true;

    static fields = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        }
    };
}

export default __replace_me__;
