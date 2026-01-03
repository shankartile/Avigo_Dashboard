// import React, { useEffect, useRef, useState } from "react";
// import {
//   Box,
//   Typography,
//   IconButton,
//   Tooltip,
//   Chip,
// } from "@mui/material";

// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import GroupIcon from "@mui/icons-material/Group";
// import InfoIcon from "@mui/icons-material/Info";
// import AddIcon from "@mui/icons-material/Add";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import { MRT_ColumnDef } from "material-react-table";
// import { useDispatch, useSelector } from "react-redux";

// import DataTable from "../../tables/DataTable";
// import SweetAlert from "../../ui/alert/SweetAlert";
// import Button from "../../ui/button/Button";
// import ToggleSwitch from '../../ui/toggleswitch/ToggleSwitch';
// import { RootState, AppDispatch } from "../../../store/store";
// import {
//   fetchSocieties,
//   deleteSociety,
//   togglesocietyStatus,
// } from "../../../store/SocietyManagement/SocietyManagementSlice";

// import AddEditSocietyDialog from "./AddEditSocietyDialog";
// import AssignSocietyAdminDialog from "./AssignSocietyAdminDialog";
// import AddResidentUser from "./AddResidentUser";

// /* =========================
//    EMPTY FORM DATA
// ========================= */
// const emptySociety = {
//   societyName: "",
//   state: "",
//   city: "",
//   address: "",
//   totalWings: "",
//   floorsPerWing: "",
//   flatsPerFloor: "",
// };

// const dummySocieties = [
//   {
//     _id: "1",
//     societyName: "Green Valley Society",
//     state: "Maharashtra",
//     city: "Pune",
//     detailAddress: "Baner Road, Pune",
//     totalWings: 4,
//     floorsPerWing: 10,
//     flatsPerFloor: 4,
//     isActive: true,
//   },
//   {
//     _id: "2",
//     societyName: "Sunshine Apartments",
//     state: "Karnataka",
//     city: "Bengaluru",
//     detailAddress: "Whitefield",
//     totalWings: 3,
//     floorsPerWing: 8,
//     flatsPerFloor: 6,
//     isActive: false,
//   },
//   {
//     _id: "3",
//     societyName: "Royal Residency",
//     state: "Gujarat",
//     city: "Ahmedabad",
//     detailAddress: "SG Highway",
//     totalWings: 5,
//     floorsPerWing: 12,
//     flatsPerFloor: 3,
//     isActive: true,
//   },
// ];

// const SocietyOnboarding = () => {
//   // const dispatch = useDispatch<AppDispatch>();
//   // const { societies, totalItems } = useSelector(
//   //   (state: RootState) => state.society
//   // );

//   /*  STATES */
//   const [pageIndex, setPageIndex] = useState(0);
//   const [pageSize, setPageSize] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [columnFilters, setColumnFilters] = useState<
//     { id: string; value: any }[]
//   >([]);

//   //  SAME AS STAFF
//   const [showForm, setShowForm] = useState(false);
//   const [editIndex, setEditIndex] = useState<number | null>(null);
//   const [newSociety, setNewSociety] = useState<any>(emptySociety);

//   const [openAdminDialog, setOpenAdminDialog] = useState(false);
//   const [selectedSociety, setSelectedSociety] = useState<any>(null);

//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [deleteId, setDeleteId] = useState<string | null>(null);

//   const societies = dummySocieties;
//   const totalItems = dummySocieties.length;

//   const [showAddResident, setShowAddResident] = useState(false);


//   const [showAssignAdminForm, setShowAssignAdminForm] = useState(false);
//   const [isViewMode, setIsViewMode] = useState(false);
//   const [toggleUser, setToggleUser] = useState<{ _id: string; isActive: boolean } | null>(null);
//   const [showToggleModal, setShowToggleModal] = useState(false);
//   const dispatch = useDispatch<AppDispatch>();
//   const [alertMessage, setAlertMessage] = useState('');
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
//   const debounceRef = useRef<NodeJS.Timeout | null>(null);

//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');


//   /* FETCH SOCIETIES*/

//   // useEffect(() => {
//   //   const filters: Record<string, any> = {};

//   //   columnFilters.forEach(({ id, value }) => {
//   //     if (!value) return;
//   //     filters[id] = id === "isActive" ? value === "Active" : value;
//   //   });

//   //   if (debounceRef.current) clearTimeout(debounceRef.current);

//   //   debounceRef.current = setTimeout(() => {
//   //     dispatch(
//   //       fetchSocieties({
//   //         search: searchTerm,
//   //         filters,
//   //         page: pageIndex,
//   //         limit: pageSize,
//   //       })
//   //     );
//   //   }, 500);

//   //   return () => {
//   //     if (debounceRef.current) clearTimeout(debounceRef.current);
//   //   };
//   // }, [searchTerm, pageIndex, pageSize, columnFilters, dispatch]);

//   const handleColumnFilterChange = (
//     filters: { id: string; value: any }[]
//   ) => {
//     setColumnFilters(filters);
//     setPageIndex(0);

//     const filterParams: Record<string, any> = {};

//     filters.forEach(({ id, value }) => {
//       if (!value) return;

//       if (id === "isActive") {
//         filterParams[id] = value === "Active";
//       } else if (typeof value === "string" && value.trim()) {
//         filterParams[id] = value.trim();
//       }
//     });

//     if (debounceRef.current) clearTimeout(debounceRef.current);

//     debounceRef.current = setTimeout(() => {
//       dispatch(
//         fetchSocieties({
//           search: searchTerm,
//           filters: filterParams,
//           fromDate: fromDate || undefined,
//           toDate: toDate || undefined,
//           page: 0,
//           limit: pageSize,
//         })
//       );
//     }, 500);
//   };


//   useEffect(() => {
//     if ((fromDate && !toDate) || (!fromDate && toDate)) return;

//     dispatch(
//       fetchSocieties({
//         fromDate: fromDate || undefined,
//         toDate: toDate || undefined,
//         page: 0,
//         limit: pageSize,
//       })
//     );
//   }, [fromDate, toDate]);


//   const handleSearchAndDownload = async (
//     searchText: string,
//     exportType?: "csv" | "pdf"
//   ) => {
//     setSearchTerm(searchText);
//     setPageIndex(0);

//     if (exportType) {
//       await dispatch(
//         fetchSocieties({
//           search: searchText,
//           fromDate,
//           toDate,
//           exportType,
//         })
//       );
//     } else {
//       dispatch(
//         fetchSocieties({
//           search: searchText,
//           fromDate,
//           toDate,
//           page: 0,
//           limit: pageSize,
//         })
//       );
//     }
//   };


//   /*  TABLE COLUMNS*/
//   const columns: MRT_ColumnDef<any>[] = [
//     { accessorKey: "societyName", header: "Society Name", filterVariant: "text" },
//     { accessorKey: "state", header: "State", filterVariant: "text" },
//     { accessorKey: "city", header: "City", filterVariant: "text" },
//     { accessorKey: "detailAddress", header: "Address" },
//     { accessorKey: "totalWings", header: "Wings" },
//     { accessorKey: "floorsPerWing", header: "Floors / Wing" },
//     { accessorKey: "flatsPerFloor", header: "Flats / Floor" },
//     {
//       accessorKey: "isActive",
//       header: "Status",
//       filterVariant: "select",
//       filterSelectOptions: ["Active", "Inactive"],
//       Cell: ({ cell }) =>
//         cell.getValue() ? (
//           <Chip label="Active" color="success" size="small" />
//         ) : (
//           <Chip label="Inactive" color="error" size="small" />
//         ),
//     },
//     {
//       header: "Actions",
//       Cell: ({ row }) => (
//         <Box display="flex" gap={1}>
//           {/* VIEW */}
//           <Tooltip title="View Society">
//             <IconButton
//               color="primary"
//               onClick={() => {
//                 setNewSociety(row.original);
//                 setIsViewMode(true);
//                 setEditIndex(null);
//                 setShowForm(true);
//               }}
//             >
//               <VisibilityIcon />
//             </IconButton>
//           </Tooltip>

//           {/* ASSIGN ADMIN */}
//           <Tooltip title="Assign Society Admin">
//             <IconButton
//               onClick={() => {
//                 setSelectedSociety(row.original);
//                 setShowAssignAdminForm(true);
//               }}
//             >
//               <GroupIcon />
//             </IconButton>
//           </Tooltip>

//           <Tooltip title="Add Resident">
//             <IconButton
//               color="secondary"
//               onClick={() => {
//                 setSelectedSociety(row.original);
//                 setShowAddResident(true);
//               }}
//             >
//               <GroupIcon />
//             </IconButton>
//           </Tooltip>


//           {/* EDIT */}
//           <Tooltip title="Edit Society">
//             <IconButton
//               onClick={() => {
//                 setNewSociety(row.original);
//                 setEditIndex(row.index);
//                 setIsViewMode(false);
//                 setShowForm(true);
//               }}
//             >
//               <EditIcon />
//             </IconButton>
//           </Tooltip>

//           {/* DELETE */}
//           <Tooltip title="Delete Society">
//             <IconButton
//               color="error"
//               onClick={() => {
//                 setDeleteId(row.original._id);
//                 setShowDeleteConfirm(true);
//               }}
//             >
//               <DeleteIcon />
//             </IconButton>
//           </Tooltip>

//           <ToggleSwitch
//             checked={row.original.isActive}
//             onChange={() => handleToggleClick(row.original)}
//             tooltipTitle={row.original.isActive ? 'Deactivate' : 'Activate'}
//           />
//         </Box>
//       ),
//     }

//   ];

//   const confirmDelete = async () => {
//     if (!deleteId) return;
//     await dispatch(deleteSociety(deleteId));
//     setShowDeleteConfirm(false);
//     setDeleteId(null);
//   };



//   const handleToggleClick = (user: { _id: string; isActive: boolean }) => {
//     setToggleUser(user);
//     setShowToggleModal(true);
//   };

//   const confirmToggle = async () => {
//     if (!toggleUser) return;

//     try {
//       await dispatch(togglesocietyStatus({
//         _id: toggleUser._id,
//         isActive: !toggleUser.isActive
//       })).unwrap();

//       setAlertType('success');
//       setAlertMessage(`Staff ${toggleUser.isActive ? 'deactivated' : 'activated'} successfully.`);
//       setShowAlert(true);

//       dispatch(fetchSocieties({ search: searchTerm, page: pageIndex, limit: pageSize }));
//     } catch (err) {
//       setAlertType('error');
//       setAlertMessage('Status toggle failed: ' + err);
//       setShowAlert(true);
//     }

//     setTimeout(() => setShowAlert(false), 3000);
//     setShowToggleModal(false);
//     setToggleUser(null);
//   };

//   const cancelToggle = () => {
//     setShowToggleModal(false);
//     setToggleUser(null);
//   };

//   /* RENDER */
//   return (
//     <>
//       {/* DELETE CONFIRM */}
//       <SweetAlert
//         show={showDeleteConfirm}
//         type="error"
//         title="Delete Society"
//         message="Are you sure you want to delete this society?"
//         onConfirm={confirmDelete}
//         onCancel={() => setShowDeleteConfirm(false)}
//         confirmText="Yes"
//         cancelText="No"
//       />

//       {/* ===== CONDITIONAL RENDERING ===== */}
//       {showAddResident ? (
//         <AddResidentUser
//           society={selectedSociety}
//           onCancel={() => {
//             setShowAddResident(false);
//             setSelectedSociety(null);
//           }}
//         />
//       ) : showForm ? (
//         <AddEditSocietyDialog
//           onCancel={() => {
//             setShowForm(false);
//             setEditIndex(null);
//             setIsViewMode(false);
//             setNewSociety(emptySociety);
//           }}
//           editData={newSociety}
//           isEditMode={!isViewMode && editIndex !== null}
//           isViewMode={isViewMode}   // 👈 NEW
//         />
//       ) : showAssignAdminForm ? (
//         <AssignSocietyAdminDialog
//           society={selectedSociety}
//           onCancel={() => {
//             setShowAssignAdminForm(false);
//             setSelectedSociety(null);
//           }}
//         />
//       ) : (
//         <>
//           {/* HEADER */}
//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//             mb={2}
//           >
//             <Typography variant="h5" fontWeight={500} className="font-outfit">
//               Society Onboarding & Management{" "}
//               <Tooltip
//                 title="Create society, assign society admin, edit and manage society details."
//                 arrow
//               >
//                 <InfoIcon sx={{ color: "#245492", cursor: "pointer", ml: 1 }} />
//               </Tooltip>
//             </Typography>

//             <Button
//               onClick={() => {
//                 setNewSociety(emptySociety);
//                 setEditIndex(null);
//                 setShowForm(true);
//               }}
//             >
//               <AddIcon /> Add Society
//             </Button>
//           </Box>

//           {/* TABLE */}
//           <DataTable
//             data={societies}
//             columns={columns}
//             rowCount={totalItems}
//             pageIndex={pageIndex}
//             pageSize={pageSize}

//             enableColumnFilters
//             columnFilters={columnFilters}
//             onColumnFiltersChange={handleColumnFilterChange}

//             exportType={true}
//             clickHandler={handleSearchAndDownload}

//             fromDate={fromDate}
//             toDate={toDate}
//             onFromDateChange={setFromDate}
//             onToDateChange={setToDate}

//             onPaginationChange={({ pageIndex, pageSize }) => {
//               setPageIndex(pageIndex);
//               setPageSize(pageSize);

//               const filterParams: Record<string, any> = {};
//               columnFilters.forEach(({ id, value }) => {
//                 if (!value) return;
//                 filterParams[id] =
//                   id === "isActive" ? value === "Active" : value;
//               });

//               dispatch(
//                 fetchSocieties({
//                   search: searchTerm,
//                   filters: filterParams,
//                   fromDate,
//                   toDate,
//                   page: pageIndex,
//                   limit: pageSize,
//                 })
//               );
//             }}
//           />



//         </>
//       )}

//     </>
//   );
// };

// export default SocietyOnboarding;





import React, { useRef, useState, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { MRT_ColumnDef } from "material-react-table";

import DataTable from "../../tables/DataTable";
import SweetAlert from "../../ui/alert/SweetAlert";
import Button from "../../ui/button/Button";
import ToggleSwitch from "../../ui/toggleswitch/ToggleSwitch";

import AddEditSocietyDialog from "./AddEditSocietyDialog";
import AssignSocietyAdminDialog from "./AssignSocietyAdminDialog";
import AddResidentUser from "./AddResidentUser";

/* =========================
   EMPTY FORM DATA
========================= */
const emptySociety = {
  societyName: "",
  state: "",
  city: "",
  address: "",
  totalWings: "",
  floorsPerWing: "",
  flatsPerFloor: "",
};

/* =========================
   DUMMY DATA
========================= */
const dummySocieties = [
  {
    _id: "1",
    societyName: "Green Valley Society",
    state: "Maharashtra",
    city: "Pune",
    detailAddress: "Baner Road, Pune",
    totalWings: 4,
    floorsPerWing: 10,
    flatsPerFloor: 4,
    isActive: true,
    createdAt: "2025-01-05T10:30:00",
  },
  {
    _id: "2",
    societyName: "Sunshine Apartments",
    state: "Karnataka",
    city: "Bengaluru",
    detailAddress: "Whitefield",
    totalWings: 3,
    floorsPerWing: 8,
    flatsPerFloor: 6,
    isActive: false,
    createdAt: "2025-01-07T11:20:00",
  },
  {
    _id: "3",
    societyName: "Royal Residency",
    state: "Gujarat",
    city: "Ahmedabad",
    detailAddress: "SG Highway",
    totalWings: 5,
    floorsPerWing: 12,
    flatsPerFloor: 3,
    isActive: true,
    createdAt: "2025-01-09T09:15:00",
  },
];

const SocietyOnboarding = () => {
  /* ================= STATES ================= */
  const [societies, setSocieties] = useState(dummySocieties);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [columnFilters, setColumnFilters] = useState<{ id: string; value: any }[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newSociety, setNewSociety] = useState<any>(emptySociety);
  const [isViewMode, setIsViewMode] = useState(false);

  const [selectedSociety, setSelectedSociety] = useState<any>(null);
  const [showAssignAdminForm, setShowAssignAdminForm] = useState(false);
  const [showAddResident, setShowAddResident] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [toggleUser, setToggleUser] = useState<{ _id: string; isActive: boolean } | null>(null);
  const [showToggleModal, setShowToggleModal] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ================= FILTER LOGIC ================= */
  const filteredSocieties = useMemo(() => {
    return societies.filter((s) => {
      // search
      if (
        searchTerm &&
        !s.societyName.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;

      // column filters
      for (const f of columnFilters) {
        if (!f.value) continue;
        if (f.id === "isActive" && (f.value === "Active") !== s.isActive)
          return false;
        if (typeof f.value === "string") {
          const key = f.id as keyof typeof s;
          const fieldValue = s[key];

          if (
            fieldValue === undefined ||
            String(fieldValue).toLowerCase().indexOf(f.value.toLowerCase()) === -1
          ) {
            return false;
          }
        }

      }

      // date filter
      const created = new Date(s.createdAt).getTime();
      if (fromDate && created < new Date(fromDate).setHours(0, 0, 0, 0))
        return false;
      if (toDate && created > new Date(toDate).setHours(23, 59, 59, 999))
        return false;

      return true;
    });
  }, [societies, searchTerm, columnFilters, fromDate, toDate]);

  /* ================= TABLE COLUMNS ================= */
  const columns: MRT_ColumnDef<any>[] = [
    { accessorKey: "societyName", header: "Society Name", filterVariant: "text" },
    { accessorKey: "state", header: "State", filterVariant: "text" },
    { accessorKey: "city", header: "City", filterVariant: "text" },
    { accessorKey: "detailAddress", header: "Address" },
    { accessorKey: "totalWings", header: "Wings" },
    { accessorKey: "floorsPerWing", header: "Floors / Wing" },
    { accessorKey: "flatsPerFloor", header: "Flats / Floor" },
    {
      accessorKey: "isActive",
      header: "Status",
      filterVariant: "select",
      filterSelectOptions: ["Active", "Inactive"],
      Cell: ({ cell }) =>
        cell.getValue() ? (
          <Chip label="Active" color="success" size="small" />
        ) : (
          <Chip label="Inactive" color="error" size="small" />
        ),
    },
    {
      header: "Actions",
      Cell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Tooltip title="View Society">
            <IconButton
              onClick={() => {
                setNewSociety(row.original);
                setIsViewMode(true);
                setEditIndex(null);
                setShowForm(true);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Assign Society Admin">
            <IconButton
              sx={{ color: '#1976D2' }}
              onClick={() => {
                setSelectedSociety(row.original);
                setShowAssignAdminForm(true);
              }}
            >
              <GroupIcon />
            </IconButton>
          </Tooltip>


          <Tooltip title="Add Resident">
            <IconButton
              sx={{ color: '#6A1B9A' }} // purple
              onClick={() => {
                setSelectedSociety(row.original);
                setShowAddResident(true);
              }}
            >
              <GroupIcon />
            </IconButton>
          </Tooltip>


          <Tooltip title="Edit Society">
            <IconButton
              onClick={() => {
                setNewSociety(row.original);
                setEditIndex(row.index);
                setIsViewMode(false);
                setShowForm(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Society">
            <IconButton
              color="error"
              onClick={() => {
                setDeleteId(row.original._id);
                setShowDeleteConfirm(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>

          <ToggleSwitch
            checked={row.original.isActive}
            onChange={() => {
              setToggleUser(row.original);
              setShowToggleModal(true);
            }}
          />
        </Box>
      ),
    },
  ];

  /* ================= ACTIONS ================= */
  const confirmDelete = () => {
    setSocieties((prev) => prev.filter((s) => s._id !== deleteId));
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const confirmToggle = () => {
    if (!toggleUser) return;
    setSocieties((prev) =>
      prev.map((s) =>
        s._id === toggleUser._id ? { ...s, isActive: !s.isActive } : s
      )
    );
    setShowToggleModal(false);
    setToggleUser(null);
  };

  /* ================= RENDER ================= */
  return (
    <>
      <SweetAlert
        show={showDeleteConfirm}
        type="error"
        title="Delete Society"
        message="Are you sure you want to delete this society?"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <SweetAlert
        show={showToggleModal}
        type="warning"
        title="Confirm Status Change"
        message={`Are you sure you want to ${toggleUser?.isActive ? "deactivate" : "activate"
          } this society?`}
        onConfirm={confirmToggle}
        onCancel={() => setShowToggleModal(false)}
      />

      {showAddResident ? (
        <AddResidentUser
          society={selectedSociety}
          onCancel={() => {
            setShowAddResident(false);
            setSelectedSociety(null);
          }}
        />
      ) : showForm ? (
        <AddEditSocietyDialog
          onCancel={() => {
            setShowForm(false);
            setEditIndex(null);
            setIsViewMode(false);
            setNewSociety(emptySociety);
          }}
          editData={newSociety}
          isEditMode={!isViewMode && editIndex !== null}
          isViewMode={isViewMode}
        />
      ) : showAssignAdminForm ? (
        <AssignSocietyAdminDialog
          society={selectedSociety}
          onCancel={() => {
            setShowAssignAdminForm(false);
            setSelectedSociety(null);
          }}
        />
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight={500}>
              Society Onboarding & Management
              <Tooltip title="Create society, assign admin, manage details">
                <InfoIcon sx={{ ml: 1, color: "#245492" }} />
              </Tooltip>
            </Typography>

            <Button
              onClick={() => {
                setNewSociety(emptySociety);
                setEditIndex(null);
                setShowForm(true);
              }}
            >
              <AddIcon /> Add Society
            </Button>
          </Box>

          <DataTable
            data={filteredSocieties}
            columns={columns}
            rowCount={filteredSocieties.length}
            pageIndex={pageIndex}
            pageSize={pageSize}
            enableColumnFilters
            columnFilters={columnFilters}
            onColumnFiltersChange={setColumnFilters}
            exportType
            clickHandler={(search: string) => setSearchTerm(search)}
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onPaginationChange={({ pageIndex, pageSize }) => {
              setPageIndex(pageIndex);
              setPageSize(pageSize);
            }}
          />
        </>
      )}
    </>
  );
};

export default SocietyOnboarding;

