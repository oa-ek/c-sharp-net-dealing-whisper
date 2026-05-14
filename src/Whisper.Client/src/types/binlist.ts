export interface BinlistNumber {
    length: number;
    luhn: boolean;
}

export interface BinlistCountry {
    numeric?: string;
    alpha2?: string;
    name?: string;
    emoji?: string;
    currency?: string;
    latitude: number;
    longitude: number;
}

export interface BinlistBank {
    name?: string;
    url?: string;
    phone?: string;
    city?: string;
}

export interface BinlistResponseDto {
    number?: BinlistNumber;
    scheme?: string;
    type?: string;
    brand?: string;
    prepaid: boolean;
    country?: BinlistCountry;
    bank?: BinlistBank;
}