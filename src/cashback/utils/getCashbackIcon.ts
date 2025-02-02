import { ECashbackIcon } from 'cashback-check-types';
import {
    NAMES_ACCESSORIES,
    NAMES_ANIMALS,
    NAMES_APPLIANCES,
    NAMES_ART, NAMES_BEAUTY,
    NAMES_BOOKS,
    NAMES_CARSHARING,
    NAMES_CINEMA,
    NAMES_CLOTHES,
    NAMES_COMMON,
    NAMES_EDUCATION,
    NAMES_FAST_FOOD,
    NAMES_FLOWERS,
    NAMES_FURNITURE,
    NAMES_GAS,
    NAMES_GROCERY,
    NAMES_HOME, NAMES_KIDS,
    NAMES_MUSIC,
    NAMES_PHARMACY,
    NAMES_RESTAURANT,
    NAMES_SPORT,
    NAMES_TAXI,
    NAMES_TRANSPORT,
    NAMES_UTILS
} from '../cashback.constants';

export function getCashbackIcon(
    name: string,
): ECashbackIcon {
    name = name.toLowerCase();
    if (isValid(name, NAMES_ART)) {
        return ECashbackIcon.ART;
    } else if (isValid(name, NAMES_UTILS)) {
        return ECashbackIcon.UTILS;
    } else if (isValid(name, NAMES_CINEMA)) {
        return ECashbackIcon.CINEMA;
    } else if (isValid(name, NAMES_EDUCATION)) {
        return ECashbackIcon.EDUCATION;
    } else if (isValid(name, NAMES_BOOKS)) {
        return ECashbackIcon.BOOKS;
    } else if (isValid(name, NAMES_GAS)) {
        return ECashbackIcon.GAS;
    } else if (isValid(name, NAMES_TAXI)) {
        return ECashbackIcon.TAXI;
    } else if (isValid(name, NAMES_RESTAURANT)) {
        return ECashbackIcon.RESTAURANT;
    } else if (isValid(name, NAMES_FAST_FOOD)) {
        return ECashbackIcon.FAST_FOOD;
    } else if (isValid(name, NAMES_CARSHARING)) {
        return ECashbackIcon.CARSHARING;
    } else if (isValid(name, NAMES_PHARMACY)) {
        return ECashbackIcon.PHARMACY;
    } else if (isValid(name, NAMES_CLOTHES)) {
        return ECashbackIcon.CLOTHES;
    } else if (isValid(name, NAMES_FURNITURE)) {
        return ECashbackIcon.FURNITURE;
    } else if (isValid(name, NAMES_SPORT)) {
        return ECashbackIcon.SPORT;
    } else if (isValid(name, NAMES_MUSIC)) {
        return ECashbackIcon.MUSIC;
    } else if (isValid(name, NAMES_BEAUTY)) {
        return ECashbackIcon.BEAUTY;
    } else if (isValid(name, NAMES_KIDS)) {
        return ECashbackIcon.KIDS;
    } else if (isValid(name, NAMES_APPLIANCES)) {
        return ECashbackIcon.APPLIANCES;
    } else if (isValid(name, NAMES_TRANSPORT)) {
        return ECashbackIcon.TRANSPORT;
    } else if (isValid(name, NAMES_FLOWERS)) {
        return ECashbackIcon.FLOWERS;
    } else if (isValid(name, NAMES_HOME)) {
        return ECashbackIcon.HOME;
    } else if (isValid(name, NAMES_GROCERY)) {
        return ECashbackIcon.GROCERY;
    } else if (isValid(name, NAMES_ANIMALS)) {
        return ECashbackIcon.ANIMALS;
    } else if (isValid(name, NAMES_ACCESSORIES)) {
        return ECashbackIcon.ACCESSORIES;
    } else if (isValid(name, NAMES_COMMON)) {
        return ECashbackIcon.COMMON;
    } else {
        return ECashbackIcon.OTHER;
    }
}

function isValid(
    name: string,
    namesToCheck: string[],
): boolean {
    let isValid = false;
    for (let i = 0; i < namesToCheck.length; i++) {
        if (name.includes(namesToCheck[i])) {
            isValid = true;
            break;
        }
    }
    return isValid;
}
