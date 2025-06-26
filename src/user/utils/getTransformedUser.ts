import { User } from '../schemas/user.schema';
import { IUser } from 'cashback-check-types';

export function getTransformedUser(user: User): IUser {
    const {
        _id,
        email,
        name,
        picture,
        cashbacksView,
        seenStories,
        settings,
    } = user;
    return {
        email,
        id: _id.toString(),
        name,
        picture,
        cashbacksView,
        seenStories,
        settings,
    };
}
