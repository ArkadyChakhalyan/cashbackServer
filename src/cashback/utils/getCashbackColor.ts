import { ECashbackColor, ECashbackIcon } from 'cashback-check-types';
import {
    ALL_COLORS,
    BLUE_ICONS,
    BROWN_ICONS, DARK_GREEN_ICONS, DARK_PURPLE_ICONS,
    GREEN_ICONS,
    ORANGE_ICONS,
    PINK_ICONS,
    PURPLE_ICONS,
    RED_ICONS,
    YELLOW_ICONS
} from '../cashback.constants';

export function getCashbackColor(
    icon: ECashbackIcon,
): ECashbackColor {
    if (BLUE_ICONS.includes(icon)) {
        return ECashbackColor.BLUE;
    } else if (BROWN_ICONS.includes(icon)) {
        return ECashbackColor.BROWN;
    } else if (PINK_ICONS.includes(icon)) {
        return ECashbackColor.PINK;
    } else if (RED_ICONS.includes(icon)) {
        return ECashbackColor.RED;
    } else if (ORANGE_ICONS.includes(icon)) {
        return ECashbackColor.ORANGE;
    } else if (YELLOW_ICONS.includes(icon)) {
        return ECashbackColor.YELLOW;
    } else if (GREEN_ICONS.includes(icon)) {
        return ECashbackColor.GREEN;
    } else if (DARK_GREEN_ICONS.includes(icon)) {
        return ECashbackColor.DARK_GREEN;
    } else if (PURPLE_ICONS.includes(icon)) {
        return ECashbackColor.PURPLE;
    } else if (DARK_PURPLE_ICONS.includes(icon)) {
        return ECashbackColor.DARK_PURPLE;
    } else {
        return getRandomColor();
    }
}

function getRandomColor(): ECashbackColor {
    return ALL_COLORS[Math.floor(Math.random() * ALL_COLORS.length)];
}
