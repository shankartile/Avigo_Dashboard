import React from 'react';
import { Box, Typography } from '@mui/material';
import { MRT_ColumnDef } from 'material-react-table';
import DataTable from '../../tables/DataTable';
import { DealerManagementType } from './DealerManagement';
import { useState, useEffect } from 'react';
import { RootState, AppDispatch } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeads, fetchSubscriptionbydealer } from '../../../store/AppUserManagement/DealerManagementSlice';

type Props = {
    dealer: DealerManagementType;
};

const DealerLeadsTab: React.FC<Props> = ({ dealer }) => {

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const dispatch = useDispatch<AppDispatch>();



    const { dealerLeads, totalItems } = useSelector((state: RootState) => state.DealerManagement);

    const leads = dealerLeads; // coming from Redux


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (dealer?._id) {
                dispatch(fetchLeads({ userId: dealer._id, page: pageIndex, limit: pageSize, search: searchTerm, }));
            }
        }, 500); // 500ms delay

        return () => clearTimeout(delayDebounce);
    }, [dealer?._id, pageIndex, pageSize, searchTerm]);




    const clickHandler = async (searchText: string) => {

        const currentPage = 0;
        const currentLimit = 10;

        setSearchTerm(searchText);
        setPageIndex(currentPage);

        if (dealer?._id) {
            // First, export the file
            await dispatch(
                fetchLeads({
                    search: searchText,
                    userId: dealer._id,
                })
            );

            // Then, refetch table data (important: use updated search and page)
            dispatch(
                fetchLeads({
                    search: searchText,
                    page: currentPage,
                    limit: currentLimit,
                    userId: dealer._id,
                })
            );
        }
    };


    // Table columns
    const columns: MRT_ColumnDef<any>[] = [
        {
            accessorKey: 'buyerName',
            header: 'Buyer Name',
        },
        // {
        //     accessorKey: 'email',
        //     header: 'Email',
        // },
        {
            accessorKey: 'phone',
            header: 'Contact no',
        },
        {
            accessorFn: (row) => `${row.brandName} - ${row.modelName}`,
            id: 'listingTitle',
            header: 'Product Title',
            Cell: ({ cell }) => <span>{cell.getValue<string>()}</span>,
        },
        {
            accessorKey: 'interactionType',
            header: 'Interatcion Type',
        },
        {
            accessorKey: 'date',
            header: 'Date of Inquiry',
        },

    ];

    return (
        <Box className="mt-10 w-full max-w-8xl">
            <Typography variant="subtitle1" className="font-outfit" sx={{ fontWeight: 600 }}>
                Total Leads: {leads.length}
            </Typography>

            <DataTable
                clickHandler={clickHandler}
                data={leads}
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

export default DealerLeadsTab;
