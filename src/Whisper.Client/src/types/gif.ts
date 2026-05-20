export interface GifResponseDto {
    result: boolean,
    data: GifDataDto
}

export interface GifDataDto {
    data: GifInstanceDto[],
    current_page: number,
    per_page: number,
    has_next: boolean
}

export interface GifInstanceDto {
    id: bigint,
    slug: string,
    title: string,
    file: GifFileDto
}

export interface GifFileDto {
    hd: GifFormatDto,
    md: GifFormatDto,
    sm: GifFormatDto,
    xs: GifFormatDto
}

export interface GifFormatDto {
    gif: GifDto
}

export interface GifDto {
    url: string,
    width: number,
    height: number,
    size: number
}