import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';

type CarBrandMasterState = {
    CarBrandMaster: CarBrandMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};
interface CarBrandMaster {
    _id: string;
    car_brand_name: string;
    isActive: boolean;
}
interface CarNameMaster {
    _id: string;
    car_name: string;
    car_brand_id: string;
    isActive: boolean;
}
interface CarTransmission {
    _id: string;
    car_transmission: string;
    isActive: boolean;
}
type CarNameMasterState = {
    CarNameMaster: CarNameMaster[];
    CarBrandMaster: CarBrandMaster[];
    CarTransmission: CarTransmission[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};
type CarYearMasterState = {
    CarYearMaster: CarYearMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};
interface CarYearMaster {
    _id: string;
    year: string;
    isActive: boolean;
}
type CarFueltypeMasterState = {
    CarFueltypeMaster: CarFueltypeMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};
interface CarFueltypeMaster {
    _id: string;
    fueltype: string;
    isActive: boolean;
}
type CarOwnershipMasterState = {
    CarOwnershipMaster: CarOwnershipMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};
interface CarOwnershipMaster {
    _id: string;
    ownership: string;
    isActive: boolean;
}
type CityMasterState = {
    CityMasterState: CityMasterState[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};
interface CityMaster {
    _id: string;
    city_name: string;
    isActive: boolean
}
type BikeBrandMasterState = {
    BikeBrandMaster: BikeBrandMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};
interface BikeTypeMaster {
    _id: string;
    bike_type: string;
    isActive: boolean;
}
interface BikeBrandMaster {
    _id: string;
    brand: string;
    bike_type: string;
    bike_type_id: string;
    isActive: boolean;
}
type BikeNameMasterState = {
    BikeNameMaster: BikeNameMaster[];
    BikeBrandMaster: BikeBrandMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};
interface BikeNameMaster {
    _id: string;
    bikename: string;
    bike_brand_id: string;
    isActive: boolean;
}
type BikeFueltypeMasterState = {
    BikeFueltypeMaster: BikeFueltypeMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};
interface BikeFueltypeMaster {
    _id: string;
    fueltype: string;
    isActive: boolean;
}
type BikeYearMasterState = {
    BikeYearMaster: BikeYearMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};
interface BikeYearMaster {
    _id: string;
    year: string;
    isActive: boolean;
}
type BikeColorMasterState = {
    BikeColorMaster: BikeColorMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};
interface BikeColorMaster {
    _id: string;
    bike_color_name: string;
    isActive: boolean;
}
type BikeOwnershipMasterState = {
    BikeOwnershipMaster: BikeOwnershipMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};
interface BikeOwnershipMaster {
    _id: string;
    ownership: string;
    isActive: boolean;
}
type YearofManufactureMasterState = {
    YearofManufactureMaster: YearofManufactureMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};
interface YearofManufactureMaster {
    _id: string;
    year_of_manufacture: string;
    isActive: boolean;
}
type ConditionMasterState = {
    ConditionMaster: ConditionMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};
interface ConditionMaster {
    _id: string;
    condition: string;
    isActive: boolean;
}
type producttypeMasterState = {
    producttypeMaster: producttypeMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};
interface producttypeMaster {
    _id: string;
    listing_id: string;
    product_type_id: string;
    product_type: string;
    subproduct_type: string;
    isActive: boolean;
}





type ProductListingState = {
    CarNameMaster: [],
    CarBrandMaster: [],
    CarTransmission: [],
    CarYearMaster: [],
    CarFueltypeMaster: [],
    CarColorMaster: [],
    CarOwnershipMaster: [],
    CityMaster: [],
    BikeTypeMaster: [],
    BikeBrandMaster: [],
    BikeNameMaster: [],
    BikeFueltypeMaster: [],
    BikeYearMaster: [],
    BikeColorMaster: [],
    BikeOwnershipMaster: [],
    YearofManufactureMaster: [],
    ConditionMaster: [],
    producttypeMaster: [],


    ProductListing: ProductListing[]; // updated
    productdetails: productdetails | null;
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};


export interface ProductListing {
    _id: string;
    brand_id: string;
    brand_name: string;
    car_id: string;
    car_name: string;
    model_name: string;
    year: number;
    year_id: string;
    price: number;
    kilometers_driven: number;
    fuel_type_id: string;
    fuel_type: string;
    color_id: string;
    color_name: string;
    ownership_id: string;
    ownership: string;
    images: { url: string; sequence: number; _id: string }[];
    city_id: string;
    city_name: string;
    subscription_plan: string;
    isSold: boolean;
    isPublished: boolean;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    leadCount: number;


    user_id?: {
        phone: string;
        name: string;
        email: string;
        address: string;
        business_name: string;
        business_contact_no: string;
        business_whatsapp_no: string;
    }
}


export interface SparepartListing {
    _id: string;
    brand_id: string;
    brand_name: string;
    year_of_manufacture_id: string;
    year_of_manufacture: string;
    condition_id: string;
    condition_name: string;
    product_type_name: string;
    product_type_id: string;
    price: number;
    description: string;
    images: { url: string; sequence: number; _id: string }[];
    city_id: string;
    city_name: string;
    subscription_plan: string;
    isSold: boolean;
    isPublished: boolean;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}


export interface productdetails {
    _id: string;
    brand_id: string;
    brand_name: string;
    car_id: string;
    car_name: string;
    bike_name: string;
    sparepart_name: string;
    model_name: string;
    year: number;
    year_id: string;
    year_of_manufacture_id: string;
    year_of_manufacture: string;
    price: number;
    kilometers_driven: number;
    transmission_id: string;
    transmission: string;
    condition_id: string;
    condition_name: string;
    product_type_id: string;
    product_type_name: string;
    description: string;
    fuel_type_id: string;
    fuel_type: string;
    color_id: string;
    color_name: string;
    ownership_id: string;
    ownership: string;
    images: { url: string; sequence: number; _id: string }[];
    city_id: string;
    city_name: string;
    subscription_plan: string;
    isSold: boolean;
    isPublished: boolean;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    user_id?: {
        phone: string;
        name: string;
        email: string;
        address: string;
        business_name: string;
        business_contact_no: string;
        business_whatsapp_no: string;
    }
}


const initialState: ProductListingState = {
    CarNameMaster: [],
    CarBrandMaster: [],
    CarTransmission: [],
    CarYearMaster: [],
    CarFueltypeMaster: [],
    CarColorMaster: [],
    CarOwnershipMaster: [],
    CityMaster: [],
    BikeTypeMaster: [],
    BikeBrandMaster: [],
    BikeNameMaster: [],
    BikeFueltypeMaster: [],
    BikeYearMaster: [],
    BikeColorMaster: [],
    BikeOwnershipMaster: [],
    YearofManufactureMaster: [],
    ConditionMaster: [],
    producttypeMaster: [],

    ProductListing: [],
    productdetails: null,
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddProductListingPayload {
    brand: string;

}


export interface UpdateProductListingPayload {
    _id?: string;
    sparesId?: string;
    mode?: 'remove' | 'append' | 'update_at_sequence';
    remove_image_ids?: string[];
    file?: File;
    sequence?: number;

    // form fields
    brand_id?: string;
    sapre_name?: string;
    description?: string;
    year_of_manufacture_id?: string;
    price?: string;
    condition_id?: string;
    product_type_id?: string;


}


export const fetchProductListing = createAsyncThunk(
    'ProductListing/fetchProductListing',
    async (
        {
            search = '',
            filters = {},
            page = 0,
            limit = 10,
            fromDate = '',
            toDate = '',
            type = '',
            exportType,
        }: {
            search?: string;
            filters?: Record<string, any>;
            page?: number;
            limit?: number;
            fromDate?: string;
            toDate?: string;
            type?: string;
            exportType?: 'csv' | 'pdf';
        },
        { rejectWithValue }
    ) => {
        try {
            let endpoint = '';

            if (type === 'car') {
                endpoint = 'product/carRoutes/get_cars_by_admin';
            } else if (type === 'bike') {
                endpoint = 'product/bikeRoute/get_bikes_by_admin';
            } else {
                endpoint = 'product/spareRoute/get_spares_by_admin';
            }
            // Handle export
            if (exportType) {
                const exportRes = await httpinstance.get(endpoint, {
                    params: {
                        search,
                        page: page + 1,
                        limit,
                        fromDate,
                        toDate,
                        exportType,
                        ...filters, // spread all filters as query params
                    },
                });

                const fileUrl = exportRes?.data?.data?.downloadUrls?.[exportType];
                if (fileUrl) {
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.target = '_blank';
                    link.setAttribute('download', `car-listing-export.${exportType}`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }

            // Fetch listing data

            try {
                let endpoint = '';

                if (type === 'car') {
                    endpoint = 'product/carRoutes/get_cars_by_admin';
                } else if (type === 'bike') {
                    endpoint = 'product/bikeRoute/get_bikes_by_admin';
                } else {
                    endpoint = 'product/spareRoute/get_spares_by_admin';
                }


                const response = await httpinstance.get(endpoint, {
                    params: {
                        page: page + 1,
                        search,
                        ...filters, // spread all filters as query params
                        limit: limit.toString(),
                        fromDate,
                        toDate,
                    },
                });


                // const response = await httpinstance.get('product/carRoutes/get_cars_by_admin', {
                //     params: {
                //         search,
                //         searchField,
                //         page: page + 1,
                //         limit,
                //         fromDate,
                //         toDate,
                //     },
                // });

                const rawproduct = response.data.data || [];

                if (type === 'sparepart') {
                    const spareMapped = rawproduct.map((product: any) => ({
                        _id: product._id,
                        sapreid: product.sapreid || 'N/A',
                        brandName: product.brand_name || 'N/A',
                        sapre_name: product.sapre_name || 'N/A',
                        productFor: product.product_type_name || 'N/A',
                        subproduct_type_name: product.subproduct_type_name || 'N/A',
                        modelName: product.model_name || 'N/A',
                        cityName: product.city_name || 'N/A',
                        condition: product.condition_name || 'N/A',
                        dealerName: product.user_id?.name || 'N/A',
                        yearOfManufacture: Number(product.year_of_manufacture) || 0,
                        priceRange: `₹${(product.price || 0).toLocaleString()}`,
                        isPublished: product.isPublished === true ? 'Yes' : 'No',
                        isSold: product.isSold === true ? 'Yes' : 'No',
                        isActive: product.isActive,
                        lisitngStatus: product.isActive ? 'Active' : 'Inactive',
                        // lisitngStatus: product.isActive === true ? 'Active' : 'Inactive',
                        totalViews: product.viewCount || 0,
                        leadCount: product.leadCount || 0,
                        listingDate: product.createdAt || 'N/A',
                        type: 'sparepart',
                        description: product.description || 'N/A',


                    }));


                    return {
                        data: spareMapped,
                        totalItems: response.data.pagination?.totalItems ?? spareMapped.length,
                        totalPages: response.data.pagination?.totalPages ?? 1,
                        currentPage: response.data.pagination?.currentPage ?? 1,
                    };
                }


                const mapped = rawproduct.map((product: any) => ({
                    _id: product._id,
                    listingTitle: `${product.car_name || product.bike_name || product.sparepart_name} || 'N/A'`,
                    productid: `${product.carid || product.bikeid}` || 'N/A',
                    dealerName: product.user_id?.name || 'N/A',
                    // isActive: product.isActive || 'N/A',
                    // lisitngStatus: product.isActive === true ? 'Active' : 'Inactive',
                    isActive: product.isActive,
                    lisitngStatus: product.isActive ? 'Active' : 'Inactive',
                    isPublished: product.isPublished === true ? 'Yes' : 'No',
                    isSold: product.isSold === true ? 'Yes' : 'No',
                    totalViews: product.viewCount || 0,
                    leadCount: product.leadCount || 0,
                    listingDate: product.createdAt || 'N/A',
                    ownership: product.ownership || 'N/A',
                    city_name: product.city_name || 'N/A',
                    color_name: product.color_name || 'N/A',
                    year: product.year || 'N/A',
                    type: type,
                    brandName: product.brand_name || 'N/A',
                    productName: product.car_name || product.bike_name || 'N/A', // fallback
                    model_name: product.model_name || 'N/A',
                    kilometersDriven: product.kilometers_driven || 'N/A',
                    numberOfOwners: product.ownership?.includes('1') ? 1 : 2,
                    transmissionType: product.transmission || 'Manual',
                    fuel_type: product.fuel_type || 'N/A',
                    priceRange: `₹${(product.price || 0).toLocaleString()}`,
                    listingdate: product.createdAt || 'N/A',
                }));

                return {
                    data: mapped,
                    totalItems: response.data.pagination?.totalItems ?? mapped.length,
                    totalPages: response.data.pagination?.totalPages ?? 1,
                    currentPage: response.data.pagination?.currentPage ?? 1,
                };

            } catch (error: any) {
                console.error('Car listing fetch/export error:', error.response?.data || error.message);
                return rejectWithValue(error.response?.data?.message || 'Failed to fetch car listings');
            }
        }
        catch (err: any) {
            console.error('Fetch error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch car listings');
        }
    }
);


// export const fetchProductListingbyId = createAsyncThunk(
//     'ProductListing/fetchProductListingbyId',
//     async (
//         { _id, search = '', page = 0, limit = 10 }: { _id: string; search?: string; page?: number; limit?: number },
//         { rejectWithValue }
//     ) => {
//         try {
//             const response = await httpinstance.get(
//                 `product/carRoutes/get_cars_by_admin/${_id}`
//             );
//             return response.data?.data?.car;
//         } catch (err: any) {
//             return rejectWithValue(err.response?.data || err.message);
//         }
//     }
// );


export const fetchProductListingbyId = createAsyncThunk(
    'ProductListing/fetchProductListingbyId',
    async (
        {
            _id,
            type,
        }: {
            _id: string;
            type: 'car' | 'bike' | 'sparepart';
        },
        { rejectWithValue }
    ) => {
        try {
            let endpoint = '';

            if (type === 'car') {
                endpoint = `product/carRoutes/get_cars_by_admin/${_id}`;
            } else if (type === 'bike') {
                endpoint = `product/bikeRoute/get_bikes_by_admin/${_id}`;
            } else if (type === 'sparepart') {
                endpoint = `product/spareRoute/get_spares_by_admin/${_id}`;
            } else {
                return rejectWithValue('Invalid type provided');
            }

            const response = await httpinstance.get(endpoint);

            return response.data?.data?.car || response.data?.data?.bike || response.data?.data?.spare;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


export const updateCarListing = createAsyncThunk<ProductListing, UpdateProductListingPayload>(
    'ProductListing/updateCarListing',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/carRoutes/update_car_by_Admin/${_id}`,

                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update car');
        }
    }
);


export const updateBikeListing = createAsyncThunk<ProductListing, UpdateProductListingPayload>(
    'ProductListing/updateCarListing',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/bikeRoute/update_bike_by_Admin/${_id}`,

                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update bike');
        }
    }
);

export const updateSparepartListing = createAsyncThunk<SparepartListing, UpdateProductListingPayload>(
    'ProductListing/updateSparepartListing',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/spareRoute/update_spares_by_admin/${_id}`,

                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update spare part');
        }
    }
);


export const updateCarImage = createAsyncThunk(
    'ProductListing/updateCarImage',
    async (
        {
            carId,
            file,
            mode,
            sequence,
            remove_image_ids
        }: {
            carId: string;
            file?: File;
            mode: 'append' | 'remove' | 'update_at_sequence';
            sequence?: number;
            remove_image_ids?: string[];
        },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();

            if (file) formData.append('new_images', file);
            formData.append('mode', mode);

            if (sequence !== undefined) formData.append('sequence', sequence.toString());
            if (remove_image_ids && remove_image_ids.length > 0) {
                remove_image_ids.forEach(id => formData.append('remove_image_ids', id));
            }


            const response = await httpinstance.patch(
                `product/carRoutes/update_car_images/${carId}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Image update failed');
        }
    }
);


export const updateBikeImage = createAsyncThunk(
    'ProductListing/updateBikeImage',
    async (
        {
            bikeId,
            file,
            mode,
            sequence,
            remove_image_ids
        }: {
            bikeId: string;
            file?: File;
            mode: 'append' | 'remove' | 'update_at_sequence';
            sequence?: number;
            remove_image_ids?: string[];
        },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();

            if (file) formData.append('new_images', file);
            formData.append('mode', mode);

            if (sequence !== undefined) formData.append('sequence', sequence.toString());
            if (remove_image_ids && remove_image_ids.length > 0) {
                remove_image_ids.forEach(id => formData.append('remove_image_ids', id));
            }

            const response = await httpinstance.patch(
                `product/bikeRoute/update_bike_images/${bikeId}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Image update failed');
        }
    }
);


export const updateSparepartImage = createAsyncThunk(
    'ProductListing/updateSparepartImage',
    async (
        {
            sparesId,
            file,
            mode,
            sequence,
            remove_image_ids
        }: {
            sparesId: string;
            file?: File;
            mode: 'append' | 'remove' | 'update_at_sequence';
            sequence?: number;
            remove_image_ids?: string[];
        },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();

            if (file) formData.append('new_images', file);
            formData.append('mode', mode);

            if (sequence !== undefined) formData.append('sequence', sequence.toString());
            if (remove_image_ids && remove_image_ids.length > 0) {
                remove_image_ids.forEach(id => formData.append('remove_image_ids', id));
            }

            const response = await httpinstance.patch(
                `product/spareRoute/update_spare_images/${sparesId}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Image update failed');
        }
    }
);


// export const deleteProductListing = createAsyncThunk(
//     'ProductListings/deleteProductListing',
//     async ({ _id, type }: { _id: string; type: 'car' | 'bike' | 'sparepart' }, { rejectWithValue }) => {
//         try {
//             const route = type === 'car' ? 'carRoutes/cars' : 'bikeRoute/bikes';
//             await httpinstance.put(`product/${route}/${_id}/isdelete`, { isDeleted: true });
//             return _id;
//         } catch (err: any) {
//             return rejectWithValue(err.response?.data?.message || `Failed to delete ${type} listing`);
//         }
//     }
// );


export const deleteProductListing = createAsyncThunk(
    'ProductListings/deleteProductListing',
    async (
        { _id, type }: { _id: string; type: 'car' | 'bike' | 'sparepart' },
        { rejectWithValue }
    ) => {
        try {
            let route = '';
            if (type === 'car') route = 'carRoutes/cars';
            else if (type === 'bike') route = 'bikeRoute/bikes';
            else if (type === 'sparepart') route = 'spareRoute/spares';

            await httpinstance.put(`product/${route}/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || `Failed to delete ${type} listing`
            );
        }
    }
);


// export const toggleProductListingStatus = createAsyncThunk(
//     'ProductListing/toggleStatus',
//     async (
//         { _id, isActive, type }: { _id: string; isActive: boolean; type: 'car' | 'bike' | 'sparepart' },
//         { rejectWithValue }
//     ) => {
//         try {
//             const route = type === 'car' ? 'carRoutes/cars' : 'bikeRoute/bikes';

//             const res = await httpinstance.put(
//                 `product/${route}/${_id}/isactive`,
//                 { isActive }
//             );

//             return res.data.data;
//         } catch (err: any) {
//             console.error('Toggle Status Error:', err.response?.data || err.message);
//             return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
//         }
//     }
// );


// export const toggleProductListingStatus = createAsyncThunk(
//     'ProductListing/toggleStatus',
//     async (
//         {
//             _id,
//             isActive,
//             type,
//         }: {
//             _id: string;
//             isActive: boolean;
//             type: 'car' | 'bike' | 'sparepart'
//         },
//         { rejectWithValue }
//     ) => {
//         try {
//             let route = '';
//             if (type === 'car') route = 'carRoutes/cars';
//             else if (type === 'bike') route = 'bikeRoute/bikes';
//             else if (type === 'sparepart') route = 'spareRoute/spares';

//             const res = await httpinstance.put(`product/${route}/${_id}/isactive`, {
//                 isActive,
//             });

//             return res.data.data.updatedSpare;
//         } catch (err: any) {
//             console.error('Toggle Status Error:', err.response?.data || err.message);
//             return rejectWithValue(
//                 err.response?.data?.message || 'Failed to toggle status'
//             );
//         }
//     }
// );






export const toggleProductListingStatus = createAsyncThunk(
    'ProductListing/toggleStatus',
    async (
        {
            _id,
            isActive,
            type,
        }: {
            _id: string;
            isActive: boolean;
            type: 'car' | 'bike' | 'sparepart';
        },
        { rejectWithValue }
    ) => {
        try {
            let route = '';
            if (type === 'car') route = 'carRoutes/cars';
            else if (type === 'bike') route = 'bikeRoute/bikes';
            else if (type === 'sparepart') route = 'spareRoute/spares';

            const res = await httpinstance.put(`product/${route}/${_id}/isactive`, { isActive });

            // handle type-specific response keys
            const updated =
                res.data?.data?.updatedCar ||
                res.data?.data?.updatedbike ||
                res.data?.data?.updatedSpare;

            return updated;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);


export const fetchCarBrandMaster = createAsyncThunk(
    'CarBrandMaster/fetchCarBrandMaster',
    async (
        { search = '', page = 0, limit = 100000 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/carbrandRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const fetchCarNameMaster = createAsyncThunk(
    'CarNameMaster/fetchCarNameMaster',
    async (
        { search = '', page = 0, limit = 100000 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/carnameRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const fetchCarTransmission = createAsyncThunk(
    'CarNameMaster/fetchCarTransmission',
    async (
        { search = '', page = 0, limit = 100000 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/cartransmission/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchCarYearMaster = createAsyncThunk(
    'CarYearMaster/fetchCarYearMaster',
    async (
        { search = '', page = 0, limit = 100000 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/caryearRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchCarFueltypeMaster = createAsyncThunk(
    'CarFueltypeMaster/fetchCarFueltypeMaster',
    async (
        { search = '', page = 0, limit = 100000 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/car_fueltypeRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const fetchCarColorMaster = createAsyncThunk(
    'CarColorMaster/fetchCarColorMaster',
    async (
        { search = '', page = 0, limit = 100000 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/colorRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchCarOwnershipMaster = createAsyncThunk(
    'CarOwnershipMaster/fetchCarOwnershipMaster',
    async (
        { search = '', page = 0, limit = 100000 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/car_ownershipRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)


export const fetchCityMaster = createAsyncThunk(
    'Citymaster/fetchCitymaster',
    async (
        { search = '', page = 0, limit = 100000 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`admin/cityRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const fetchBiketype = createAsyncThunk(
    'CarNameMaster/fetchBiketype',
    async (
        { search = '', page = 0, limit = 100000 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/bike_typeRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchBikeBrandMaster = createAsyncThunk(
    'BikeBrandMaster/fetchBikeBrandMaster',
    async (
        { search = '', page = 0, limit = 100000 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/bike_brandRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchBikeNameMaster = createAsyncThunk(
    'BikeNameMaster/fetchBikeNameMaster',
    async (
        { search = '', page = 0, limit = 100000 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/bike_nameRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchBikeFueltypeMaster = createAsyncThunk(
    'BikeFueltypeMaster/fetchBikeFueltypeMaster',
    async (
        { search = '', page = 0, limit = 100000 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/bike_fueltypeRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchBikeYearMaster = createAsyncThunk(
    'BikeYearMaster/fetchBikeYearMaster',
    async (
        { search = '', page = 0, limit = 100000 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/bikeyearRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchBikeColorMaster = createAsyncThunk(
    'BikeColorMaster/fetchBikeColorMaster',
    async (
        { search = '', page = 0, limit = 100000 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/bikecolorRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchBikeOwnershipMaster = createAsyncThunk(
    'BikeOwnershipMaster/fetchBikeOwnershipMaster',
    async (
        { search = '', page = 0, limit = 100000 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/bike_ownershipRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchYearofManufactureMaster = createAsyncThunk(
    'YearofManufactureMaster/fetchYearofManufactureMaster',
    async (
        { search = '', page = 0, limit = 100000 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/spareyear_of_manufactureRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchConditionMaster = createAsyncThunk(
    'ConditionMaster/fetchConditionMaster',
    async (
        { search = '', page = 0, limit = 100000 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/spareconditionRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchproducttypeMaster = createAsyncThunk(
    'producttypeMaster/fetchproducttypeMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/spareproducttypeRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const fetchsubproducttypeMaster = createAsyncThunk(
    'producttypeMaster/fetchsubproducttypeMaster',
    async (
        { search = '', page = 0, limit = 100000 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/subspareproducttypeRoute/getdata-by-buyer-dealer?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);




const ProductListingSlice = createSlice({
    name: 'ProductListings',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchProductListing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductListing.fulfilled, (state, action) => {
                state.loading = false;
                state.ProductListing = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchProductListing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchProductListingbyId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductListingbyId.fulfilled, (state, action) => {
                state.loading = false;
                state.productdetails = action.payload || null;
            })
            .addCase(fetchProductListingbyId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateCarListing.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCarListing.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.ProductListing.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.ProductListing[index] = action.payload;
                }
            })
            .addCase(updateCarListing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(toggleProductListingStatus.pending, (state, action) => {
                const { _id } = action.meta.arg;
                const index = state.ProductListing.findIndex(item => item._id === _id);
                if (index !== -1) {
                    // Optimistically flip
                    state.ProductListing[index].isActive = !state.ProductListing[index].isActive;
                }
            })
            .addCase(toggleProductListingStatus.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.ProductListing.findIndex(item => item._id === updated._id);
                if (index !== -1) {
                    // Replace with fresh API data
                    state.ProductListing[index] = { ...state.ProductListing[index], ...updated };
                }
            })
            .addCase(toggleProductListingStatus.rejected, (state, action) => {
                const { _id } = action.meta.arg;
                const index = state.ProductListing.findIndex(item => item._id === _id);
                if (index !== -1) {
                    // Rollback optimistic update if failed
                    state.ProductListing[index].isActive = !state.ProductListing[index].isActive;
                }
                state.error = action.payload as string;
            })








            .addCase(fetchCarBrandMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarBrandMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.CarBrandMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })

            .addCase(fetchCarBrandMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCarTransmission.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarTransmission.fulfilled, (state, action) => {
                state.loading = false;
                state.CarTransmission = action.payload.data.cartransmissions;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchCarTransmission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(fetchCarNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.CarNameMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchCarNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCarYearMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarYearMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.CarYearMaster = action.payload.data.years;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchCarYearMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCarFueltypeMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarFueltypeMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.CarFueltypeMaster = action.payload.data.fueltypes;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchCarFueltypeMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCarColorMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarColorMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.CarColorMaster = action.payload.data.colors;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchCarColorMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCarOwnershipMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarOwnershipMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.CarOwnershipMaster = action.payload.data.ownerships;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchCarOwnershipMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCityMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCityMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.CityMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchCityMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchBiketype.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBiketype.fulfilled, (state, action) => {
                state.loading = false;
                state.BikeTypeMaster = action.payload.data.bikeTypes;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchBiketype.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchBikeBrandMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBikeBrandMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.BikeBrandMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchBikeBrandMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchBikeNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBikeNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.BikeNameMaster = action.payload.data;
                state.BikeBrandMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchBikeNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchBikeFueltypeMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBikeFueltypeMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.BikeFueltypeMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchBikeFueltypeMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchBikeYearMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBikeYearMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.BikeYearMaster = action.payload.data.years;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchBikeYearMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchBikeColorMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBikeColorMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.BikeColorMaster = action.payload.data.colors;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchBikeColorMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchBikeOwnershipMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBikeOwnershipMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.BikeOwnershipMaster = action.payload.data.ownerships;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchBikeOwnershipMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchYearofManufactureMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchYearofManufactureMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.YearofManufactureMaster = action.payload.data.years;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchYearofManufactureMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchConditionMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConditionMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.ConditionMaster = action.payload.data.conditions;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchConditionMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchproducttypeMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchproducttypeMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.producttypeMaster = action.payload.data.products;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchproducttypeMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchsubproducttypeMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchsubproducttypeMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.producttypeMaster = action.payload.data.products;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchsubproducttypeMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default ProductListingSlice.reducer;