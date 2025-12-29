import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { useMemo, useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Menu,
  IconButton,
  useMediaQuery,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import DateTimeField from '../form/input/DateTimeField';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type DataTableProps<T extends Record<string, any>> = {
  data: T[];
  columns: MRT_ColumnDef<T>[];
  clickHandler?: any;
  onSearchClick?: (searchText: string, resultCount: number) => void;
  onSearchMessage?: (message: string) => void;
  enableUserTypeFilter?: boolean;
  enableProducttypeFilter?: boolean;
  enableTicketTypeFilter?: boolean;
  enableDocumenttypeFilter?: boolean;
  onProducttypeChange?: (status: string) => void;
  onTickettypeChange?: (status: string) => void;
  onDocumenttypeChange?: (status: string) => void;
  enablefeedbacktypeFilter?: boolean;
  onUserTypeChange?: (status: string) => void;
  onFeedbacktypeChange?: (status: string) => void;
  pageIndex?: number;
  pageSize?: number;
  rowCount?: number;
  pageCount?: number;
  // isLoading?: boolean;
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  headerkey?: string
  fromDate?: string;
  toDate?: string;
  onFromDateChange?: (date: string) => void;
  onToDateChange?: (date: string) => void;
  onDateFilter?: () => void;
  exportType?: boolean;
  onColumnFiltersChange?: (filters: { id: string; value: any }[]) => void;
  columnFilters?: { id: string; value: any }[];
  enableColumnFilters?: boolean;
  customTopLeftContent?: React.ReactNode;
  productTypeValue?: string;
  ticketTypeValue?: string;
  documentTypeValue?: string;
  onFileUpload?: (rows: any[]) => void;



};



const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  clickHandler,
  onSearchClick,
  onSearchMessage,
  enableUserTypeFilter,
  enablefeedbacktypeFilter,
  enableProducttypeFilter,
  enableTicketTypeFilter,
  enableDocumenttypeFilter,
  onProducttypeChange,
  onTickettypeChange,
  onDocumenttypeChange,
  onUserTypeChange,
  onFeedbacktypeChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onDateFilter,
  rowCount,
  pageCount,
  pageIndex,
  pageSize,
  // isLoading,
  onPaginationChange,
  searchTerm,
  onSearchChange,
  headerkey,
  exportType = false,
  enableColumnFilters,
  columnFilters,
  onColumnFiltersChange,
  customTopLeftContent,
  productTypeValue,
  ticketTypeValue,
  documentTypeValue,
  onFileUpload,


}: DataTableProps<T>) => {


  const isMobile = useMediaQuery('(max-width:768px)');
  const [searchText, setSearchText] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [message, setMessage] = useState('');
  const [internalSearch, setInternalSearch] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 2000); // 2 second delay
    return () => clearTimeout(timer);
  }, []);




  const memoizedColumns = useMemo(() => {
    const serialNumberColumn: MRT_ColumnDef<T> = {
      accessorKey: 'srNo',
      header: 'Sr. No',
      Cell: ({ row }) => (
        <Box sx={{ pl: 2 }}>
          {(pageIndex ?? 0) * (pageSize ?? 10) + row.index + 1}
        </Box>
      ),
      size: 40,
      enableSorting: false,
    };

    if (!isMobile) return [serialNumberColumn, ...columns];

    return [
      serialNumberColumn,
      ...columns.filter(
        (col) =>
          !['registration_date', 'last_login_timestamp'].includes(
            col.accessorKey as string
          )
      ),
    ];
  }, [columns, isMobile, pageIndex, pageSize]); // 👈 include these here


  useEffect(() => {
    setInternalSearch(searchTerm ?? '');
  }, [searchTerm]);



  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (val: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChange?.(val);
      clickHandler?.(val);
    }, 500);
  };



  const renderSkeletonRows = () => {
    const skeletonRowCount = pageSize ?? 10;
    const columnCount = memoizedColumns.length;

    return (
      <Box sx={{ width: '100%', paddingX: 2 }}>
        {/* Header Skeleton */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            paddingY: 1,
            borderBottom: '1px solid #f2f4f7',
          }}
        >
          {Array.from({ length: columnCount }).map((_, idx) => (
            <Box key={idx} sx={{ flex: 1 }}>
              <Skeleton height={25} width="80%" />
            </Box>
          ))}
        </Box>

        {/* Row Skeletons */}
        {Array.from({ length: skeletonRowCount }).map((_, rowIdx) => (
          <Box
            key={rowIdx}
            sx={{
              display: 'flex',
              gap: 2,
              paddingY: 1.5,
              alignItems: 'center',
              borderBottom: '1px solid #f2f4f7',
            }}
          >
            {Array.from({ length: columnCount }).map((_, colIdx) => (
              <Box key={colIdx} sx={{ flex: 1 }}>
                <Skeleton height={20} />
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    );
  };


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      onFileUpload?.(jsonData);
    };

    reader.readAsBinaryString(file);
  };






  const handleDownloadExcel = () => {
    clickHandler?.(internalSearch, 'csv'); // 1 = Excel
  };

  const handleDownloadPDF = () => {
    clickHandler?.(internalSearch, 'pdf'); // 2 = PDF
  };




  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const table = useMaterialReactTable({
    columns: memoizedColumns,
    data,
    manualPagination: true,
    // manualFiltering: true,
    rowCount,
    enableRowSelection: false,
    enableColumnResizing: false,
    enableDensityToggle: false,
    enableColumnFilters: enableColumnFilters ?? false,
    manualFiltering: enableColumnFilters ?? false,
    onColumnFiltersChange: onColumnFiltersChange
      ? (updaterOrValue) => {
        // updaterOrValue can be an array or a function
        const value =
          typeof updaterOrValue === 'function'
            ? updaterOrValue(columnFilters ?? [])
            : updaterOrValue;
        onColumnFiltersChange(value);
      }
      : undefined,

    columnResizeMode: 'onChange',
    layoutMode: 'semantic',
    enableFullScreenToggle: false,
    initialState: {
      density: 'compact',
      pagination: {
        pageIndex: pageIndex ?? 0,
        pageSize: pageSize ?? 10,
      },
      globalFilter: searchTerm ?? '',
    },
    state: {
      columnFilters: columnFilters ?? [],
      // isLoading,
      pagination: { pageIndex: pageIndex ?? 0, pageSize: pageSize ?? 10 },
      globalFilter: searchTerm ?? '',
    },
    onPaginationChange: onPaginationChange
      ? (updaterOrValue) => {
        const value =
          typeof updaterOrValue === 'function'
            ? updaterOrValue({
              pageIndex: pageIndex ?? 0,
              pageSize: pageSize ?? 10,
            })
            : updaterOrValue;
        onPaginationChange(value);
      }
      : undefined,

    onGlobalFilterChange: onSearchChange,
    // ...

    // muiSearchTextFieldProps: {
    //   value: internalSearch,
    //   onChange: (e) => {
    //     const val = e.target.value;
    //     setInternalSearch(val);
    //     if (val === '') {
    //       onSearchChange?.('');
    //       clickHandler?.('');
    //     }
    //   },
    //   InputProps: {
    //     startAdornment: null,
    //     endAdornment: (
    //       <InputAdornment position="end">
    //         {internalSearch && (
    //           <IconButton
    //             onClick={() => {
    //               setInternalSearch('');
    //               onSearchChange?.('');
    //               clickHandler?.('');
    //             }}
    //             size="small"
    //           >
    //             <CloseIcon fontSize="small" />
    //           </IconButton>
    //         )}
    //         <IconButton
    //           onClick={() => {
    //             onSearchChange?.(internalSearch);
    //             clickHandler?.(internalSearch);
    //           }}
    //           size="small"
    //         >
    //           <SearchIcon />
    //         </IconButton>
    //       </InputAdornment>

    //     ),
    //   },

    // },

    muiSearchTextFieldProps: {
      value: internalSearch,
      onChange: (e) => {
        const val = e.target.value;
        setInternalSearch(val);

        if (val === '') {
          onSearchChange?.('');
          clickHandler?.('');
        } else {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => {
            onSearchChange?.(val);
            clickHandler?.(val);
          }, 500); // 300ms debounce
        }
      },
      InputProps: {
        startAdornment: null,
        endAdornment: (
          <InputAdornment position="end">
            {internalSearch && (
              <IconButton
                onClick={() => {
                  setInternalSearch('');
                  onSearchChange?.('');
                  clickHandler?.('');
                }}
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              onClick={() => {
                onSearchChange?.(internalSearch);
                clickHandler?.(internalSearch);
              }}
              size="small"
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      },
    },


    muiTopToolbarProps: {
      sx: {
        '& .MuiTextField-root': {
          width: '180px !important',
          minWidth: 'unset',
        },
      },
    },

    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '16px',
        border: '1px solid #f2f4f7',
        backgroundColor: '#ffffff',
        boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
        fontFamily: 'Outfit',
      },
    },

    muiTableContainerProps: {
      sx: {
        overflowX: 'auto',
        maxWidth: '100%',
        fontFamily: 'Outfit',
        '&::-webkit-scrollbar': {
          height: '10px',
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          cursor: 'pointer', // Add cursor pointer
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: darker on hover
            cursor: 'pointer', // Ensure pointer on hover too
          },
        },
      },
    },

    muiTableHeadCellProps: {
      sx: {
        fontWeight: 600,
        fontFamily: 'Outfit',
        fontSize: '0.875rem',
        color: '#667085',
        backgroundColor: '#f9fafb',
        borderBottom: '1px solid #f2f4f7',
      },
    },

    muiTableBodyCellProps: {
      sx: {
        fontSize: '0.875rem',
        color: '#344054',
        fontFamily: 'Outfit',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },

    muiTableFooterCellProps: {
      sx: {
        fontSize: '0.875rem',
        fontFamily: 'Outfit',
      },
    },

    muiTableBodyRowProps: {
      sx: {
        borderBottom: '1px solid #f2f4f7',
        '&:hover': {
          backgroundColor: '#f9fafb',
          fontFamily: 'Outfit',
        },
      },
    },

    muiTableProps: {
      sx: {
        tableLayout: 'auto',
        width: '100%',
        fontFamily: 'Outfit',
      },
    },

    renderBottomToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '8px 16px',
          fontFamily: 'Outfit',
          fontSize: '16px',
          color: '#667085',
        }}
      >

        {(() => {
          const safePageIndex = pageIndex ?? 0;
          const safePageSize = pageSize ?? 10;
          return (
            <>
              {/* Showing {(safePageIndex * safePageSize) + 1}–
          {Math.min((safePageIndex + 1) * safePageSize, rowCount ?? 0)} of {rowCount}  */}
              {/* | */}
              Page {safePageIndex + 1} of {pageCount ?? Math.ceil((rowCount ?? 0) / safePageSize)}
            </>
          );
        })()}
      </Box>
    ),

    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 2,
          p: 0,
          mt: -1
        }}
      >
        {customTopLeftContent && (
          <Box
            sx={{
              minWidth: 160, mt: 1
            }}
          >
            {customTopLeftContent}
          </Box>
        )}

        {enableUserTypeFilter && (
          <FormControl size="small" sx={{ minWidth: 160, mt: 1 }} >
            <InputLabel className="font-outfit">User Type</InputLabel>
            <Select
              className='font-outfit'
              label="User Type"
              defaultValue="admin"
              value={productTypeValue || 'admin'} //  make it controlled
              onChange={(e) => onUserTypeChange?.(e.target.value)}
            >
              <MenuItem className='font-outfit'
                value="admin">Admin</MenuItem>
              <MenuItem className='font-outfit'
                value="webuser">Webuser</MenuItem>

            </Select>
          </FormControl>
        )}

        {enablefeedbacktypeFilter && (
          <FormControl size="small" sx={{ minWidth: 160, mt: 1 }}>
            <InputLabel className="font-outfit">Type</InputLabel>
            <Select
              className='font-outfit'
              label="Feedback type"
              defaultValue="admin"
              value={productTypeValue || 'admin'} //  make it controlled
              onChange={(e) => onFeedbacktypeChange?.(e.target.value)}
            >
              <MenuItem className='font-outfit'
                value="admin">Admin</MenuItem>
              <MenuItem className='font-outfit'
                value="webuser">Webuser</MenuItem>


            </Select>
          </FormControl>
        )}

        {enableProducttypeFilter && (
          // <FormControl size="small" sx={{ minWidth: 160, mt: 1 }}>
          //   <InputLabel className="font-outfit">Type</InputLabel>
          //   <Select
          //     className="font-outfit"
          //     label="Feedback type"
          //     value={productTypeValue || 'car'} //  make it controlled
          //     onChange={(e) => onProducttypeChange?.(e.target.value)}
          //   >
          //     <MenuItem className="font-outfit" value="car">
          //       Car
          //     </MenuItem>
          //     <MenuItem className="font-outfit" value="bike">
          //       Bike
          //     </MenuItem>
          //     <MenuItem className="font-outfit" value="sparepart">
          //       Spare Parts & Accessories
          //     </MenuItem>
          //   </Select>
          // </FormControl>

          <FormControl size="small" sx={{ minWidth: 160, mt: 1 }}>
            <InputLabel className="font-outfit">Visitor Type</InputLabel>
            <Select
              className="font-outfit"
              label="Visitor Type"
              value={productTypeValue || 'all'}
              onChange={(e) => onProducttypeChange?.(e.target.value)}
            >
              <MenuItem className="font-outfit" value="all">All</MenuItem>
              <MenuItem className="font-outfit" value="Guest">Guest</MenuItem>
              <MenuItem className="font-outfit" value="Delivery">Delivery</MenuItem>
              <MenuItem className="font-outfit" value="Vendor">Vendor</MenuItem>
            </Select>
          </FormControl>

        )}


        {/* {enableTicketTypeFilter && (
          <FormControl size="small" sx={{ minWidth: 160, mt: 1 }}>
            <InputLabel className="font-outfit">Support-Ticket Type</InputLabel>
            <Select
              className="font-outfit"
              label="Support-Ticket Type"
              value={ticketTypeValue || 'all'}
              onChange={(e) => onTickettypeChange?.(e.target.value)}
            >
              <MenuItem className="font-outfit" value="all">All</MenuItem>
              <MenuItem className="font-outfit" value="Resident">Resident</MenuItem>
              <MenuItem className="font-outfit" value="Treasurer">Treasurer</MenuItem>
              <MenuItem className="font-outfit" value="Security">Secuirty</MenuItem>
            </Select>
          </FormControl>

        )} */}

        {enableTicketTypeFilter && (
          <FormControl size="small" sx={{ minWidth: 160, mt: 1 }} >
            <InputLabel className="font-outfit">User Type</InputLabel>
            <Select
              className='font-outfit'
              label="User Type"
              defaultValue="all"
              value={ticketTypeValue || 'All'} //  make it controlled
              onChange={(e) => onTickettypeChange?.(e.target.value)}
            >
              <MenuItem className='font-outfit'
                value="all">All</MenuItem>
              <MenuItem className='font-outfit'
                value="resident">Resident</MenuItem>
              <MenuItem className='font-outfit'
                value="treasurer">Treasurer</MenuItem>
              <MenuItem className='font-outfit'
                value="security">Security</MenuItem>

            </Select>
          </FormControl>
        )}

        {enableTicketTypeFilter && (
          <FormControl size="small" sx={{ minWidth: 160, mt: 1 }}>
            <InputLabel className="font-outfit">Type</InputLabel>
            <Select
              className='font-outfit'
              label="Ticket type"
              defaultValue="all"
              value={ticketTypeValue || 'all'} //  make it controlled
              onChange={(e) => onTickettypeChange?.(e.target.value)}
            >
              <MenuItem className='font-outfit'
                value="all">All</MenuItem>
              <MenuItem className='font-outfit'
                value="resident">Resident</MenuItem>
              <MenuItem className='font-outfit'
                value="treasurer">Treasurer</MenuItem>
              <MenuItem className='font-outfit'
                value="security">Security</MenuItem>


            </Select>
          </FormControl>
        )}


        {enableDocumenttypeFilter && (

          <FormControl size="small" sx={{ minWidth: 160, mt: 1 }}>
            <InputLabel className="font-outfit">Document Type</InputLabel>
            <Select
              className="font-outfit"
              label="Document Type"
              value={documentTypeValue || 'all'}
              onChange={(e) => onDocumenttypeChange?.(e.target.value)}
            >
              <MenuItem className="font-outfit" value="all">All</MenuItem>
              <MenuItem className="font-outfit" value="Bylaws">Bylaws</MenuItem>
              <MenuItem className="font-outfit" value="Circulars">Circulars</MenuItem>
              <MenuItem className="font-outfit" value="Certificates">Certificates</MenuItem>
              <MenuItem className="font-outfit" value="Agreements">Agreements</MenuItem>
            </Select>
          </FormControl>

        )}









        {/* {onFromDateChange && onToDateChange && (
          <>
            <DateTimeField
              label="From"
              name="fromDate"
              type="date"
              value={fromDate ?? ''}
              onChange={(e) => onFromDateChange(e.target.value)}
              maxDate={toDate}
            />

            <DateTimeField
              label="To"
              name="toDate"
              type="date"
              value={toDate ?? ''}
              onChange={(e) => onToDateChange(e.target.value)}
              maxDate={dayjs().format("YYYY-MM-DD")}
              minDate={fromDate}
            />
            {fromDate && toDate && dayjs(fromDate).isAfter(dayjs(toDate)) && (
              <span className="text-red-500 text-xs">From date cannot be after To date</span>
            )}
            <Button
              variant="contained"
              size="small"
              onClick={onDateFilter}
              sx={{ height: '30px', fontFamily: "outfit", borderRadius: '25px', }}
            >
              Apply
            </Button>
          </>
        )} */}


        {
          onFromDateChange && onToDateChange && (
            <>
              <Tooltip title="Date Filter" arrow>
                <IconButton
                  onClick={() => setShowDateFilter((prev) => !prev)}
                  size="small" style={{ marginBottom: '-10px' }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    fill="gray"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-1.99.9-1.99 2L3 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V8h14v13z" />
                  </svg>
                </IconButton>
              </Tooltip>



              {showDateFilter && (
                <>
                  <DateTimeField
                    label="From"
                    name="fromDate"
                    type="date"
                    value={fromDate ?? ''}
                    onChange={(e) => onFromDateChange?.(e.target.value)}
                    maxDate={toDate}
                  />
                  <DateTimeField
                    label="To"
                    name="toDate"
                    type="date"
                    value={toDate ?? ''}
                    onChange={(e) => onToDateChange?.(e.target.value)}
                    maxDate={dayjs().format("YYYY-MM-DD")}
                    minDate={fromDate}
                  />
                  {fromDate && toDate && dayjs(fromDate).isAfter(dayjs(toDate)) && (
                    <span className="text-red-500 text-xs">From date cannot be after To date</span>
                  )}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* <Button
                      variant="contained"
                      size="small"
                      onClick={onDateFilter}
                      sx={{
                        height: '30px',
                        fontFamily: 'Outfit',
                        borderRadius: '25px',
                      }}
                    >
                      Apply
                    </Button> */}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        onFromDateChange?.('');
                        onToDateChange?.('');
                        onDateFilter?.(); // Re-fetch without date filters
                      }}
                      sx={{
                        height: '30px',
                        fontFamily: 'Outfit',
                        borderRadius: '25px',
                      }}
                    >
                      Clear
                    </Button>
                  </Box>

                </>
              )}
            </>
          )
        }

        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />

          <Tooltip title="Upload Excel">
            <IconButton
              size="small"
              onClick={() => fileInputRef.current?.click()}
              sx={{
                height: 40,
                width: 40,
                alignItems: 'center',
              }}
            >
              <FileUploadIcon
                sx={{

                  color: 'gray',

                  fontSize: '28px',
                  marginBottom: '-8px',
                }}
              />
            </IconButton>
          </Tooltip>
        </>

        {
          exportType &&
          <>
            {/* <Button
              variant="outlined"
              size="small"
              onClick={handleClick}
              startIcon={<FileDownloadIcon style={{ color: 'gray' }} />}
              sx={{
                height: '40px',
                textTransform: 'none',
                borderColor: 'divider',
              }}
            /> */}

            <Button
              variant="text" // No border
              size="small"
              onClick={handleClick}
              startIcon={
                <FileDownloadIcon
                  style={{
                    color: 'gray',
                    fontSize: '28px',
                    marginBottom: '-8px', // Push icon down slightly
                  }}
                />
              }
              sx={{
                height: '40px',
                textTransform: 'none',
                padding: '8px 12px',
                minWidth: 0,
                alignItems: 'flex-end', // Align content to bottom
              }}
            />


            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem className='font-outfit'
                onClick={() => {
                  handleDownloadExcel();
                  handleClose();
                }}
              >
                Excel
              </MenuItem>
              <MenuItem className='font-outfit'
                onClick={() => {
                  handleDownloadPDF();
                  handleClose();
                }}
              >
                PDF
              </MenuItem>
            </Menu>
          </>
        }
      </Box>
    ),
  });

  return (
    <Box sx={{ width: '100%', overflowX: 'auto', padding: 1 }}>
      {showSkeleton ? (
        renderSkeletonRows()
      ) : (
        <MaterialReactTable table={table} />
      )}
      {message && (
        <Box mt={1} color={message.includes('No') ? 'error.main' : 'success.main'}>
          {message}
        </Box>
      )}
    </Box>
  );

};

export default DataTable;