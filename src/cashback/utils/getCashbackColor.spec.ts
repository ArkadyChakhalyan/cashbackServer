import { ECashbackColor, ECashbackIcon } from 'cashback-check-types';
import { getCashbackColor } from './getCashbackColor';
import { ALL_COLORS } from '../cashback.constants';

describe('getCashbackColor', () => {
    it('returns BLUE for GROCERY', () => {
        expect(getCashbackColor(ECashbackIcon.GROCERY)).toBe(ECashbackColor.BLUE);
    });

    it('returns BLUE for CARSHARING', () => {
        expect(getCashbackColor(ECashbackIcon.CARSHARING)).toBe(ECashbackColor.BLUE);
    });

    it('returns BLUE for SPORT', () => {
        expect(getCashbackColor(ECashbackIcon.SPORT)).toBe(ECashbackColor.BLUE);
    });

    it('returns BROWN for UTILS', () => {
        expect(getCashbackColor(ECashbackIcon.UTILS)).toBe(ECashbackColor.BROWN);
    });

    it('returns BROWN for COMMON', () => {
        expect(getCashbackColor(ECashbackIcon.COMMON)).toBe(ECashbackColor.BROWN);
    });

    it('returns PINK for BEAUTY', () => {
        expect(getCashbackColor(ECashbackIcon.BEAUTY)).toBe(ECashbackColor.PINK);
    });

    it('returns PINK for APPLIANCES', () => {
        expect(getCashbackColor(ECashbackIcon.APPLIANCES)).toBe(ECashbackColor.PINK);
    });

    it('returns PINK for TRAVEL', () => {
        expect(getCashbackColor(ECashbackIcon.TRAVEL)).toBe(ECashbackColor.PINK);
    });

    it('returns RED for RESTAURANT', () => {
        expect(getCashbackColor(ECashbackIcon.RESTAURANT)).toBe(ECashbackColor.RED);
    });

    it('returns RED for FAST_FOOD', () => {
        expect(getCashbackColor(ECashbackIcon.FAST_FOOD)).toBe(ECashbackColor.RED);
    });

    it('returns ORANGE for FLOWERS', () => {
        expect(getCashbackColor(ECashbackIcon.FLOWERS)).toBe(ECashbackColor.ORANGE);
    });

    it('returns ORANGE for CLOTHES', () => {
        expect(getCashbackColor(ECashbackIcon.CLOTHES)).toBe(ECashbackColor.ORANGE);
    });

    it('returns YELLOW for TAXI', () => {
        expect(getCashbackColor(ECashbackIcon.TAXI)).toBe(ECashbackColor.YELLOW);
    });

    it('returns YELLOW for TRANSPORT', () => {
        expect(getCashbackColor(ECashbackIcon.TRANSPORT)).toBe(ECashbackColor.YELLOW);
    });

    it('returns GREEN for PHARMACY', () => {
        expect(getCashbackColor(ECashbackIcon.PHARMACY)).toBe(ECashbackColor.GREEN);
    });

    it('returns GREEN for HOME', () => {
        expect(getCashbackColor(ECashbackIcon.HOME)).toBe(ECashbackColor.GREEN);
    });

    it('returns GREEN for ACCESSORIES', () => {
        expect(getCashbackColor(ECashbackIcon.ACCESSORIES)).toBe(ECashbackColor.GREEN);
    });

    it('returns DARK_GREEN for KIDS', () => {
        expect(getCashbackColor(ECashbackIcon.KIDS)).toBe(ECashbackColor.DARK_GREEN);
    });

    it('returns DARK_GREEN for BOOKS', () => {
        expect(getCashbackColor(ECashbackIcon.BOOKS)).toBe(ECashbackColor.DARK_GREEN);
    });

    it('returns DARK_GREEN for SMILE', () => {
        expect(getCashbackColor(ECashbackIcon.SMILE)).toBe(ECashbackColor.DARK_GREEN);
    });

    it('returns PURPLE for FURNITURE', () => {
        expect(getCashbackColor(ECashbackIcon.FURNITURE)).toBe(ECashbackColor.PURPLE);
    });

    it('returns PURPLE for GAS', () => {
        expect(getCashbackColor(ECashbackIcon.GAS)).toBe(ECashbackColor.PURPLE);
    });

    it('returns PURPLE for MARKET', () => {
        expect(getCashbackColor(ECashbackIcon.MARKET)).toBe(ECashbackColor.PURPLE);
    });

    it('returns DARK_PURPLE for ART', () => {
        expect(getCashbackColor(ECashbackIcon.ART)).toBe(ECashbackColor.DARK_PURPLE);
    });

    it('returns DARK_PURPLE for CINEMA', () => {
        expect(getCashbackColor(ECashbackIcon.CINEMA)).toBe(ECashbackColor.DARK_PURPLE);
    });

    it('returns DARK_PURPLE for ANIMALS', () => {
        expect(getCashbackColor(ECashbackIcon.ANIMALS)).toBe(ECashbackColor.DARK_PURPLE);
    });

    it('returns a random color from ALL_COLORS for OTHER', () => {
        const color = getCashbackColor(ECashbackIcon.OTHER);
        expect(ALL_COLORS).toContain(color);
    });

    it('returns a random color from ALL_COLORS for EDUCATION', () => {
        const color = getCashbackColor(ECashbackIcon.EDUCATION);
        expect(ALL_COLORS).toContain(color);
    });

    it('returns a random color from ALL_COLORS for MUSIC', () => {
        const color = getCashbackColor(ECashbackIcon.MUSIC);
        expect(ALL_COLORS).toContain(color);
    });
});
