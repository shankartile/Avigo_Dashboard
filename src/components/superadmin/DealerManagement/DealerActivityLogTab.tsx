import React from 'react';
import { Box } from '@mui/material';
import { DealerManagementType } from './DealerManagement';
import { MRT_ColumnDef } from 'material-react-table';
import DataTable from '../../tables/DataTable';
import { useState, useEffect } from 'react';
import { RootState, AppDispatch } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivitybydealer } from '../../../store/AppUserManagement/DealerManagementSlice';

type Props = {
  dealer: DealerManagementType;
};

const DealerActivityLogTab: React.FC<Props> = ({ dealer }) => {

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch<AppDispatch>();
  const { dealerActivity, totalItems } = useSelector((state: RootState) => state.DealerManagement);

  const activitylog = dealerActivity; // coming from Redux


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (dealer?._id) {
        dispatch(fetchActivitybydealer({ userId: dealer._id, page: pageIndex, limit: pageSize, search: searchTerm, }));
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounce);
  }, [dealer?._id, pageIndex, pageSize, searchTerm]);



  const clickHandler = async (searchText: string, exportType?: string) => {

    const currentPage = 0;
    const currentLimit = 10;

    setSearchTerm(searchText);
    setPageIndex(currentPage);

    if (exportType && dealer?._id) {
      // First, export the file
      await dispatch(
        fetchActivitybydealer({
          search: searchText,
          exportType: exportType as 'csv' | 'pdf',
          userId: dealer._id,
        })
      );

      // Then, refetch table data (important: use updated search and page)
      dispatch(
        fetchActivitybydealer({
          search: searchText,
          page: currentPage,
          limit: currentLimit,
          userId: dealer._id,
        })
      );
    }
  };








  const columns: MRT_ColumnDef<any>[] = [
    {
      accessorFn: (row) =>
        row.activity_type
          ? row.activity_type
            .toLowerCase()
            .split('_')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
          : '',
      id: 'activity_type',
      header: 'Activity',
    },
    { accessorKey: 'product_type', header: 'Category' },
    { accessorKey: 'title', header: 'Details' },
  ];

  return (
    <Box className="mt-10 w-full max-w-8xl">
      <DataTable
        clickHandler={clickHandler}
        exportType={true}
        data={activitylog}
        columns={columns}
        pageIndex={pageIndex}
        pageSize={pageSize}
        rowCount={totalItems}
        onPaginationChange={({ pageIndex, pageSize }) => {
          setPageIndex(pageIndex);
          setPageSize(pageSize);
          dispatch(fetchActivitybydealer({
            userId: dealer._id,
            search: searchTerm,
            page: pageIndex,
            limit: pageSize,
          }));
        }}


      />
    </Box>
  );
};

export default DealerActivityLogTab;
