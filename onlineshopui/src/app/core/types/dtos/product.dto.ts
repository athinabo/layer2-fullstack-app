export type ProductCategoryDto = {
    id: string;
    name: string;
    description: string;
};

export type SupplierDto = {
    id: string;
    name: string;
    contactEmail: string;
    contactPhone: string;
    address: {
        country: string;
        city: string;
        county: string;
        streetAddress: string;
    };
};

export type ProductDto = {
    id: string;
    name: string;
    description: string;
    price: number;
    weight: number;
    category: ProductCategoryDto;
    supplier: SupplierDto;
    imageUrl: string;
};

export type CreateProductRequest = Omit<ProductDto, 'id' | 'category' | 'supplier'> & {
    categoryId: string;
    supplierId: string;
};

export type UpdateProductRequest = Partial<ProductDto> & { categoryId?: string; supplierId?: string };
