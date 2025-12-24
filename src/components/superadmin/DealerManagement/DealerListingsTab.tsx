import React from 'react';
import { useMemo } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Chip, Tooltip } from '@mui/material';
import { MRT_ColumnDef } from 'material-react-table';
import DataTable from '../../tables/DataTable';
import { DealerManagementType } from './DealerManagement';
import { useState, useEffect } from 'react';
import { RootState, AppDispatch } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCarListingbydealer, fetchBikeListingbydealer, fetchSparepartListingbydealer } from '../../../store/AppUserManagement/DealerManagementSlice';
import { fetchProductListingbyId } from '../../../store/ProductListing/ProductListingSlice';


type Props = {
    dealer: DealerManagementType;
};

type ListingStatus = 'Active' | 'Inactive';
type ProductType = 'car' | 'bike' | 'sparepart';

interface CommonListingFields {
    id: string;
    listingTitle: string;
    dealerName: string;
    listingStatus: ListingStatus;
    totalViews: number;
    isActive: boolean;
    leadsGenerated: number;
    listingDate: string;
    type: ProductType;
}

interface CarProductListing extends CommonListingFields {
    _id: string;
    type: 'car';
    brandName: string;
    carName: string;
    kilometersDriven: number;
    numberOfOwners: number;
    transmissionType: 'Manual' | 'Automatic';
    fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric';
    priceRange: string;
}

interface BikeListing extends CommonListingFields {
    _id: string;
    type: 'bike';
    brandName: string;
    bikeName: string;
    kilometersDriven: number;
    numberOfOwners: number;
    fuelType: 'Petrol' | 'Diesel' | 'Electric';
    priceRange: string;
}

interface SparePartListing extends CommonListingFields {
    _id: string;
    type: 'sparepart';
    productFor: 'Car' | 'Bike';
    condition: 'New' | 'Pre-Used';
    brandName: string;
    modelName: string;
    description: string;
    yearOfManufacture: number;
    priceRange: string;
}


type ProductListing = CarProductListing | BikeListing | SparePartListing;



type ProductListingType = {
    id: string;
    brand_name: string;
    car_name: string;
    // category_name?: string;
    city_name: string;
    color_name: string;
    fuel_type: string;
    kilometers_driven: string,
    images: [];
    model_name: string;
    ownership?: string;
    price?: string;
    transmission?: string;
    year?: string;
    user_id?: {
        name: string;
        email: string;
    };
    isActive?: boolean;
};


const DealerListingsTab: React.FC<Props> = ({ dealer }) => {
    const [filtertype, setFiltertype] = useState<ProductType>('car');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [columnFilters, setColumnFilters] = useState<{ id: string; value: any }[]>([]);
    const [prevSearchField, setPrevSearchField] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { dealerListings, totalItems } = useSelector((state: RootState) => state.DealerManagement);


    const { carId } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (filtertype === 'car') {
                dispatch(fetchCarListingbydealer({
                    search: searchTerm,
                    type: 'car',
                    page: pageIndex,
                    limit: pageSize,
                    userId: dealer._id,
                }));
            } else if (filtertype === 'bike') {
                dispatch(fetchBikeListingbydealer({
                    search: searchTerm,
                    type: 'bike',
                    page: pageIndex,
                    limit: pageSize,
                    userId: dealer._id,
                }));
            } else if (filtertype === 'sparepart') {
                dispatch(fetchSparepartListingbydealer({
                    search: searchTerm,
                    type: 'sparepart',
                    page: pageIndex,
                    limit: pageSize,
                    userId: dealer._id,
                }));
            }
        }, 500); // 500ms debounce delay

        return () => clearTimeout(delayDebounce);
    }, [dispatch, filtertype, pageIndex, pageSize, searchTerm, dealer._id]);




    useEffect(() => {
        if (carId) {
            dispatch(fetchProductListingbyId({ _id: carId, type: filtertype }));
        }
    }, [carId, dispatch]);



    // const handleView = (product: ProductListing) => {
    //     if (!product._id || !product.type) {
    //         console.error('Missing product ID or type:', product);
    //         return;
    //     }
    //     navigate(`/staff/car-details/${product._id}?type=${product.type}`);
    // };


    const handleView = (product: ProductListing) => {
        const activeRole = sessionStorage.getItem("activeRole");
        const basePath = activeRole === "staff" ? "staff" : "superadmin";

        navigate(`/${basePath}/car-details/${product._id}?type=${product.type}`);
    };

    const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
        const titleColumn: MRT_ColumnDef<any> = {
            accessorKey:
                filtertype === 'car'
                    ? 'car_name'
                    : filtertype === 'bike'
                        ? 'bike_name'
                        : 'brand_name', // sparepart fallback
            header: 'Product Title',
            id: 'listingTitle', // <- explicitly give `id` to prevent reorder issues
        };




        return [
            titleColumn,
            {
                accessorKey: 'viewCount',
                header: 'Views Per Listing',
                id: 'viewCount',
                Cell: ({ cell }) => (
                    <Box display="flex" justifyContent="start">
                        <Chip
                            className="font-outfit"
                            label={cell.getValue<number>()}
                            color="primary"
                            size="medium"
                            sx={{ fontWeight: 500 }}
                        />
                    </Box>
                ),
            },
            {
                accessorKey: 'leadCount',
                header: 'Leads Per Listing',
                id: 'leadCount',
                Cell: ({ cell }) => (
                    <Box display="flex" justifyContent="start">
                        <Chip
                            className="font-outfit"
                            label={cell.getValue<number>()}
                            color="warning"
                            size="medium"
                            sx={{ fontWeight: 500 }}
                        />
                    </Box>
                ),
            },
            {
                accessorKey: 'createdAt',
                header: 'Posted Date',
                id: 'createdAt',
                Cell: ({ cell }) =>
                    new Date(cell.getValue<string>()).toLocaleDateString('en-IN'),
            },

            {
                id: 'actions',
                header: 'Actions',
                Cell: ({ row }) => (
                    <Tooltip title='View details'>
                        <Box display="flex" gap={1}>
                            <IconButton color="primary" onClick={() => handleView(row.original)}>
                                <VisibilityIcon />
                            </IconButton>
                        </Box>
                    </Tooltip>
                ),
            },
        ];
    }, [filtertype]);



    const clickHandler = async (searchText: string) => {
        const currentPage = 0;
        const currentLimit = 10;

        setSearchTerm(searchText);
        setPageIndex(currentPage);

        if (!dealer?._id) return;

        const baseParams = {
            search: searchText,
            page: currentPage,
            limit: currentLimit,
            userId: dealer._id,
        };

        try {
            if (filtertype === 'car') {
                await dispatch(fetchCarListingbydealer({ ...baseParams, type: 'car' }));
            } else if (filtertype === 'bike') {
                await dispatch(fetchBikeListingbydealer({ ...baseParams, type: 'bike' }));
            } else if (filtertype === 'sparepart') {
                await dispatch(fetchSparepartListingbydealer({ ...baseParams, type: 'sparepart' }));
            }
        } catch (err) {
            console.error(`Error fetching ${filtertype} listings:`, err);
        }
    };






    return (
        <Box className="mt-10 w-full max-w-8xl">
            <Typography className="font-outfit" sx={{ fontWeight: 600 }}>
                Total Listings: {dealerListings.length}
            </Typography>
            <DataTable
                clickHandler={clickHandler}
                data={dealerListings}
                enableProducttypeFilter={true}
                productTypeValue={filtertype}
                onProducttypeChange={(type: string) => {
                    setFiltertype(type as ProductType);
                    setPageIndex(0);

                    if (type === 'car') {
                        dispatch(fetchCarListingbydealer({
                            search: searchTerm,
                            type: 'car',
                            page: pageIndex,
                            limit: pageSize,
                            userId: dealer._id,
                        }));
                    } else if (type === 'bike') {
                        dispatch(fetchBikeListingbydealer({
                            search: searchTerm,
                            type: 'bike',
                            page: pageIndex,
                            limit: pageSize,
                            userId: dealer._id,
                        }));
                    } else if (type === 'sparepart') {
                        dispatch(fetchSparepartListingbydealer({
                            search: searchTerm,
                            type: 'sparepart',
                            page: pageIndex,
                            limit: pageSize,
                            userId: dealer._id,
                        }));
                    }
                }}
                columns={columns}
                pageIndex={pageIndex}
                pageSize={pageSize}
                rowCount={totalItems}
                onPaginationChange={({ pageIndex, pageSize }) => {
                    setPageIndex(pageIndex);
                    setPageSize(pageSize);
                }}
            />
        </Box>
    );
};
export default DealerListingsTab;
