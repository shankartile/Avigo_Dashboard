import {
    Box,
    Typography,
    IconButton,
    Switch,
    Dialog,
    DialogContent,
    DialogTitle,
    Tooltip
} from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import AddIcon from '@mui/icons-material/Add';
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
import { fetchCountryMaster, fetchStateMaster, addCityMaster, AddCityMasterPayload, fetchCityMaster, UpdateCityMasterPayload, updateCityMaster, deleteCityMaster, toggleCityMasterStatus } from '../../../../store/Masters/CityMasterSlice';
import { RootState, AppDispatch } from '../../../../store/store';
import { title } from 'process';
import FileInput from '../../../form/input/FileInput';
import { validateImage } from '../../../../utility/imageValidator';


// Type definition
type CityMaster = {
    country_id?: string;
    state_id?: string;
    country_name?: string
    id: string;
    state_name?: string;
    city_name?: string;
    image: File | string | null;
}

const CityMaster = () => {
    const [newCity, setnewCity] = useState<CityMaster>({
        country_id: '',
        state_id: '',
        country_name: '',
        id: '',
        state_name: '',
        city_name: '',
        image: "",
    });
    const [selectedcity, setselectedcity] = useState<CityMaster | null>(null);
    const [errorsData, setErrorsData] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [toggleUser, setToggleUser] = useState<{ _id: string; isActive: boolean } | null>(null);
    const [showToggleModal, setShowToggleModal] = useState(false);
    const [isTopCity, setIsTopCity] = useState(false);


    const dispatch = useDispatch<AppDispatch>();
    // const { CountryMaster } = useSelector((state: RootState) => state.CountryMaster);
    // const { StateMaster } = useSelector((state: RootState) => state.StateMaster);
    // const { CityMaster: rawList = [], totalItems } = useSelector((state: RootState) => state.CityMaster);
    const { StateMaster, CountryMaster, CityMaster: rawList = [], totalItems } = useSelector(
        (state: RootState) => state.CityMaster
    );

    const cityList = rawList.map(item => ({
        ...item,
        id: item._id,
    }));



    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            dispatch(fetchCityMaster({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            }));
        }, 500); // 500ms delay
        return () => clearTimeout(delayDebounce);
    }, [searchTerm, pageIndex, pageSize]);


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            dispatch(fetchCountryMaster({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            }));
        }, 500); // 500ms delay
        return () => clearTimeout(delayDebounce);
    }, [searchTerm, pageIndex, pageSize]);


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            dispatch(fetchStateMaster({
                search: searchTerm,
                page: pageIndex,
                // limit: pageSize,
            }));
        }, 500); // 500ms delay
        return () => clearTimeout(delayDebounce);
    }, [searchTerm, pageIndex, pageSize]);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setnewCity((prev) => {
            if (name === "state_id") {
                const selectedState = StateMaster.find(s => s._id === value);
                return {
                    ...prev,
                    state_id: value,
                    state_name: selectedState ? selectedState.state_name : ''
                };
            }
            if (name === "country_id") {
                const selectedCountry = CountryMaster.find(c => c._id === value);
                return {
                    ...prev,
                    country_id: value,
                    country_name: selectedCountry ? selectedCountry.country_name : ''
                };
            }
            return {
                ...prev,
                [name]: value
            };
        });
    };


    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files && e.target.files[0];
    //     const name = e.target.name;

    //     if (!file) return;

    //     setnewCity((prev) => ({
    //         ...prev,
    //         [name]: file,
    //     }));

    //     setErrorsData(null);
    // };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const name = e.target.name;

        if (!file) return;

        const error = await validateImage(file, 'citymaster', name);

        if (error) {
            setErrorsData(error);
            return;
        }

        setnewCity((prev) => ({
            ...prev,
            [name]: file,
        }));

        setErrorsData(null);
    };


    const isFormValid =
        (newCity.country_id?.trim() ?? "") !== "" &&
        (newCity.state_id?.trim() ?? "") !== "" &&
        (newCity.city_name?.trim() ?? "") !== "";




    const handleAddCityMaster = async () => {
        try {
            const selectedCountry = CountryMaster.find(c => c._id === newCity.country_id);
            const selectedState = StateMaster.find(s => s._id === newCity.state_id);

            const payload: AddCityMasterPayload = {
                istopcities: isTopCity ? "true" : "false",
                country_id: newCity.country_id || "",
                country_name: selectedCountry?.country_name || "",
                state_id: selectedState?._id || "",
                state_name: selectedState?.state_name || "",
                city_name: newCity.city_name || "",
                image: isTopCity ? (newCity.image || '') : '', // clear image if not top city
            };

            const result = await dispatch(addCityMaster(payload)).unwrap();

            setAlertType('success');
            setAlertMessage('City Added successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
            dispatch(fetchCityMaster({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            })); setShowForm(false);
        } catch (err: any) {
            setAlertType('error');
            setAlertMessage(`${err}`);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    };


    const handleEdit = async (CityMaster: any, index: number) => {
        try {
            setnewCity({
                id: CityMaster._id || '',
                country_id: CityMaster.country_id || '',
                country_name: CityMaster.country_name || '',
                state_id: CityMaster.state_id || '',
                state_name: CityMaster.state_name || '',
                city_name: CityMaster.city_name || '',
                image: CityMaster.image || '',


            })
            setIsTopCity(!!CityMaster.istopcities);
            setEditIndex(index);
            setShowForm(true);
        } catch (err) {
            setAlertType('error');
            setAlertMessage('Unable to fetch city details for editing.');
            setShowAlert(true);
        }
    };


    const handleUpdateCityMaster = async () => {
        try {
            const payload: UpdateCityMasterPayload = {
                _id: newCity.id,
                country_id: newCity.country_id || "",
                country_name: newCity.country_name || "",
                state_id: newCity.state_id || "",
                state_name: newCity.state_name || "",
                city_name: newCity.city_name || "",
                istopcities: isTopCity ? "true" : "false",
                image: isTopCity ? (newCity.image || '') : '', // clear image if not top city
            };

            const result = await dispatch(updateCityMaster(payload)).unwrap();
            setAlertType('success');
            setAlertMessage('City updated successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

            setShowForm(false);
            setEditIndex(null);
            dispatch(fetchCityMaster({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            }));
        } catch (err: any) {
            setAlertType('error');
            setAlertMessage(`${err}`);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    };


    const requestDelete = (id: string) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            await dispatch(deleteCityMaster(deleteId)).unwrap();
            setAlertType('error');
            setAlertMessage('City deleted successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

            dispatch(fetchCityMaster({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            }));
        } catch (err) {
            setAlertType('error');
            setAlertMessage('Delete failed: ' + err);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

        }

        setShowModal(false);
        setDeleteId(null);
    };

    const cancelDelete = () => {
        setShowModal(false);
        setDeleteId(null);
    };




    const handleToggleClick = (user: { _id: string; isActive: boolean }) => {
        setToggleUser(user);
        setShowToggleModal(true);
    };

    const confirmToggle = async () => {
        if (!toggleUser) return;

        try {
            await dispatch(toggleCityMasterStatus({
                _id: toggleUser._id,
                isActive: !toggleUser.isActive
            })).unwrap();

            setAlertType('success');
            setAlertMessage(`City ${toggleUser.isActive ? 'deactivated' : 'activated'} successfully.`);
            setShowAlert(true);

            dispatch(fetchCityMaster({ search: searchTerm, page: pageIndex, limit: pageSize }));
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



    const handleView = (CityMaster: CityMaster) => {
        setselectedcity(CityMaster);
    };

    const handleCloseModal = () => {
        setselectedcity(null);
        setShowForm(false);
    };



    const clickHandler = (searchText: string) => {
        setSearchTerm(searchText);
        setPageIndex(0);
        // dispatch(fetchCityMaster({
        //     search: searchText,
        //     page: 0,
        //     limit: pageSize,
        // }));
    };





    const CityMasterColumns: MRT_ColumnDef<any>[] = [
        {
            accessorKey: 'city_name',
            header: 'City Name',
            Cell: ({ cell }) => {
                const value = cell.getValue<string>() || '';
                return value.charAt(0).toUpperCase() + value.slice(1);
            }
        },
        {
            accessorKey: 'state_name',
            header: 'State Name',
            Cell: ({ cell }) => {
                const value = cell.getValue<string>() || '';
                return value.charAt(0).toUpperCase() + value.slice(1);
            }
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
                        <Tooltip title="Edit City">
                            <IconButton color="secondary" onClick={() => handleEdit(row.original, row.index)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        {/* <IconButton color="error" onClick={() => requestDelete(row.original._id)}>
                            <DeleteIcon />
                        </IconButton> */}

                        <ToggleSwitch
                            checked={row.original.isActive}
                            onChange={() => handleToggleClick(row.original)}
                            tooltipTitle={row.original.isActive ? 'Deactivate' : 'Activate'}
                        />

                    </Box>
                );
            }
        }
    ];

    return (
        <>

            <SweetAlert
                show={showToggleModal}
                type="warning"
                title="Confirm Status Change"
                message={`Are you sure you want to ${toggleUser?.isActive ? 'deactivate' : 'activate'} this City?`}
                onConfirm={confirmToggle}
                onCancel={cancelToggle}
                confirmText="Yes"
                cancelText="No"
            />

            <SweetAlert
                show={showModal}
                type="error"
                title="Confirm Deletion"
                message="Are you sure you want to delete this Country?"
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

            <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle className='font-outfit'>Image Preview</DialogTitle>
                <DialogContent>
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="Preview"
                            style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: 12 }}
                        />
                    )}
                    <IconButton
                        sx={{ position: 'absolute', top: 12, right: 12 }}
                        onClick={() => setPreviewOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogContent>
            </Dialog>

            {!showForm ? (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box ml={2}>
                            <Typography
                                variant="h5"
                                fontWeight={500}
                                className='font-outfit'
                            >
                                City Management
                            </Typography>
                        </Box>
                        <Button onClick={() => {
                            setnewCity({
                                id: '',
                                state_name: '',
                                image: '',

                            });
                            setEditIndex(null);
                            setShowForm(true);
                            setIsTopCity(false);
                        }}><AddIcon />Add New City</Button>
                    </Box>

                    <DataTable
                        clickHandler={clickHandler}
                        data={cityList}
                        columns={CityMasterColumns}
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
                <Dialog open={showForm} onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        setShowForm(false);
                    }
                }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '25px' } }}
                    BackdropProps={{
                        sx: {
                            backdropFilter: 'blur(4px)',
                            backgroundColor: 'rgba(0, 0, 0, 0.2)'
                        }
                    }}>
                    <Box sx={{ background: 'linear-gradient( #255593 103.05%)', height: 25, p: 4, position: 'relative' }}>
                        <DialogTitle className='font-outfit' sx={{ color: 'white', position: 'absolute', top: 5 }}>
                            {editIndex !== null ? 'Edit City' : 'Add City'}
                        </DialogTitle>
                        <IconButton sx={{ position: 'absolute', top: 12, right: 12, color: 'white' }} onClick={() => {
                            setShowForm(false);
                            setErrorsData(null);
                        }}><CloseIcon /></IconButton>
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
                        <div className="p-4 grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-600 dark:text-white mb-1 block">Country <span className="text-error-500"> * </span>
                                </label>

                                <select
                                    name="country_id"
                                    value={newCity.country_id}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border rounded"
                                >
                                    <option value="">Select Country</option>
                                    {CountryMaster?.filter((c) => c.isActive).map((country) => (
                                        <option key={country._id} value={country._id}>
                                            {country.country_name}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            <div className="flex flex-col">
                                <label className="text-sm text-gray-600 dark:text-white mb-1 block">State <span className="text-error-500"> * </span>
                                </label>
                                <select
                                    name="state_id"
                                    value={newCity.state_id}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border rounded"
                                >
                                    <option value="">Select State</option>
                                    {StateMaster?.filter((c) => c.isActive).map((state) => (
                                        <option key={state._id} value={state._id}>
                                            {state.state_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <TextField label="City" name="city_name" value={newCity.city_name} onChange={handleChange} />
                                </div>
                                <div className="flex items-center mt-14">
                                    <input
                                        type="checkbox"
                                        id="isTopCity"
                                        checked={isTopCity}
                                        onChange={(e) => setIsTopCity(e.target.checked)}
                                        className="mr-2"
                                    />
                                    <label htmlFor="isTopCity" className="text-sm text-gray-700 dark:text-white">
                                        Mark as Top City
                                    </label>
                                </div>
                            </div>
                            {isTopCity && (
                                <>
                                    <label className="text-sm text-gray-600 mb-4">
                                        Add Image <span className="text-error-500">(Image resolution should be 550×385px)</span>
                                    </label>
                                    <FileInput
                                        id="image"
                                        name="image"
                                        onChange={handleFileChange}
                                    />
                                    {editIndex !== null && newCity.image && (
                                        <span className="text-xs text-gray-500 mb-1 ms-2">
                                            {typeof newCity.image === 'string'
                                                ? (newCity.image as string).split('/').pop()
                                                : newCity.image?.name}
                                        </span>
                                    )}
                                    {errorsData && (
                                        <span className="text-xs text-error-500">
                                            {errorsData}
                                        </span>
                                    )}
                                </>
                            )}

                        </div>

                        <Box display="flex" justifyContent="center" gap={6} mt={4}>
                            <Button

                                onClick={editIndex !== null ? handleUpdateCityMaster : handleAddCityMaster}
                                className="rounded-[25px]"
                                disabled={!isFormValid}
                            >
                                {editIndex !== null ? 'Update City' : 'Add City'}
                            </Button>
                            <Button variant="secondary" onClick={() => {
                                setShowForm(false);
                                setErrorsData(null);
                            }} className="rounded-[25px]">
                                Cancel
                            </Button>
                        </Box>
                    </DialogContent>

                </Dialog>
            )}

            <Dialog open={!!selectedcity} onClose={handleCloseModal} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '25px' } }}
                BackdropProps={{
                    sx: {
                        backdropFilter: 'blur(4px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)'
                    }
                }}>
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
                            City Details
                        </Typography>
                        <IconButton sx={{ color: 'white' }} onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <DialogContent>
                        {selectedcity && (
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Typography className="font-outfit"><strong>Country:</strong> {selectedcity.country_name}</Typography>
                                <Typography className="font-outfit"><strong>State:</strong> {selectedcity.state_name}</Typography>
                                <Typography className="font-outfit">
                                    <strong>City:</strong> {selectedcity?.city_name
                                        ? selectedcity.city_name.charAt(0).toUpperCase() + selectedcity.city_name.slice(1)
                                        : 'N/A'}
                                </Typography>

                                <Typography className="font-outfit" display="flex" alignItems="center" gap={1}>
                                    <strong>Full Image:</strong>
                                    {selectedcity.image ? (
                                        <IconButton
                                            onClick={() => {
                                                const src =
                                                    typeof selectedcity.image === 'string'
                                                        ? selectedcity.image
                                                        : (selectedcity.image
                                                            ? URL.createObjectURL(selectedcity.image)
                                                            : 'N/A');
                                                setPreviewUrl(src);
                                                setPreviewOpen(true);
                                            }}
                                        >
                                            <PreviewIcon color="primary" />
                                        </IconButton>
                                    ) : (
                                        <Typography className="font-outfit"> N/A</Typography>

                                    )

                                    }
                                </Typography>

                            </Box>
                        )}
                    </DialogContent>
                </Box>
            </Dialog>
        </>
    );
};

export default CityMaster;
