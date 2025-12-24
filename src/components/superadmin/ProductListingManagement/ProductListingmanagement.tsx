import {
    Box, Typography, IconButton, Dialog, DialogContent, DialogTitle,
    Rating, Tooltip, Select, MenuItem, FormControl, InputLabel, Chip,
} from '@mui/material';
import React, { useMemo, useRef } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import ToggleSwitch from '../../ui/toggleswitch/ToggleSwitch';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import DataTable from '../../tables/DataTable';
import SweetAlert from '../../ui/alert/SweetAlert';
import Alert from '../../ui/alert/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchProductListing, fetchProductListingbyId, updateCarListing, toggleProductListingStatus, deleteProductListing, productdetails } from '../../../store/ProductListing/ProductListingSlice';

import CarUpdateForm from './CarUpdateForm';
import BikeUpdateForm from './BikeUpdateForm';
import SparepartUpdateForm from './SparepartUpdateForm';
import CarDetailCard from './CarDetails';





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
    sapre_name: string;
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
    description?: string;
    transmission?: string;
    year?: string;
    user_id?: {
        name: string;
        email: string;
    };
    isActive?: boolean;
};

const ProductManagement = () => {

    const [newProduct, setNewProduct] = useState<ProductListingType>({
        id: '',
        brand_name: '',
        car_name: '',
        city_name: '',
        color_name: '',
        fuel_type: '',
        kilometers_driven: '',
        images: [],
        price: '',
        description: '',
        model_name: '',
        ownership: '',
        transmission: '',
        year: '',
        user_id: {
            name: '',
            email: '',
        },
    });

    interface ToggleUserType {
        _id: string;
        isActive: boolean;
        type: ProductType;
    }
    const [selectedProduct, setSelectedProduct] = useState<ProductListing | null>(null);
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [filtertype, setFiltertype] = useState<ProductType>('car');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [columnFilters, setColumnFilters] = useState<{ id: string; value: any }[]>([]);
    const [prevSearchField, setPrevSearchField] = useState('');
    const [toggleUser, setToggleUser] = useState<ToggleUserType | null>(null);
    const [showToggleModal, setShowToggleModal] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [deleteItem, setDeleteItem] = useState<ProductListing | null>(null);
    const [isInitialised, setIsInitialised] = useState(false);
    const { carId } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { ProductListing: ProductListingData, totalItems, loading } = useSelector((state: RootState) => state.ProductLisiting);
    const { productdetails: productdetails } = useSelector((state: RootState) => state.ProductLisiting);
    const navigate = useNavigate();


    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        const typeFromURL = searchParams.get('type');
        if (
            (typeFromURL === 'car' || typeFromURL === 'bike' || typeFromURL === 'sparepart') &&
            typeFromURL !== filtertype
        ) {
            setFiltertype(typeFromURL);
        }
        setIsInitialised(true); //  Allow main fetch after URL param is applied
    }, []);


    useEffect(() => {
        if (carId) {
            dispatch(fetchProductListingbyId({ _id: carId, type: filtertype }));
        }

    }, [carId, dispatch]);




    // Initial fetch of product listings
    useEffect(() => {
        if (!isInitialised) return;

        const delayDebounce = setTimeout(() => {
            const filterParams: Record<string, any> = {};

            columnFilters.forEach(({ id, value }) => {
                if (!value) return;

                if (['isActive', 'isPublished', 'isSold'].includes(id)) {
                    filterParams[id] = value === 'Active' || value === 'Yes';
                } else if (id === 'transmission' || id === 'condition') {
                    filterParams[id] = value;
                } else if (typeof value === 'string' && value.trim()) {
                    filterParams[id] = value.trim();
                } else {
                    filterParams[id] = value;
                }
            });

            // Map productName → car_name / bike_name
            if (filterParams.productName) {
                if (filtertype === 'car') filterParams.car_name = filterParams.productName;
                else if (filtertype === 'bike') filterParams.bike_name = filterParams.productName;
                delete filterParams.productName;
            }

            // Map productid → carid / bikeid
            if (filterParams.productid) {
                if (filtertype === 'car') filterParams.carid = filterParams.productid;
                else if (filtertype === 'bike') filterParams.bikeid = filterParams.productid;
                delete filterParams.productid;
            }

            dispatch(fetchProductListing({
                type: filtertype,
                fromDate,
                toDate,
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
                filters: filterParams, //  include filters
            }));
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, pageIndex, pageSize, filtertype, prevSearchField, isInitialised, fromDate, toDate, columnFilters]); //  added columnFilters


    // Function to handle column filter changes
    // const handleColumnFilterChange = (filters: { id: string; value: any }[]) => {
    //     // Extract the first non-empty filter
    //     const activeFilter = filters.find(f => f.value?.trim?.() !== '');

    //     // Extract values safely
    //     const search = activeFilter?.value?.trim() || '';
    //     const searchField = activeFilter?.id || '';

    //     if (search === searchTerm && searchField === prevSearchField) return;

    //     // Update states
    //     setColumnFilters(filters);
    //     setSearchTerm(search);
    //     setPrevSearchField(searchField);
    //     setPageIndex(0);

    //     // Dispatch API with updated filters
    //     const delayDebounce = setTimeout(() => {
    //         dispatch(fetchProductListing({
    //             fromDate,
    //             toDate,
    //             search,
    //             searchField,
    //             page: 0,
    //             type: filtertype,
    //             limit: pageSize,
    //         }));
    //     }, 500); // 500ms delay

    //     return () => clearTimeout(delayDebounce);
    // };



    const debounceTimer = useRef<NodeJS.Timeout | null>(null);


    const handleColumnFilterChange = (filters: { id: string; value: any }[]) => {
        setColumnFilters(filters);
        setPageIndex(0);

        const filterParams: Record<string, any> = {};

        filters.forEach(({ id, value }) => {
            if (!value) return;

            if (['isActive', 'isPublished', 'isSold'].includes(id)) {
                filterParams[id] = value === 'Active' || value === 'Yes';
            } else if (id === 'transmission' || id === 'condition') { //  fixed condition check
                filterParams[id] = value;
            } else if (typeof value === 'string' && value.trim()) {
                filterParams[id] = value.trim();
            } else {
                filterParams[id] = value;
            }
        });

        // Map productName → car_name / bike_name
        if (filterParams.productName) {
            if (filtertype === 'car') {
                filterParams.car_name = filterParams.productName;
            } else if (filtertype === 'bike') {
                filterParams.bike_name = filterParams.productName;
            }
            delete filterParams.productName;
        }

        // Map productid → carid / bikeid
        if (filterParams.productid) {
            if (filtertype === 'car') {
                filterParams.carid = filterParams.productid;
            } else if (filtertype === 'bike') {
                filterParams.bikeid = filterParams.productid;
            }
            delete filterParams.productid;
        }

        const payload = {
            type: filtertype,
            filters: filterParams,
            fromDate,
            toDate,
            page: 0,
            limit: pageSize,
        };

        // Debounce API call
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            dispatch(fetchProductListing(payload));
        }, 500);
    };



    const handleView = (product: ProductListing) => {
        const activeRole = sessionStorage.getItem("activeRole");
        const basePath = activeRole === "staff" ? "staff" : "superadmin";

        navigate(`/${basePath}/car-details/${product._id}?type=${product.type}`);
    };


    const handleCloseModal = () => {
        setSelectedProduct(null);
    };


    // Function to request deletion of a listing
    const requestDelete = (item: ProductListing) => {
        setDeleteItem(item); // save full object with _id and type
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteItem) return;
        try {
            await dispatch(deleteProductListing({ _id: deleteItem._id, type: deleteItem.type })).unwrap();
            setAlertType('error');
            setAlertMessage('Listing deleted successfully.');
            setShowAlert(true);
            dispatch(fetchProductListing({ search: searchTerm, page: pageIndex, limit: pageSize, type: filtertype }));
        } catch (err) {
            setAlertType('error');
            setAlertMessage('Delete failed: ' + err);
            setShowAlert(true);
        }
        setTimeout(() => setShowAlert(false), 3000);
        setShowModal(false);
        setDeleteItem(null);
    };

    const cancelDelete = () => {
        setShowModal(false);
        setDeleteItem(null);
    };


    const handleToggleClick = (user: ProductListing) => {
        setToggleUser(user);
        setShowToggleModal(true);
    };


    const confirmToggle = async () => {
        if (!toggleUser) return;

        if (toggleUser.type !== 'car' && toggleUser.type !== 'bike' && toggleUser.type !== 'sparepart') {
            console.warn('Toggle not supported for type:', toggleUser.type);
            return;
        }

        try {
            await dispatch(toggleProductListingStatus({
                _id: toggleUser._id,
                isActive: !toggleUser.isActive,
                type: toggleUser.type
            })).unwrap();

            setAlertType('success');
            setAlertMessage(`Listing ${toggleUser.isActive ? 'deactivated' : 'activated'} successfully.`);
            setShowAlert(true);

            dispatch(fetchProductListing({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
                type: filtertype,
            }));
        } catch (err) {
            setAlertType('error');
            setAlertMessage('Status toggle failed: ' + err);
            setShowAlert(true);
        }

        setTimeout(() => setShowAlert(false), 3000);
        setShowToggleModal(false);
        setToggleUser(null);
    };

    const cancelToggle = () => {
        setShowToggleModal(false);
        setToggleUser(null);
    };

    // Function to handle search and export
    const clickHandler = async (searchText: string, exportType?: string) => {
        setSearchTerm(searchText);
        setPageIndex(0);

        if (exportType) {
            await dispatch(fetchProductListing({
                fromDate,
                toDate,
                type: filtertype,
                search: searchText,
                exportType: exportType as 'csv' | 'pdf',
            }));
            // } else {
            //     await dispatch(fetchProductListing({
            //         fromDate,
            //         toDate,
            //         type: filtertype,
            //         search: searchText,
            //         page: 0,
            //         limit: pageSize,
            //     }));
            // }
        }
    };


    const handleEditProduct = async (product: ProductListing) => {
        try {
            const data = await dispatch(fetchProductListingbyId({ _id: product._id, type: product.type })).unwrap();
            // console.log("Fetched product details:", data);

            const mappedData = {
                _id: data._id,
                type: product.type, //  necessary for condition
                user_id: data.user_id?._id || data.user_id,
                brand_id: data.brand_id,
                fuel_type_id: data.fuel_type_id,
                year_id: data.year_id,
                color_id: data.color_id,
                ownership_id: data.ownership_id,
                city_id: data.city_id,
                model_name: data.model_name,
                kilometers_driven: data.kilometers_driven,
                price: data.price,
                ...(product.type === 'car' && {
                    car_id: data.car_id,
                    transmission_id: data.transmission_id,
                    car_images: data.images || [],
                }),
                ...(product.type === 'bike' && {
                    bike_id: data.bike_id,
                    bike_type_id: data.bike_type_id,
                    bike_images: data.images || [],
                }),
                ...(product.type === 'sparepart' && {
                    brand_id: data.brand_id,
                    // car_id : data.model_id,
                    city_id: data.city_id,
                    sapre_name: data.sapre_name,
                    description: data.description,
                    year_of_manufacture_id: data.year_of_manufacture_id,
                    price: data.price,
                    condition_id: data.condition_id,
                    product_type_id: data.product_type_id,
                    subproduct_type_id: data.subproduct_type_id,
                    spares_images: data.images || [],

                    ...(data.product_type_name === 'Car' && { car_id: data.model_id }),
                    ...(data.product_type_name === 'Bike' && { bike_id: data.model_id }),
                }),

            };

            setEditData(mappedData);
            setShowForm(true);
        } catch (error) {
            console.error('Failed to fetch product details:', error);
        }
    };




    useEffect(() => {
        // Skip if one date is filled and the other is not
        if ((fromDate && !toDate) || (!fromDate && toDate)) return;

        const payload = {
            fromDate: fromDate || undefined,
            toDate: toDate || undefined,
            type: filtertype
            // ...other filters like pagination or search
        };

        dispatch(fetchProductListing(payload));
    }, [fromDate, toDate]);


    const columns: MRT_ColumnDef<any>[] = useMemo(() => [
        {
            accessorKey: 'productid', header: 'Product ID', filterVariant: 'text', muiTableHeadCellProps: { align: 'center' },
            muiTableBodyCellProps: { align: 'center' },
        },

        {
            accessorKey: 'brandName', id: 'brand_name', header: 'Car/Bike Brand', filterVariant: 'text', muiTableHeadCellProps: { align: 'center' },
            muiTableBodyCellProps: { align: 'center' },
        },
        {
            accessorKey: 'productName',
            header: 'Car/Bike Name',
            filterVariant: 'text',
            muiTableHeadCellProps: { align: 'center' },
            muiTableBodyCellProps: { align: 'center' },
        },
        {
            accessorKey: 'model_name', id: 'model_name', header: 'Model Name', filterVariant: 'text', muiTableHeadCellProps: { align: 'center' },
            muiTableBodyCellProps: { align: 'center' },
        },

        { accessorKey: 'year', id: 'year', header: 'Year', filterVariant: 'text' },
        { accessorKey: 'fuel_type', id: 'fuel_type', header: 'Fuel type', filterVariant: 'text' },
        { accessorKey: 'kilometersDriven', id: 'kilometers_driven', header: 'Kilometers driven', filterVariant: 'text' },
        {
            accessorKey: 'transmissionType',
            id: 'transmission',
            header: 'Transmission type',
            filterVariant: 'select',
            filterSelectOptions: ['Automatic', 'Manual'],
        },
        {
            accessorKey: 'ownership',
            header: 'Ownership Type',
            Cell: ({ cell }) => {
                const value = cell.getValue() as string;
                return value || '-';
            },
            filterVariant: 'select',
            filterSelectOptions: ['1st Owner', '2nd Owner', '3rd Owner', 'above 3rd Owner'],
        },
        { accessorKey: 'city_name', id: 'city_name', header: 'City', filterVariant: 'text' },
        { accessorKey: 'color_name', id: 'color_name', header: 'Color', filterVariant: 'text' },
        {
            accessorKey: 'isPublished',
            header: 'Published',
            Cell: ({ cell }) => cell.getValue<string>(),
            filterVariant: 'select',
            filterSelectOptions: ['Yes', 'No'],
        },
        {
            accessorKey: 'isSold',
            header: 'Sold',
            Cell: ({ cell }) => cell.getValue<string>(),
            filterVariant: 'select',
            filterSelectOptions: ['Yes', 'No'],
        },

        { accessorKey: 'dealerName', id: 'user_id.name', header: 'Dealer Name', filterVariant: 'text' },
        {
            accessorKey: 'totalViews',
            header: 'Views',
            filterVariant: 'text',
            Cell: ({ cell }) => (
                <Box display="flex" justifyContent="start">
                    <Chip
                        className='font-outfit'
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
            header: 'Leads',
            filterVariant: 'text',
            Cell: ({ cell }) => (
                <Box display="flex" justifyContent="start">
                    <Chip
                        className='font-outfit'
                        label={cell.getValue<number>()}
                        color="warning"
                        size="medium"
                        sx={{ fontWeight: 500 }}
                    />

                </Box>
            ),
        },
        {
            accessorKey: 'listingDate',
            header: 'Listing Date',
            Cell: ({ row }) => new Date(row.original.listingDate).toLocaleDateString('en-IN'),
        },
        {
            accessorKey: 'lisitngStatus',
            header: 'Listing Status',
            Cell: ({ cell }) => cell.getValue<string>(),
            filterVariant: 'select',
            filterSelectOptions: ['Active', 'Inactive'],
        },
        {

            header: 'Actions',
            Cell: ({ row }) => {

                return (
                    <Box display="flex" gap={1}>
                        <Tooltip title="View Details">
                            <IconButton color="primary" onClick={() => handleView(row.original)}>
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                            <IconButton color="secondary" onClick={() => handleEditProduct(row.original)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <IconButton color="error" onClick={() => requestDelete(row.original)}>
                            <DeleteIcon />
                        </IconButton>
                        <ToggleSwitch
                            checked={row.original.isActive}
                            onChange={() => handleToggleClick(row.original)}
                            tooltipTitle={row.original.isActive ? 'Deactivate' : 'Activate'}
                            disabled={row?.original?.isPublished == "No"}
                        />
                    </Box>
                )
            },
        },
    ], [filtertype]);



    const sparePartColumns = useMemo<MRT_ColumnDef<any>[]>(() => {
        const baseColumns: MRT_ColumnDef<any>[] = [
            {
                accessorKey: 'sapreid', header: 'Product ID', filterVariant: 'text', muiTableHeadCellProps: { align: 'center' },
                muiTableBodyCellProps: { align: 'center' },
            },

            {
                accessorKey: 'sapre_name', header: 'Spare Part Name', muiTableHeadCellProps: { align: 'center' },
                muiTableBodyCellProps: { align: 'center' },
            },
            {
                accessorKey: 'productFor', header: 'Product type', id: 'product_type_name', muiTableHeadCellProps: { align: 'center' },
                muiTableBodyCellProps: { align: 'center' },
            },
            {
                accessorKey: 'subproduct_type_name', header: 'Sub-Product type', id: 'subproduct_type_name', muiTableHeadCellProps: { align: 'center' },
                muiTableBodyCellProps: { align: 'center' },
            },
            {
                accessorKey: 'condition', header: 'Condition', id: 'condition_name', filterVariant: 'select',
                filterSelectOptions: ['New', 'Pre-Used'], muiTableHeadCellProps: { align: 'center' },
                muiTableBodyCellProps: { align: 'center' },
            },
            {
                accessorKey: 'brandName', header: 'Brand', id: 'brand_name', muiTableHeadCellProps: { align: 'center' },
                muiTableBodyCellProps: { align: 'center' },
            },
            { accessorKey: 'modelName', header: 'Model', id: 'model_name' },
            { accessorKey: 'yearOfManufacture', header: 'Year of Manufacture', id: 'year_of_manufacture' },

            // { accessorKey: 'modelName', header: 'Model', id: 'modelName' },
            { accessorKey: 'dealerName', header: 'Dealer Name', id: 'user_id.name' },
            { accessorKey: 'cityName', header: 'City', id: 'city_name' },

            // { accessorKey: 'priceRange', header: 'Price', id: 'price' },

            {
                accessorKey: 'totalViews',
                header: 'Views',
                filterVariant: 'text',
                Cell: ({ cell }) => (
                    <Box display="flex" justifyContent="start">
                        <Chip
                            className='font-outfit'
                            label={cell.getValue<number>()}
                            color="primary"
                            size="medium"
                            sx={{ fontWeight: 500 }}
                        />
                    </Box>
                ),
            },

            {
                accessorKey: 'leadCount', header: 'Leads', filterVariant: 'text',
                Cell: ({ cell }) => (
                    <Box display="flex" justifyContent="start">
                        <Chip
                            className='font-outfit'
                            label={cell.getValue<number>()}
                            color="warning"
                            size="medium"
                            sx={{ fontWeight: 500 }}
                        />
                    </Box>
                ),
            },
            {
                accessorKey: 'isPublished',
                header: 'Published',
                Cell: ({ cell }) => cell.getValue<string>(),
                filterVariant: 'select',
                filterSelectOptions: ['Yes', 'No'],
            },
            {
                accessorKey: 'isSold',
                header: 'Sold',
                Cell: ({ cell }) => cell.getValue<string>(),
                filterVariant: 'select',
                filterSelectOptions: ['Yes', 'No'],
            },
            {
                accessorKey: 'listingDate',
                header: 'Listing Date',
                id: 'createdAt',
                Cell: ({ row }) =>
                    new Date(row.original.listingDate).toLocaleDateString('en-IN'),
            },
        ];

        const actionsColumn: MRT_ColumnDef<any> = {
            header: 'Actions',
            id: 'actions',
            Cell: ({ row }) => (
                <Box display="flex" gap={1}>
                    <Tooltip title="View Details">
                        <IconButton color="primary" onClick={() => handleView(row.original)}>
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <IconButton color="secondary" onClick={() => handleEditProduct(row.original)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <IconButton color="error" onClick={() => requestDelete(row.original)}>
                        <DeleteIcon />
                    </IconButton>
                    <ToggleSwitch
                        checked={row.original.isActive}
                        onChange={() => handleToggleClick(row.original)}
                        tooltipTitle={row.original.isActive ? 'Deactivate' : 'Activate'}
                        disabled={row?.original?.isPublished == "No"}
                    />
                </Box>
            ),
        };

        return [...baseColumns, actionsColumn];
    }, [filtertype]);





    return (
        <>
            {showForm && editData && (
                <>
                    {editData.type === 'car' && (
                        <CarUpdateForm
                            isEditMode={true}
                            editData={editData}
                            onCancel={() => {
                                setShowForm(false);
                                setEditData(null);
                            }}
                        />
                    )}
                    {editData.type === 'bike' && (
                        <BikeUpdateForm
                            isEditMode={true}
                            editData={editData}
                            onCancel={() => {
                                setShowForm(false);
                                setEditData(null);
                            }}
                        />
                    )}
                    {editData.type === 'sparepart' && (
                        <SparepartUpdateForm
                            isEditMode={true}
                            editData={editData}
                            onCancel={() => {
                                setShowForm(false);
                                setEditData(null);
                            }}
                        />
                    )}
                </>
            )}


            <SweetAlert
                show={showModal}
                type="error"
                title="Confirm Deletion"
                message="Are you sure you want to delete this listing?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                confirmText="Yes"
                cancelText="No"
            />

            <SweetAlert
                show={showToggleModal}
                type="warning"
                title="Confirm Status Change"
                message={`Are you sure you want to ${toggleUser?.isActive ? 'deactivate' : 'activate'} this listing?`}
                onConfirm={confirmToggle}
                onCancel={cancelToggle}
                confirmText="Yes"
                cancelText="No"
            />

            {showAlert && (
                <Alert
                    type={alertType}
                    title={
                        alertType === 'success'
                            ? 'Success!'
                            : alertType === 'error' && alertMessage.toLowerCase().includes('deleted')
                                ? 'Deleted!'
                                : alertType === 'error'
                                    ? 'Error!'
                                    : 'Warning!'
                    }
                    message={alertMessage}
                    variant="filled"
                    showLink={false}
                    linkHref=""
                    linkText=""
                    onClose={() => setShowAlert(false)}
                />
            )}

            {!showForm && (
                <>
                    <Box ml={2}>
                        <Typography className="font-outfit" variant="h5" fontWeight={500} mb={2}>
                            Product Listing Management  <Tooltip
                                title="Manage car, bike, and spare part listings, view detailed information, and edit product details or images if incorrect information is submitted by the dealer."
                                arrow
                                slotProps={{
                                    popper: {
                                        sx: {
                                            '& .MuiTooltip-tooltip': {
                                                fontSize: '0.9rem',
                                                backgroundColor: '#245492',
                                                color: '#fff',
                                                fontFamily: 'Outfit',
                                                padding: '8px 12px',
                                            },
                                            '& .MuiTooltip-arrow': {
                                                color: '#245492',
                                            },
                                        },
                                    },
                                }}
                            >
                                <InfoIcon
                                    fontSize="medium"
                                    sx={{ color: '#245492', cursor: 'pointer' }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </Tooltip>
                        </Typography>
                    </Box>


                    {filtertype === 'sparepart' ? (
                        <DataTable
                            key={filtertype}
                            exportType={true}
                            clickHandler={clickHandler}
                            data={ProductListingData}
                            columns={sparePartColumns}
                            enableColumnFilters={true}
                            columnFilters={columnFilters}
                            onColumnFiltersChange={handleColumnFilterChange}
                            rowCount={totalItems}
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                            onPaginationChange={({ pageIndex, pageSize }) => {
                                setPageIndex(pageIndex);
                                setPageSize(pageSize);
                                const filterParams: Record<string, any> = {};
                                columnFilters.forEach(({ id, value }) => {
                                    if (!value) return;
                                    filterParams[id] = id === 'isActive' ? value === 'Active' : value;
                                });
                                dispatch(fetchProductListing({
                                    filters: filterParams,
                                    type: filtertype,
                                    fromDate,
                                    toDate,
                                    page: pageIndex,
                                    limit: pageSize,
                                }));
                            }}
                            enableProducttypeFilter={true}
                            productTypeValue={filtertype}
                            onProducttypeChange={(type: string) => {
                                // Update filtertype state
                                setFiltertype(type as ProductType);
                                setPageIndex(0);

                                // Push new filterType into URL (adds to browser history)
                                searchParams.set('type', type);
                                setSearchParams(searchParams); // This pushes to history

                                // Optionally, trigger data fetch (can rely on useEffect too)
                                dispatch(fetchProductListing({
                                    fromDate,
                                    toDate,
                                    search: searchTerm,
                                    type: filtertype,
                                    page: 0,
                                    limit: pageSize,
                                }));
                            }}

                            fromDate={fromDate}
                            toDate={toDate}
                            onFromDateChange={setFromDate}
                            onToDateChange={setToDate}
                        // onDateFilter={() => {
                        //     dispatch(fetchProductListing({
                        //         fromDate,
                        //         toDate,
                        //         search: searchTerm,
                        //         page: 0,
                        //         limit: pageSize,
                        //         type: filtertype,
                        //     }));
                        //     setPageIndex(0);
                        // }}

                        />
                    ) : (
                        <DataTable
                            exportType={true}
                            clickHandler={clickHandler}
                            data={ProductListingData}
                            columns={columns}
                            enableColumnFilters={true}
                            columnFilters={columnFilters}
                            onColumnFiltersChange={handleColumnFilterChange}
                            rowCount={totalItems}
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                            onPaginationChange={({ pageIndex, pageSize }) => {
                                setPageIndex(pageIndex);
                                setPageSize(pageSize);
                                const filterParams: Record<string, any> = {};
                                columnFilters.forEach(({ id, value }) => {
                                    if (!value) return;
                                    filterParams[id] = id === 'isActive' ? value === 'Active' : value;
                                });
                                dispatch(fetchProductListing({
                                    filters: filterParams,
                                    fromDate,
                                    type: filtertype,
                                    toDate,
                                    page: pageIndex,
                                    limit: pageSize,
                                }));
                            }}
                            enableProducttypeFilter={true}
                            productTypeValue={filtertype}
                            onProducttypeChange={(type: string) => {
                                // Update filtertype state
                                setFiltertype(type as ProductType);
                                setPageIndex(0);

                                // Push new filterType into URL (adds to browser history)
                                searchParams.set('type', type);
                                setSearchParams(searchParams); // This pushes to history


                                dispatch(fetchProductListing({
                                    fromDate,
                                    toDate,
                                    search: searchTerm,
                                    type: filtertype,
                                    page: 0,
                                    limit: pageSize,
                                }));
                            }}

                            fromDate={fromDate}
                            toDate={toDate}
                            onFromDateChange={setFromDate}
                            onToDateChange={setToDate}
                        />
                    )}

                </>
            )}
        </>
    );
};

export default ProductManagement;