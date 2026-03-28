import { ECashbackIcon } from 'cashback-check-types';
import { getCashbackIcon } from './getCashbackIcon';

describe('getCashbackIcon', () => {
    it('returns OTHER for empty string', () => {
        expect(getCashbackIcon('')).toBe(ECashbackIcon.OTHER);
    });

    it('returns OTHER for undefined', () => {
        expect(getCashbackIcon(undefined)).toBe(ECashbackIcon.OTHER);
    });

    it('returns OTHER for unrecognised name', () => {
        expect(getCashbackIcon('неизвестная категория')).toBe(ECashbackIcon.OTHER);
    });

    it('returns ART for "искусство"', () => {
        expect(getCashbackIcon('искусство')).toBe(ECashbackIcon.ART);
    });

    it('returns ART for "театр"', () => {
        expect(getCashbackIcon('театр')).toBe(ECashbackIcon.ART);
    });

    it('returns UTILS for "жкх"', () => {
        expect(getCashbackIcon('жкх')).toBe(ECashbackIcon.UTILS);
    });

    it('returns UTILS for "комунальные"', () => {
        expect(getCashbackIcon('комунальные')).toBe(ECashbackIcon.UTILS);
    });

    it('returns CINEMA for "кино"', () => {
        expect(getCashbackIcon('кино')).toBe(ECashbackIcon.CINEMA);
    });

    it('returns CINEMA for "фильмы"', () => {
        expect(getCashbackIcon('фильмы')).toBe(ECashbackIcon.CINEMA);
    });

    it('returns EDUCATION for "образование"', () => {
        expect(getCashbackIcon('образование')).toBe(ECashbackIcon.EDUCATION);
    });

    it('returns BOOKS for "книги"', () => {
        expect(getCashbackIcon('книги')).toBe(ECashbackIcon.BOOKS);
    });

    it('returns BOOKS for "канцтовары"', () => {
        expect(getCashbackIcon('канцтовары')).toBe(ECashbackIcon.BOOKS);
    });

    it('returns GAS for "бензин"', () => {
        expect(getCashbackIcon('бензин')).toBe(ECashbackIcon.GAS);
    });

    it('returns GAS for "азс"', () => {
        expect(getCashbackIcon('азс')).toBe(ECashbackIcon.GAS);
    });

    it('returns GAS for "заправка"', () => {
        expect(getCashbackIcon('заправка')).toBe(ECashbackIcon.GAS);
    });

    it('returns TAXI for "такси"', () => {
        expect(getCashbackIcon('такси')).toBe(ECashbackIcon.TAXI);
    });

    it('returns RESTAURANT for "ресторан"', () => {
        expect(getCashbackIcon('ресторан')).toBe(ECashbackIcon.RESTAURANT);
    });

    it('returns RESTAURANT for "кафе"', () => {
        expect(getCashbackIcon('кафе')).toBe(ECashbackIcon.RESTAURANT);
    });

    it('returns FAST_FOOD for "фастфуд"', () => {
        expect(getCashbackIcon('фастфуд')).toBe(ECashbackIcon.FAST_FOOD);
    });

    it('returns CARSHARING for "каршеринг"', () => {
        expect(getCashbackIcon('каршеринг')).toBe(ECashbackIcon.CARSHARING);
    });

    it('returns PHARMACY for "аптека"', () => {
        expect(getCashbackIcon('аптека')).toBe(ECashbackIcon.PHARMACY);
    });

    it('returns PHARMACY for "медицина"', () => {
        expect(getCashbackIcon('медицина')).toBe(ECashbackIcon.PHARMACY);
    });

    it('returns CLOTHES for "одежда"', () => {
        expect(getCashbackIcon('одежда')).toBe(ECashbackIcon.CLOTHES);
    });

    it('returns CLOTHES for "обувь"', () => {
        expect(getCashbackIcon('обувь')).toBe(ECashbackIcon.CLOTHES);
    });

    it('returns FURNITURE for "мебель"', () => {
        expect(getCashbackIcon('мебель')).toBe(ECashbackIcon.FURNITURE);
    });

    it('returns TRANSPORT for "транспорт"', () => {
        expect(getCashbackIcon('транспорт')).toBe(ECashbackIcon.TRANSPORT);
    });

    it('returns MUSIC for "музыка"', () => {
        expect(getCashbackIcon('музыка')).toBe(ECashbackIcon.MUSIC);
    });

    it('returns BEAUTY for "красота"', () => {
        expect(getCashbackIcon('красота')).toBe(ECashbackIcon.BEAUTY);
    });

    it('returns KIDS for "детские"', () => {
        expect(getCashbackIcon('детские')).toBe(ECashbackIcon.KIDS);
    });

    it('returns APPLIANCES for "техника"', () => {
        expect(getCashbackIcon('техника')).toBe(ECashbackIcon.APPLIANCES);
    });

    it('returns APPLIANCES for "электроника"', () => {
        expect(getCashbackIcon('электроника')).toBe(ECashbackIcon.APPLIANCES);
    });

    it('returns SPORT for "спорт"', () => {
        expect(getCashbackIcon('спорт')).toBe(ECashbackIcon.SPORT);
    });

    it('returns FLOWERS for "цветы"', () => {
        expect(getCashbackIcon('цветы')).toBe(ECashbackIcon.FLOWERS);
    });

    it('returns SMILE for "улыбка"', () => {
        expect(getCashbackIcon('улыбка')).toBe(ECashbackIcon.SMILE);
    });

    it('returns TRAVEL for "путешествия"', () => {
        expect(getCashbackIcon('путешествия')).toBe(ECashbackIcon.TRAVEL);
    });

    it('returns TRAVEL for "авиа"', () => {
        expect(getCashbackIcon('авиа')).toBe(ECashbackIcon.TRAVEL);
    });

    it('returns HOME for "дом"', () => {
        expect(getCashbackIcon('дом')).toBe(ECashbackIcon.HOME);
    });

    it('returns HOME for "ремонт"', () => {
        expect(getCashbackIcon('ремонт')).toBe(ECashbackIcon.HOME);
    });

    it('returns GROCERY for "супермаркет"', () => {
        expect(getCashbackIcon('супермаркет')).toBe(ECashbackIcon.GROCERY);
    });

    it('returns GROCERY for "продукты"', () => {
        expect(getCashbackIcon('продукты')).toBe(ECashbackIcon.GROCERY);
    });

    it('returns MARKET for "маркет"', () => {
        expect(getCashbackIcon('маркет')).toBe(ECashbackIcon.MARKET);
    });

    it('returns MARKET for "ozon"', () => {
        expect(getCashbackIcon('ozon')).toBe(ECashbackIcon.MARKET);
    });

    it('returns MARKET for "wildberries"', () => {
        expect(getCashbackIcon('wildberries')).toBe(ECashbackIcon.MARKET);
    });

    it('returns ANIMALS for "животные"', () => {
        expect(getCashbackIcon('животные')).toBe(ECashbackIcon.ANIMALS);
    });

    it('returns ACCESSORIES for "аксессуары"', () => {
        expect(getCashbackIcon('аксессуары')).toBe(ECashbackIcon.ACCESSORIES);
    });

    it('returns COMMON for "все"', () => {
        expect(getCashbackIcon('все')).toBe(ECashbackIcon.COMMON);
    });

    it('returns COMMON for "любые"', () => {
        expect(getCashbackIcon('любые')).toBe(ECashbackIcon.COMMON);
    });

    it('is case-insensitive', () => {
        expect(getCashbackIcon('ТАКСИ')).toBe(ECashbackIcon.TAXI);
        expect(getCashbackIcon('Ресторан')).toBe(ECashbackIcon.RESTAURANT);
    });
});
