import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { MRT_ColumnDef } from 'material-react-table';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchdealerlistpersubscription } from '../../../store/SubscriptionManagement/SubscriptionManagementSlice';
import DataTable from '../../tables/DataTable';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Chip } from '@mui/material';
import { useParams } from 'react-router-dom';
import { httpinstance } from '../../../axios/api';

const DealerListBySubscription = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id: subscriptionId } = useParams<{ id: string }>();

    const [searchTerm, setSearchTerm] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [columnFilters, setColumnFilters] = useState<{ id: string; value: any }[]>([]);
    const [prevSearchField, setPrevSearchField] = useState('');



    const { dealerList = [], dealerTotalItems = 0 } = useSelector(
        (state: RootState) => state.Subscription
    );

    useEffect(() => {
        if (subscriptionId) {
            const filterParams: Record<string, any> = {};

            columnFilters.forEach(({ id, value }) => {
                if (!value) return;
                if (id === 'isActive') {
                    filterParams[id] = value === 'Active';
                } else if (typeof value === 'string' && value.trim()) {
                    filterParams[id] = value.trim();
                } else {
                    filterParams[id] = value;
                }
            });

            dispatch(
                fetchdealerlistpersubscription({
                    subscriptionId,
                    page: pageIndex,
                    limit: pageSize,
                    search: searchTerm,
                    fromDate,
                    toDate,
                    filters: filterParams, //  include filters here
                })
            );
        }
    }, [dispatch, subscriptionId, pageIndex, pageSize, searchTerm, fromDate, toDate, columnFilters]); //  added columnFilters



    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    const handleColumnFilterChange = (filters: { id: string; value: any }[]) => {
        setColumnFilters(filters);
        setPageIndex(0);

        const filterParams: Record<string, any> = {};

        filters.forEach(({ id, value }) => {
            if (!value) return;

            if (id === 'isActive') {
                filterParams[id] = value === 'Active' ? true : false;
            } else if (typeof value === 'string' && value.trim()) {
                filterParams[id] = value.trim();
            } else {
                filterParams[id] = value;
            }
        });

        const payload = {
            subscriptionId,
            filters: filterParams,
            fromDate,
            toDate,
            page: pageIndex,
            limit: pageSize,
        };

        //  Debounce logic
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            dispatch(fetchdealerlistpersubscription(payload));
        }, 500);
    };



    const clickHandler = async (searchText: string, exportType?: string) => {
        setSearchTerm(searchText);
        setPageIndex(0);

        if (exportType) {
            await dispatch(
                fetchdealerlistpersubscription({
                    subscriptionId,
                    fromDate,
                    toDate,
                    search: searchText,
                    exportType: exportType as 'csv' | 'pdf',
                })
            );
        }
    };





    useEffect(() => {
        // Skip if one date is filled and the other is not
        if ((fromDate && !toDate) || (!fromDate && toDate)) return;

        const payload = {
            fromDate: fromDate || undefined,
            toDate: toDate || undefined,
        };

        dispatch(fetchdealerlistpersubscription(payload));
    }, [fromDate, toDate]);




    const columns: MRT_ColumnDef<any>[] = [
        { accessorKey: 'dealer_id.name', header: 'Dealer Name', id: 'dealerName' },
        { accessorKey: 'dealer_id.email', header: 'Email', id: 'dealerEmail' },
        { accessorKey: 'dealer_id.phone', header: 'Phone', id: 'dealerPhone' },
        {
            accessorKey: 'listings_used',
            header: 'Listings Used',
            Cell: ({ cell }) => <Chip className='font-outfit' label={cell.getValue<number>()} color="secondary" />,
        },
        {
            accessorKey: 'start_date',
            header: 'Start Date',
            Cell: ({ cell }) => {
                const dateStr = cell.getValue() as string;
                return new Date(dateStr).toLocaleDateString('en-IN');
            },
        },

        {
            accessorKey: 'end_date',
            header: 'End Date',
            Cell: ({ cell }) => {
                const dateStr = cell.getValue() as string;
                return new Date(dateStr).toLocaleDateString('en-IN');
            },
        },
        {
            header: 'Status',
            accessorKey: 'isActive',
            Cell: ({ row }) => {
                const isActive = row.original.isActive;
                return (
                    <Chip
                        label={isActive ? 'Active' : 'Expired'}
                        color={isActive ? 'success' : 'error'}
                        size="small"
                        sx={{ fontWeight: 500, fontFamily: 'Outfit' }}
                    />
                );
            },
            filterVariant: 'select',
            filterSelectOptions: ['Active', 'Expired'],
        },

        {
            accessorKey: 'invoice_url',
            header: 'Invoice',
            Cell: ({ row }) => {
                const dealerSub = row.original;


                
                const generateAndOpenInvoice = async () => {
                    try {
                        const response = await httpinstance.post(
                            `/dealer/dealerSubscriptionRoute/generate-invoice/${dealerSub._id}`
                        );

                        const invoiceUrl = response.data?.data?.invoiceUrl;
                        if (invoiceUrl) {
                            window.open(invoiceUrl, '_blank'); // open PDF in a new tab
                        } else {
                            console.error('Invoice URL not found');
                        }
                    } catch (err) {
                        console.error('Error generating invoice', err);
                    }
                };

                return (
                    <PictureAsPdfIcon
                        color={dealerSub.isActive ? 'primary' : 'error'}
                        style={{ cursor: 'pointer' }}
                        onClick={generateAndOpenInvoice}
                    />
                );
            },
        },
    ];

    return (
        <Box className="p-4">
            <Typography className='font-outfit' fontWeight={500} variant="h5" mb={2}>
                Dealers Subscribed to This Plan
            </Typography>

            <DataTable
                exportType={true}
                clickHandler={clickHandler}
                data={dealerList}
                columns={columns}
                rowCount={dealerTotalItems}
                enableColumnFilters={true}
                columnFilters={columnFilters}
                onColumnFiltersChange={handleColumnFilterChange}
                pageIndex={pageIndex}
                pageSize={pageSize}
                fromDate={fromDate}
                toDate={toDate}
                onFromDateChange={setFromDate}
                onToDateChange={setToDate}
                onPaginationChange={({ pageIndex, pageSize }) => {
                    setPageIndex(pageIndex);
                    setPageSize(pageSize);
                    const filterParams: Record<string, any> = {};
                    columnFilters.forEach(({ id, value }) => {
                        if (!value) return;
                        filterParams[id] = id === 'isActive' ? value === 'Active' : value;
                    });
                    dispatch(fetchdealerlistpersubscription({
                        filters: filterParams,
                        fromDate,
                        toDate,
                        page: pageIndex,
                        limit: pageSize,
                    }));
                }}
            />
        </Box>
    );
};

export default DealerListBySubscription;
