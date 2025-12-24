import {
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogContent,
    DialogTitle, Tooltip
} from '@mui/material';
import { useEffect, useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { MRT_ColumnDef } from 'material-react-table';
import DataTable from '../../../components/tables/DataTable';
import Button from '../../../components/ui/button/Button';
import SweetAlert from '../../../components/ui/alert/SweetAlert';
import ToggleSwitch from '../../../components/ui/toggleswitch/ToggleSwitch';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import Alert from '../../../components/ui/alert/Alert';
import TextField from '../../../components/form/input/InputField';
import TextArea from '../../../components/form/input/TextArea';
import {
    createDealerFAQManagement,
    fetchDealerFAQManagement,
    deleteDealerFAQManagement,
    toggleDealerFAQManagementStatus,
    AddDealerFAQManagementPayload,
    updateDealerFAQManagement,
    UpdateDealerFAQManagementPayload
} from '../../../store/AppFAQ/DealerAppFAQSlice';

type FAQManagementType = {
    _id: string;
    question: string;
    answer: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
};

const DealerAppFAQ = () => {

    const [newFAQManagement, setNewFAQManagement] = useState<FAQManagementType>({
        _id: '',
        question: '',
        answer: '',
        createdAt: '',
        updatedAt: '',
        isActive: false,
    });

    const dispatch = useDispatch<AppDispatch>();
    const { DealerFAQManagement, totalItems } = useSelector((state: RootState) => state.DealerFAQManagement);

    const [loading, setLoading] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [selectedFAQManagement, setSelectedFAQManagement] = useState<FAQManagementType | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState({
        question: "",
        answer: "",
    });

    // const { faqManagement: rawList = [], totalItems } = useSelector((state: RootState) => state.faqManagement);

    // const faqmanagementList = rawList.map(item => ({
    //     ...item,
    //     id: item._id,
    // }));

    const faqmanagementList = Array.isArray(DealerFAQManagement)
        ? DealerFAQManagement.map((item) => ({ ...item, id: item._id }))
        : [];



    useEffect(() => {
        const delayDebounce = setTimeout(() => {

            dispatch(fetchDealerFAQManagement({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            }));
        }, 500); // 500ms delay

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, pageIndex, pageSize]);


    const truncateText = (text?: string, maxLength = 50): string => {
        if (!text) return '';
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    const clickHandler = (searchText: string) => {
        setSearchTerm(searchText);
        setPageIndex(0);
    };

    const handleView = (faqmanagement: FAQManagementType) => {
        setSelectedFAQManagement(faqmanagement);
    };

    const handleCloseModal = () => {
        setSelectedFAQManagement(null);
    };

    const requestDelete = (id: string) => {
        setDeleteId(id);
        setShowModal(true);
    };


    const validateField = (name: string, value: string): string => {
        if (name === "question" || name === "answer") {
            if (!value.trim()) return `${name} is required`;
            if (!/[a-zA-Z]/.test(value)) return `${name} must contain words, not just numbers`;
            if (value.trim().length < 10) return `${name} should be at least 10 characters long`;
        }
        return "";
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        console.log("vudhdidsuds",name, value)
        setNewFAQManagement((prev) => ({
            ...prev,
            [name]: value, // clean number input
        }));

        // Validate in real time
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value),
        }));
    };




    const validateFAQFields = () => {
        const questionError = /[a-zA-Z]/.test(newFAQManagement.question) && newFAQManagement.question.trim().length >= 10;
        const answerError = /[a-zA-Z]/.test(newFAQManagement.answer) && newFAQManagement.answer.trim().length >= 10;
        return questionError && answerError;
    };

    const isFormValid = validateFAQFields();



    const addDealerFAQManagement = async () => {
        if (loading) return; // Prevent multiple submissions

        setLoading(true);


        try {
            const payload: AddDealerFAQManagementPayload = {

                question: newFAQManagement.question,
                answer: newFAQManagement.answer,

            };

            const result = await dispatch(createDealerFAQManagement(payload)).unwrap();

            setAlertType('success');
            setAlertMessage('FAQ Added successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
            dispatch(fetchDealerFAQManagement({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            })); setShowForm(false);
        } catch (err: any) {
            setAlertType('error');
            setAlertMessage('Failed to add FAQ: ' + err);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

        }
        finally {
            setLoading(false);
        }
    };

    const handleEdit = (faqmanagement: FAQManagementType, index: number) => {
        setNewFAQManagement({
            _id: faqmanagement._id,
            question: faqmanagement.question,
            answer: faqmanagement.answer,
            createdAt: faqmanagement.createdAt,
            updatedAt: faqmanagement.updatedAt,
            isActive: faqmanagement.isActive,
        });
        setEditIndex(index);
        setShowForm(true);
    };


    const UpdateDealerFAQManagement = async () => {

        if (loading) return; // Prevent multiple submissions

        setLoading(true);


        try {
            const payload: UpdateDealerFAQManagementPayload = {

                _id: newFAQManagement._id,
                question: newFAQManagement.question,
                answer: newFAQManagement.answer

            };
            const result = await dispatch(updateDealerFAQManagement(payload)).unwrap();
            setAlertType('success');
            setAlertMessage('FAQ updated successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

            setShowForm(false);
            setEditIndex(null);
            dispatch(fetchDealerFAQManagement({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            }));
        } catch (err: any) {
            setAlertType('error');
            setAlertMessage('Failed to update FAQ: ');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

        }
        finally {
            setLoading(false);
        }
    };


    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await dispatch(deleteDealerFAQManagement(deleteId)).unwrap();
            setAlertType('error');
            setAlertMessage('FAQ deleted successfully.');
            dispatch(fetchDealerFAQManagement({ page: pageIndex, limit: pageSize }));
        } catch (err) {
            setAlertType('error');
            setAlertMessage('Delete failed: ' + err);
        }
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        setShowModal(false);
        setDeleteId(null);
    };

    const cancelDelete = () => {
        setShowModal(false);
        setDeleteId(null);
    };

    const handleToggleStatus = async (id: string) => {
        try {
            await dispatch(toggleDealerFAQManagementStatus(id)).unwrap();
            setAlertType('success');
            setAlertMessage('Status updated successfully.');
            dispatch(fetchDealerFAQManagement({ page: pageIndex, limit: pageSize }));
        } catch (err) {
            setAlertType('error');
            setAlertMessage('Failed to update status: ' + err);
        }
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    const userColumns: MRT_ColumnDef<any>[] = [
        { accessorKey: 'question', header: 'Question', Cell: ({ row }) => truncateText(row.original.question, 30) },
        { accessorKey: 'answer', header: 'Answer', Cell: ({ row }) => truncateText(row.original.answer, 30) },
        // { accessorKey: 'createdAt', header: 'Created At' },
        // { accessorKey: 'updatedAt', header: 'Updated At' },
        {
            header: 'Actions',
            Cell: ({ row }) => (
                <Box display="flex" gap={1}>
                    <Tooltip title="View FAQ" arrow>
                        <IconButton color="primary" onClick={() => handleView(row.original)}>
                            <VisibilityIcon />
                        </IconButton></Tooltip>
                    <Tooltip title="Edit FAQ" arrow>
                        <IconButton color="secondary" onClick={() => handleEdit(row.original, row.index)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <IconButton color="error" onClick={() => requestDelete(row.original._id)}>
                        <DeleteIcon />
                    </IconButton>
                    {/* <ToggleSwitch
                        checked={row.original.isActive}
                        onChange={() => handleToggleStatus(row.original._id)}
                        id={`faq-toggle-${row.original._id}`}
                    /> */}
                </Box>
            ),
        },
    ];

    return (
        <>
            <SweetAlert
                show={showModal}
                type="error"
                title="Confirm Deletion"
                message="Are you sure you want to delete this FAQ?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                confirmText="Yes"
                cancelText="No"
            />
            {/* Always visible alert */}
            {showAlert && alertType && (
                <div className="p-4">
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
                </div>
            )}

            {!showForm ? (
                <>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box ml={2}>
                            <Typography variant="h5" fontWeight={500} className="font-outfit">
                                Dealer App FAQs  <Tooltip
                                    title="Manage Dealer App FAQs by adding new questions and updating existing ones."
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
                            </Typography></Box>
                        <Button onClick={() => {
                            setNewFAQManagement({
                                _id: '',
                                question: '',
                                answer: '',
                                createdAt: '',
                                updatedAt: '',
                                isActive: false,


                            });
                            setEditIndex(null);
                            setShowForm(true);
                        }}><AddIcon />Add New FAQ</Button>
                    </Box>

                    <DataTable
                        clickHandler={clickHandler}
                        data={faqmanagementList}
                        columns={userColumns}
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
                <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '25px' } }}
                    BackdropProps={{
                        sx: {
                            backdropFilter: 'blur(4px)',
                            backgroundColor: 'rgba(0, 0, 0, 0.2)'
                        }
                    }}>
                    <Box sx={{ background: 'linear-gradient( #255593 103.05%)', height: 25, p: 4, position: 'relative' }}>
                        <DialogTitle className='font-outfit' sx={{ color: 'white', position: 'absolute', top: 5 }}>
                            {editIndex !== null ? 'Edit FAQ' : 'Add FAQ'}
                        </DialogTitle>
                        <IconButton sx={{ position: 'absolute', top: 12, right: 12, color: 'white' }} onClick={() => setShowForm(false)}><CloseIcon /></IconButton>
                    </Box>
                    <DialogContent>
                        {/* Alert inside dialog */}
                        {showAlert && alertType && (
                            <div className="mb-4">
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
                            </div>
                        )}

                        {/* Form fields */}
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextArea
                                label="Question"
                                name="question"
                                value={newFAQManagement.question}
                                onChange={handleChange}
                                errorMessage={errors.question}
                            />
                            <TextArea
                                label="Answer"
                                name="answer"
                                value={newFAQManagement.answer}
                                onChange={handleChange}
                                errorMessage={errors.answer}
                            />
                        </div>

                        <Box display="flex" justifyContent="center" gap={6} mt={4}>
                            <Button

                                onClick={editIndex !== null ? UpdateDealerFAQManagement : addDealerFAQManagement}
                                className="rounded-[25px]"
                                disabled={!isFormValid || loading}
                            >
                                {loading ? (editIndex !== null ? 'Updating...' : 'Submitting...') : (editIndex !== null ? 'Update' : 'Submit')}
                            </Button>
                            <Button variant="secondary" onClick={() => setShowForm(false)} className="rounded-[25px]">
                                Cancel
                            </Button>
                        </Box>
                    </DialogContent>

                </Dialog>
            )}

            <Dialog
                open={!!selectedFAQManagement}
                onClose={handleCloseModal}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: '25px' } }}
                BackdropProps={{
                    sx: {
                        backdropFilter: 'blur(4px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    },
                }}
            >
                <Box className="rounded-xl overflow-hidden">
                    {/* Gradient Header */}
                    <Box
                        sx={{
                            background: 'linear-gradient( #255593 103.05%)',
                            height: 60,
                            px: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            color: 'white',
                        }}
                    >
                        <Typography className="font-outfit" variant="h6">
                            Dealer App FAQ Details
                        </Typography>
                        <IconButton sx={{ color: 'white' }} onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <DialogContent>
                        {selectedFAQManagement && (
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Typography className="font-outfit">
                                    <strong>Question:</strong> {selectedFAQManagement.question}
                                </Typography>
                                <Typography className="font-outfit">
                                    <strong>Answer:</strong> {selectedFAQManagement.answer}
                                </Typography>
                                <Typography className="font-outfit">
                                    <strong>Created At:</strong> {new Date(selectedFAQManagement.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                                </Typography>
                                {/* <Typography className="font-outfit">
                                    <strong>Updated At:</strong> {selectedFAQManagement.updatedAt}
                                </Typography> */}


                            </Box>
                        )}
                    </DialogContent>
                </Box>
            </Dialog>

        </>
    );
};

export default DealerAppFAQ;
