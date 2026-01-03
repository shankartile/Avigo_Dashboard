// import {
//     Box,
//     Typography,
//     IconButton,
//     Switch,
//     Dialog,
//     DialogContent,
//     DialogTitle,
//     Tooltip,
// } from '@mui/material';

// import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import CloseIcon from '@mui/icons-material/Close';
// import EditIcon from '@mui/icons-material/Edit';
// import { MRT_ColumnDef } from 'material-react-table';
// import { useEffect, useState } from 'react';
// import TextField from '../../../form/input/InputField';
// import Button from '../../../ui/button/Button';
// import DataTable from '../../../tables/DataTable';
// import ToggleSwitch from '../../../ui/toggleswitch/ToggleSwitch';
// import Alert from '../../../ui/alert/Alert';
// import SweetAlert from '../../../ui/alert/SweetAlert';
// import { useDispatch, useSelector } from 'react-redux';
// import { addNoticeCategoryMaster, AddNoticeCategoryMasterPayload, fetchNoticeCategoryMaster, UpdateNoticeCategoryMasterPayload, updateNoticeCategoryMaster, deleteNoticeCategoryMaster, toggleNoticeCategoryMasterStatus } from '../../../../store/SocietyAdminMaster/NoticeCategoryMasterSlice';
// import { fetchNoticetype } from '../../../../store/SocietyAdminMaster/NoticeNameMasterSlice';


// import { RootState, AppDispatch } from '../../../../store/store';
// import { title } from 'process';

// // Type definition
// type NoticeCategoryMaster = {
//     id: string;
//     category: string;
//     notice_type_id: string;
// }

// const NoticeCategoryMaster = () => {
//     const [newnoticecategory, setnewnoticecategory] = useState<NoticeCategoryMaster>({

//         id: '',
//         category: '',
//         notice_type_id: ''

//     });
//     const [selectednoticecategory, setselectednoticecategory] = useState<NoticeCategoryMaster | null>(null);

//     const [editIndex, setEditIndex] = useState<number | null>(null);
//     const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
//     const [alertMessage, setAlertMessage] = useState('');
//     const [showAlert, setShowAlert] = useState(false);
//     const [showForm, setShowForm] = useState(false);
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [deleteId, setDeleteId] = useState<string | null>(null);
//     const [showModal, setShowModal] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [pageIndex, setPageIndex] = useState(0);
//     const [pageSize, setPageSize] = useState(10);
//     const [toggleUser, setToggleUser] = useState<{ _id: string; isActive: boolean } | null>(null);
//     const [showToggleModal, setShowToggleModal] = useState(false);

//     const dispatch = useDispatch<AppDispatch>();
//     const { NoticeCategoryMaster: rawList = [], totalItems } = useSelector((state: RootState) => state.NoticeCategoryMasters);
//     const { NoticeTypeMaster } = useSelector((state: RootState) => state.NoticeTypeMaster);

//     const noticecategorylist = rawList.map(item => ({
//         ...item,
//         id: item._id,
//     }));


//     useEffect(() => {
//         const delayDebounce = setTimeout(() => {

//             dispatch(fetchNoticeCategoryMaster({
//                 search: searchTerm,
//                 page: pageIndex,
//                 limit: pageSize,
//             }));
//         }, 500); // 500ms delay

//         return () => clearTimeout(delayDebounce);
//     }, [searchTerm, pageIndex, pageSize]);


//     useEffect(() => {
//         const delayDebounce = setTimeout(() => {

//             dispatch(fetchNoticetype({
//                 search: searchTerm,
//                 page: pageIndex,
//                 limit: pageSize,
//             }));
//         }, 500); // 500ms delay

//         return () => clearTimeout(delayDebounce);
//     }, [searchTerm, pageIndex, pageSize]);




//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;

//         setnewnoticecategory((prev) => ({
//             ...prev,
//             [name]: value, // clean number input
//         }));
//     };

//     const isFormValid =
//         newnoticecategory.category.trim() !== ""




//     const handleAddNoticeCategoryMaster = async () => {
//         try {
//             const payload: AddNoticeCategoryMasterPayload = {

//                 category: newnoticecategory.category,
//                 notice_type_id: newnoticecategory.notice_type_id || ''

//             };

//             const result = await dispatch(addNoticeCategoryMaster(payload)).unwrap();

//             setAlertType('success');
//             setAlertMessage('Notice Category Added successfully.');
//             setShowAlert(true);
//             setTimeout(() => setShowAlert(false), 3000);
//             dispatch(fetchNoticeCategoryMaster({
//                 search: searchTerm,
//                 page: pageIndex,
//                 limit: pageSize,
//             })); setShowForm(false);
//         } catch (err: any) {
//             setAlertType('error');
//             setAlertMessage('Failed to add Notice Category : ' + err);
//             setShowAlert(true);
//             setTimeout(() => setShowAlert(false), 3000);

//         }
//     };


//     const handleEdit = async (NoticeCategoryMaster: any, index: number) => {
//         try {
//             setnewnoticecategory({
//                 id: NoticeCategoryMaster._id || '',
//                 category: NoticeCategoryMaster.category || '',
//                 notice_type_id: NoticeCategoryMaster.notice_type_id || ''

//             })
//             setEditIndex(index);
//             setShowForm(true);
//         } catch (err) {
//             setAlertType('error');
//             setAlertMessage('Unable to fetch Notice Category details for editing.');
//             setShowAlert(true);
//         }
//     };


//     const handleUpdateNoticeCategoryMaster = async () => {
//         try {
//             const payload: UpdateNoticeCategoryMasterPayload = {

//                 _id: newnoticecategory.id,
//                 category: newnoticecategory.category,
//                 notice_type_id: newnoticecategory.notice_type_id || ''


//             };
//             const result = await dispatch(updateNoticeCategoryMaster(payload)).unwrap();
//             setAlertType('success');
//             setAlertMessage('Notice Category  updated successfully.');
//             setShowAlert(true);
//             setTimeout(() => setShowAlert(false), 3000);

//             setShowForm(false);
//             setEditIndex(null);
//             dispatch(fetchNoticeCategoryMaster({
//                 search: searchTerm,
//                 page: pageIndex,
//                 limit: pageSize,
//             }));
//         } catch (err: any) {
//             setAlertType('error');
//             setAlertMessage('Failed to update Notice Category : ');
//             setShowAlert(true);
//             setTimeout(() => setShowAlert(false), 3000);

//         }
//     };


//     const requestDelete = (id: string) => {
//         setDeleteId(id);
//         setShowModal(true);
//     };

//     const confirmDelete = async () => {
//         if (!deleteId) return;

//         try {
//             await dispatch(deleteNoticeCategoryMaster(deleteId)).unwrap();
//             setAlertType('error');
//             setAlertMessage('Notice Category deleted successfully.');
//             setShowAlert(true);
//             setTimeout(() => setShowAlert(false), 3000);

//             dispatch(fetchNoticeCategoryMaster({
//                 search: searchTerm,
//                 page: pageIndex,
//                 limit: pageSize,
//             }));
//         } catch (err) {
//             setAlertType('error');
//             setAlertMessage('Delete failed: ' + err);
//             setShowAlert(true);
//             setTimeout(() => setShowAlert(false), 3000);

//         }

//         setShowModal(false);
//         setDeleteId(null);
//     };

//     const cancelDelete = () => {
//         setShowModal(false);
//         setDeleteId(null);
//     };


//     const handleToggleClick = (user: { _id: string; isActive: boolean }) => {
//         setToggleUser(user);
//         setShowToggleModal(true);
//     };

//     const confirmToggle = async () => {
//         if (!toggleUser) return;

//         try {
//             await dispatch(toggleNoticeCategoryMasterStatus({
//                 _id: toggleUser._id,
//                 isActive: !toggleUser.isActive
//             })).unwrap();

//             setAlertType('success');
//             setAlertMessage(`Notice Category ${toggleUser.isActive ? 'deactivated' : 'activated'} successfully.`);
//             setShowAlert(true);

//             dispatch(fetchNoticeCategoryMaster({ search: searchTerm, page: pageIndex, limit: pageSize }));
//         } catch (err) {
//             setAlertType('error');
//             setAlertMessage('Status toggle failed: ' + err);
//             setShowAlert(true);
//         }

//         setTimeout(() => setShowAlert(false), 3000);
//         setShowToggleModal(false);
//         setToggleUser(null);
//     };

//     const cancelToggle = () => {
//         setShowToggleModal(false);
//         setToggleUser(null);
//     };

//     const handleView = (NoticeCategoryMaster: NoticeCategoryMaster) => {
//         setselectednoticecategory(NoticeCategoryMaster);
//     };

//     const handleCloseModal = () => {
//         setselectednoticecategory(null);
//         setShowForm(false);
//     };



//     const clickHandler = (searchText: string) => {
//         setSearchTerm(searchText);
//         setPageIndex(0);

//     };





//     const NoticeCategoryMasterColumns: MRT_ColumnDef<any>[] = [
//         { accessorKey: 'category', header: 'Notice category' },
//         { accessorKey: 'notice_type_name', header: 'Notice Type' },

//         {
//             header: 'Actions',
//             Cell: ({ row }) => {

//                 return (
//                     <Box display="flex" gap={1}>
//                         <Tooltip title="View Details">
//                             <IconButton color="primary" onClick={() => handleView(row.original)}>
//                                 <VisibilityIcon />
//                             </IconButton>
//                         </Tooltip>

//                         {!row.original.isOthers && (
//                             <Tooltip title="Edit">
//                                 <span>
//                                     <IconButton color="secondary" onClick={() => handleEdit(row.original, row.index)}>
//                                         <EditIcon />
//                                     </IconButton>
//                                 </span>
//                             </Tooltip>)}

//                         {!row.original.isOthers && (
//                             <IconButton color="error" onClick={() => requestDelete(row.original._id)}>
//                                 <DeleteIcon />
//                             </IconButton>)}
//                         <ToggleSwitch
//                             checked={row.original.isActive}
//                             onChange={() => handleToggleClick(row.original)}
//                             tooltipTitle={row.original.isActive ? 'Deactivate' : 'Activate'}
//                         />
//                     </Box>
//                 );
//             }
//         }
//     ];

//     return (
//         <>

//             <SweetAlert
//                 show={showToggleModal}
//                 type="warning"
//                 title="Confirm Status Change"
//                 message={`Are you sure you want to ${toggleUser?.isActive ? 'deactivate' : 'activate'} this Notice Category?`}
//                 onConfirm={confirmToggle}
//                 onCancel={cancelToggle}
//                 confirmText="Yes"
//                 cancelText="No"
//             />

//             <SweetAlert
//                 show={showModal}
//                 type="error"
//                 title="Confirm Deletion"
//                 message="Are you sure you want to delete this Notice Category ?"
//                 onConfirm={confirmDelete}
//                 onCancel={cancelDelete}
//                 confirmText="Yes"
//                 cancelText="No"
//             />
//             {/* Always visible alert */}
//             {showAlert && alertType && (
//                 <div className="p-4">
//                     <Alert
//                         type={alertType}
//                         title={
//                             alertType === 'success'
//                                 ? 'Success!'
//                                 : alertType === 'error' && alertMessage.toLowerCase().includes('deleted')
//                                     ? 'Deleted!'
//                                     : alertType === 'error'
//                                         ? 'Error!'
//                                         : 'Warning!'
//                         }
//                         message={alertMessage}
//                         variant="filled"
//                         showLink={false}
//                         linkHref=""
//                         linkText=""
//                         onClose={() => setShowAlert(false)}
//                     />
//                 </div>
//             )}



//             {!showForm ? (
//                 <>
//                     <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                         <Box ml={2}>
//                             <Typography
//                                 variant="h5"
//                                 fontWeight={500}
//                                 className='font-outfit'
//                             >
//                                 Notice Category Master
//                             </Typography>
//                         </Box>
//                         <Button onClick={() => {
//                             setnewnoticecategory({
//                                 id: '',
//                                 category: '',
//                                 notice_type_id: ''

//                             });
//                             setEditIndex(null);
//                             setShowForm(true);
//                         }}><AddIcon />Add New Notice Category </Button>
//                     </Box>

//                     <DataTable
//                         clickHandler={clickHandler}
//                         data={noticecategorylist}
//                         columns={NoticeCategoryMasterColumns}
//                         rowCount={totalItems}
//                         pageIndex={pageIndex}
//                         pageSize={pageSize}
//                         onPaginationChange={({ pageIndex, pageSize }) => {
//                             setPageIndex(pageIndex);
//                             setPageSize(pageSize);
//                         }}
//                     />



//                 </>
//             ) : (
//                 <Dialog open={showForm} onClose={(event, reason) => {
//                     if (reason !== 'backdropClick') {
//                         setShowForm(false);
//                     }
//                 }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '25px' } }}
//                     BackdropProps={{
//                         sx: {
//                             backdropFilter: 'blur(4px)',
//                             backgroundColor: 'rgba(0, 0, 0, 0.2)'
//                         }
//                     }}>
//                     <Box sx={{ background: 'linear-gradient( #255593 103.05%)', height: 25, p: 4, position: 'relative' }}>
//                         <DialogTitle className='font-outfit' sx={{ color: 'white', position: 'absolute', top: 5 }}>
//                             {editIndex !== null ? 'Edit Notice Category' : 'Add Notice Category'}
//                         </DialogTitle>
//                         <IconButton sx={{ position: 'absolute', top: 12, right: 12, color: 'white' }} onClick={() => setShowForm(false)}><CloseIcon /></IconButton>
//                     </Box>
//                     <DialogContent>
//                         {/* Alert inside dialog */}
//                         {showAlert && alertType && (
//                             <div className="mb-4">
//                                 <Alert
//                                     type={alertType}
//                                     title={
//                                         alertType === 'success'
//                                             ? 'Success!'
//                                             : alertType === 'error' && alertMessage.toLowerCase().includes('deleted')
//                                                 ? 'Deleted!'
//                                                 : alertType === 'error'
//                                                     ? 'Error!'
//                                                     : 'Warning!'
//                                     }
//                                     message={alertMessage}
//                                     variant="filled"
//                                     showLink={false}
//                                     linkHref=""
//                                     linkText=""
//                                     onClose={() => setShowAlert(false)}
//                                 />
//                             </div>
//                         )}

//                         {/* Form fields */}
//                         <div className="p-4 grid grid-cols-1 md:grid-cols-1 gap-4">

//                             <div className="flex flex-col">
//                                 <label className="text-sm text-gray-600 dark:text-white mb-1 block">Notice Type <span className="text-error-500"> * </span>
//                                 </label>

//                                 <select
//                                     name="notice_type_id"
//                                     value={newnoticecategory.notice_type_id}
//                                     onChange={handleChange}
//                                     className="mt-1 p-2 border rounded"
//                                 >
//                                     <option value="">Select Notice Type</option>
//                                     {NoticeTypeMaster?.filter((c) => c.isActive).map((noticetype) => (
//                                         <option key={noticetype._id} value={noticetype._id}>
//                                             {noticetype.notice_type}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <TextField label="Notice Category " name="category" value={newnoticecategory.category} onChange={handleChange} />
//                         </div>

//                         <Box display="flex" justifyContent="center" gap={6} mt={4}>
//                             <Button

//                                 onClick={editIndex !== null ? handleUpdateNoticeCategoryMaster : handleAddNoticeCategoryMaster}
//                                 className="rounded-[25px]"
//                                 disabled={!isFormValid}
//                             >
//                                 {editIndex !== null ? 'Update Notice Category ' : 'Add Notice Category '}
//                             </Button>
//                             <Button variant="secondary" onClick={() => setShowForm(false)} className="rounded-[25px]">
//                                 Cancel
//                             </Button>
//                         </Box>
//                     </DialogContent>

//                 </Dialog>
//             )}

//             <Dialog open={!!selectednoticecategory} onClose={handleCloseModal} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '25px' } }}
//                 BackdropProps={{
//                     sx: {
//                         backdropFilter: 'blur(4px)',
//                         backgroundColor: 'rgba(0, 0, 0, 0.2)'
//                     }
//                 }}>
//                 <Box className="rounded-xl overflow-hidden">
//                     {/* Gradient Header */}
//                     <Box
//                         sx={{
//                             background: 'linear-gradient( #255593 103.05%)',
//                             height: 60,
//                             px: 4,
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'space-between',
//                             color: 'white',
//                         }}
//                     >
//                         <Typography className="font-outfit" variant="h6">
//                             Notice Category Details
//                         </Typography>
//                         <IconButton sx={{ color: 'white' }} onClick={handleCloseModal}>
//                             <CloseIcon />
//                         </IconButton>
//                     </Box>
//                     <DialogContent>
//                         {selectednoticecategory && (
//                             <Box display="flex" flexDirection="column" gap={2}>
//                                 <Typography className="font-outfit"><strong>Notice Category :</strong> {selectednoticecategory.category}</Typography>
//                             </Box>
//                         )}
//                     </DialogContent>
//                 </Box>
//             </Dialog>
//         </>
//     );
// };

// export default NoticeCategoryMaster;





import {
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogContent,
    Tooltip,
} from '@mui/material';
import {TruckIcon} from "lucide-react";

import AddIcon from '@mui/icons-material/Add';
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { MRT_ColumnDef } from 'material-react-table';
import { useEffect, useState } from 'react';
import TextField from '../../../form/input/InputField';
import Button from '../../../ui/button/Button';
import DataTable from '../../../tables/DataTable';
import ToggleSwitch from '../../../ui/toggleswitch/ToggleSwitch';
import Alert from '../../../ui/alert/Alert';
import SweetAlert from '../../../ui/alert/SweetAlert';
import { useDispatch, useSelector } from 'react-redux';

import {
    addVendorCategoryMaster,
    AddVendorCategoryMasterPayload,
    fetchVendorCategoryMaster,
    UpdateVendorCategoryMasterPayload,
    updateVendorCategoryMaster,
    deleteVendorCategoryMaster,
    toggleVendorCategoryMasterStatus,
} from '../../../../store/SocietyAdminMaster/VendorCategoryMasterSlice';

import { RootState, AppDispatch } from '../../../../store/store';

/* =======================
   TYPES
======================= */

type VendorMasterType = {
    id: string;
    vendorName: string;
    gstNumber: string;
    contact: string;
    purpose: string;
};

/* =======================
   COMPONENT
======================= */

const VendorMaster = () => {
    const [vendor, setVendor] = useState<VendorMasterType>({
        id: '',
        vendorName: '',
        gstNumber: '',
        contact: '',
        purpose: '',
    });

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<VendorMasterType | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);


    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [toggleUser, setToggleUser] = useState<{ _id: string; isActive: boolean } | null>(null);
    const [showToggleModal, setShowToggleModal] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const dispatch = useDispatch<AppDispatch>();
    const { VendorCategoryMaster: rawList = [], totalItems } = useSelector(
        (state: RootState) => state.VendorCategoryMasters
    );

    const vendorList = rawList.map(item => ({
        ...item,
        id: item._id,
    }));

    /* =======================
       FETCH
    ======================= */

    useEffect(() => {
        const delay = setTimeout(() => {
            dispatch(fetchVendorCategoryMaster({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            }));
        }, 500);

        return () => clearTimeout(delay);
    }, [searchTerm, pageIndex, pageSize]);

    /* =======================
       HANDLERS
    ======================= */

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVendor(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid = vendor.vendorName.trim() && vendor.contact.trim();

    const handleAddVendor = async () => {
        try {
            const payload: AddVendorCategoryMasterPayload = {
                vendorName: vendor.vendorName,
                gstNumber: vendor.gstNumber,
                contact: vendor.contact,
                purpose: vendor.purpose,
            };

            await dispatch(addVendorCategoryMaster(payload)).unwrap();

            setAlertType('success');
            setAlertMessage('Vendor added successfully.');
            setShowAlert(true);
            setShowForm(false);

            dispatch(fetchVendorCategoryMaster({ search: searchTerm, page: pageIndex, limit: pageSize }));
        } catch {
            setAlertType('error');
            setAlertMessage('Failed to add vendor.');
            setShowAlert(true);
        }
    };

    const handleEdit = (row: any, index: number) => {
        setVendor({
            id: row._id,
            vendorName: row.vendorName,
            gstNumber: row.gstNumber,
            contact: row.contact,
            purpose: row.purpose,
        });
        setEditIndex(index);
        setShowForm(true);
    };

    const handleUpdateVendor = async () => {
        try {
            const payload: UpdateVendorCategoryMasterPayload = {
                _id: vendor.id,
                vendorName: vendor.vendorName,
                gstNumber: vendor.gstNumber,
                contact: vendor.contact,
                purpose: vendor.purpose,
            };

            await dispatch(updateVendorCategoryMaster(payload)).unwrap();

            setAlertType('success');
            setAlertMessage('Vendor updated successfully.');
            setShowAlert(true);
            setShowForm(false);

            dispatch(fetchVendorCategoryMaster({ search: searchTerm, page: pageIndex, limit: pageSize }));
        } catch {
            setAlertType('error');
            setAlertMessage('Failed to update vendor.');
            setShowAlert(true);
        }
    };

    /* =======================
       DELETE
    ======================= */

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            await dispatch(deleteVendorCategoryMaster(deleteId)).unwrap();

            setAlertType('success');
            setAlertMessage('Vendor deleted successfully.');
            setShowAlert(true);

            dispatch(fetchVendorCategoryMaster({ search: searchTerm, page: pageIndex, limit: pageSize }));
        } catch {
            setAlertType('error');
            setAlertMessage('Failed to delete vendor.');
            setShowAlert(true);
        }

        setShowDeleteModal(false);
        setDeleteId(null);
    };

    /* =======================
       TOGGLE
    ======================= */

    const confirmToggle = async () => {
        if (!toggleUser) return;

        try {
            await dispatch(toggleVendorCategoryMasterStatus({
                _id: toggleUser._id,
                isActive: !toggleUser.isActive,
            })).unwrap();

            setAlertType('success');
            setAlertMessage(
                `Vendor ${toggleUser.isActive ? 'deactivated' : 'activated'} successfully.`
            );
            setShowAlert(true);

            dispatch(fetchVendorCategoryMaster({ search: searchTerm, page: pageIndex, limit: pageSize }));
        } catch {
            setAlertType('error');
            setAlertMessage('Failed to change vendor status.');
            setShowAlert(true);
        }

        setShowToggleModal(false);
        setToggleUser(null);
    };

    /* =======================
       TABLE COLUMNS
    ======================= */

    const columns: MRT_ColumnDef<any>[] = [
        { accessorKey: 'vendorName', header: 'Vendor Name' },
        { accessorKey: 'gstNumber', header: 'GST Number' },
        { accessorKey: 'contact', header: 'Contact' },
        { accessorKey: 'purpose', header: 'Purpose' },
        {
            header: 'Actions',
            Cell: ({ row }) => (
                <Box display="flex" gap={1}>
                    <Tooltip title="View">
                        <IconButton
                            color="primary"
                            onClick={() => {
                                setSelectedVendor(row.original);
                                setShowViewModal(true);
                            }}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>


                    <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(row.original, row.index)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => {
                            setDeleteId(row.original._id);
                            setShowDeleteModal(true);
                        }}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>

                    <ToggleSwitch
                        checked={row.original.isActive}
                        onChange={() => {
                            setToggleUser(row.original);
                            setShowToggleModal(true);
                        }}
                        tooltipTitle={row.original.isActive ? 'Deactivate' : 'Activate'}
                    />
                </Box>
            ),
        },
    ];

    return (
        <>
            {/* DELETE CONFIRM */}
            <SweetAlert
                show={showDeleteModal}
                type="error"
                title="Confirm Deletion"
                message="Are you sure you want to delete this vendor?"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
                confirmText="Yes"
                cancelText="No"
            />

            {/* TOGGLE CONFIRM */}
            <SweetAlert
                show={showToggleModal}
                type="warning"
                title="Confirm Status Change"
                message={`Are you sure you want to ${toggleUser?.isActive ? 'deactivate' : 'activate'
                    } this vendor?`}
                onConfirm={confirmToggle}
                onCancel={() => setShowToggleModal(false)}
                confirmText="Yes"
                cancelText="No"
            />

            {!showForm ? (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h5" className="font-outfit">
                            Vendor Master
                            <Tooltip
                                title="Add vendor name, GST, contact, and purpose."
                                arrow
                            >
                                <InfoIcon sx={{ color: "#245492", ml: 1 }} />
                            </Tooltip>
                        </Typography>

                        <Button onClick={() => {
                            setVendor({ id: '', vendorName: '', gstNumber: '', contact: '', purpose: '' });
                            setEditIndex(null);
                            setShowForm(true);
                        }}>
                            <TruckIcon /> Add Vendor
                        </Button>
                    </Box>

                    <DataTable
                        clickHandler={setSearchTerm}
                        data={vendorList}
                        columns={columns}
                        rowCount={totalItems}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        onPaginationChange={({ pageIndex, pageSize }) => {
                            setPageIndex(pageIndex);
                            setPageSize(pageSize);
                        }}
                    />
                </>
            ) : (
                <Dialog
                    open={showForm}
                    onClose={(event, reason) => {
                        if (reason !== "backdropClick") setShowForm(false);
                    }}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{ sx: { borderRadius: "16px" } }}
                    BackdropProps={{
                        sx: {
                            backdropFilter: "blur(4px)",
                            backgroundColor: "rgba(0,0,0,0.2)",
                        },
                    }}
                >
                    <Box className="rounded-xl overflow-hidden bg-white">
                        {/* HEADER */}
                        <Box
                            sx={{
                                background: "linear-gradient(#255593 103.05%)",
                                height: 60,
                                px: 4,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                color: "white",
                            }}
                        >
                            <Typography variant="h6" className="font-outfit">
                                {editIndex !== null ? "Edit Vendor" : "Add Vendor"}
                            </Typography>

                            <IconButton sx={{ color: "white" }} onClick={() => setShowForm(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        {/* BODY */}
                        <DialogContent>
                            {/* ALERT INSIDE POPUP */}
                            {showAlert && alertType && (
                                <Box mb={2}>
                                    <Alert
                                        type={alertType}
                                        title={alertType === 'success' ? 'Success!' : 'Error!'}
                                        message={alertMessage}
                                        variant="filled"
                                        showLink={false}
                                        onClose={() => setShowAlert(false)}
                                    />
                                </Box>
                            )}

                            {/* FORM */}
                            <Box px={2} py={2}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <TextField
                                        label="Vendor Name"
                                        name="vendorName"
                                        value={vendor.vendorName}
                                        onChange={handleChange}
                                    />

                                    <TextField
                                        label="GST Number"
                                        name="gstNumber"
                                        value={vendor.gstNumber}
                                        onChange={handleChange}
                                    />

                                    <TextField
                                        label="Contact"
                                        name="contact"
                                        value={vendor.contact}
                                        onChange={handleChange}
                                    />

                                    <TextField
                                        label="Purpose"
                                        name="purpose"
                                        value={vendor.purpose}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* ACTION BUTTONS */}
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    gap={6}
                                    mt={5}
                                >
                                    <Button
                                        disabled={!isFormValid}
                                        onClick={
                                            editIndex !== null
                                                ? handleUpdateVendor
                                                : handleAddVendor
                                        }
                                        className="rounded-[25px]"
                                    >
                                        {editIndex !== null ? "Update Vendor" : "Add Vendor"}
                                    </Button>

                                    <Button
                                        variant="secondary"
                                        className="rounded-[25px]"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </DialogContent>
                    </Box>
                </Dialog>
            )}
        </>
    );
};

export default VendorMaster;






