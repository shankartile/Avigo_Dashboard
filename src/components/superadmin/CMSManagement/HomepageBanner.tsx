import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Tooltip
} from '@mui/material';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import PreviewIcon from '@mui/icons-material/Preview';
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
import {
  createHomepageBanner,
  fetchHomepageBanners,
  deleteHomepageBanner,
  toggleHomepageBannerStatus,
  AddBannerPayload,
  updateHomepageBanner,
  UpdateBannerPayload
} from '../../../store/CMSManagement/HomepageBannerSlice';
import FileInput from '../../form/input/FileInput';
import { validateImage } from '../../../utility/imageValidator';
import { imageConfig } from '../../../utility/imageConfig';
import TextArea from '../../form/input/TextArea';

type HomepageBannerType = {
  _id: string;
  type: string;
  title: string;
  images: string[] | File[] | string;
  ctaLabel: string;
  shortDescription: string;
  ctaLink?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
};

const HomepageBanner = () => {

  const [newBanner, setNewBanner] = useState<HomepageBannerType>({
    _id: '',
    title: '',
    images: [],
    ctaLabel: '',
    shortDescription: '',
    ctaLink: '',
    type: '',
    createdAt: '',
    updatedAt: '',
    isActive: false,
  });

  const dispatch = useDispatch<AppDispatch>();
  const { HomepageBanner } = useSelector((state: RootState) => state.homepagebanner);
  const [loading, setLoading] = useState(false);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<HomepageBannerType | null>(null);
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [errorsData, setErrorsData] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"desktop" | "mobile" | null>(null);
  const [errors, setErrors] = useState({
    shortDescription: "",
  });


  const { HomepageBanner: rawList = [], totalItems } = useSelector((state: RootState) => state.homepagebanner);

  const bannerList = rawList.map(item => ({
    ...item,
    id: item._id,
  }));


  useEffect(() => {
    const delayDebounce = setTimeout(() => {

      dispatch(fetchHomepageBanners({
        search: searchTerm,
        page: pageIndex,
        limit: pageSize,
      }));
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, pageIndex, pageSize]);



  // old logic
  // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   const name = e.target.name;

  //   if (!file) return;

  //   const error = await validateImage(file, 'hompagebannerdeskop', name);

  //   if (error) {
  //     setErrorsData(error);
  //     return;
  //   }

  //   setNewBanner((prev) => ({
  //     ...prev,
  //     [name]: file,
  //   }));

  //   setErrorsData(null);
  // };



  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const name = e.target.name;

    if (!file) return;

    // Choose validation key based on viewType
    let validationKey: keyof typeof imageConfig = 'homepagebannerdesktop';
    if (newBanner.type === "mobile") validationKey = 'homepagebannermobile';


    const error = await validateImage(file, validationKey, name);

    if (error) {
      setErrorsData(error);
      return;
    }

    setNewBanner((prev) => ({
      ...prev,
      images: [file], // Replace `images` directly as File[]
    }));


    setErrorsData(null);
  };


  const clickHandler = (searchText: string) => {
    setSearchTerm(searchText);
    setPageIndex(0);
    // dispatch(fetchHomepageBanners({
    //   search: searchText,
    //   page: 0,
    //   limit: pageSize,
    // }));
  };

  const handleView = (banner: HomepageBannerType) => {
    setSelectedBanner(banner);
  };

  const handleCloseModal = () => {
    setSelectedBanner(null);
  };

  const requestDelete = (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    let parsedValue = value;
    if (name === 'type') {
      parsedValue = value === 'Desktop View' ? 'desktop' : value === 'Mobile View' ? 'mobile' : '';
    }

    setNewBanner((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const isFormValid =
    // newBanner.title.trim() !== "" &&
    // newBanner.ctaLabel.trim() !== "" &&
    // newBanner.ctaLink?.trim() !== "" &&
    !!newBanner.images;



  const addHomepageBanner = async () => {
    if (loading) return; // Prevent multiple submissions

    setLoading(true);

    try {
      const payload: AddBannerPayload = {

        type: newBanner.type === 'desktop' ? 'Desktop View' : 'Mobile View',
        title: newBanner.title,
        images: Array.isArray(newBanner.images)
          ? newBanner.images.filter((img): img is File => img instanceof File)
          : [],

        ctaLabel: newBanner.ctaLabel,
        ctaLink: newBanner.ctaLink,
        shortDescription: newBanner.shortDescription
      };

      const result = await dispatch(createHomepageBanner(payload)).unwrap();

      setAlertType('success');
      setAlertMessage('Banner Added successfully.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      dispatch(fetchHomepageBanners({
        search: searchTerm,
        page: pageIndex,
        limit: pageSize,
      })); setShowForm(false);
    } catch (err: any) {
      setAlertType('error');
      setAlertMessage('Failed to add banner: ' + err);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);

    }
    finally {
      setLoading(false);
    }
  };


  // const handleEdit = (banner: HomepageBannerType, index: number) => {
  //   setNewBanner({
  //     _id: banner._id,
  //     title: banner.title,
  //     images: banner.images,
  //     ctaLabel: banner.ctaLabel,
  //     ctaLink: banner.ctaLink ?? '',
  //     createdAt: banner.createdAt,
  //     updatedAt: banner.updatedAt,
  //     isActive: banner.isActive,
  //   });
  //   setEditIndex(index);
  //   setShowForm(true);
  // };

  const handleEdit = (banner: HomepageBannerType, index: number) => {
    setNewBanner({
      _id: banner._id,
      type: banner.type,
      title: banner.title,
      images: banner.images,
      ctaLabel: banner.ctaLabel,
      shortDescription: banner.shortDescription,
      ctaLink: banner.ctaLink ?? '',
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt,
      isActive: banner.isActive,
    });

    // Set viewType based on row index
    if (index === 0) setViewType("desktop");
    else if (index === 1) setViewType("mobile");
    else setViewType(null);

    setEditIndex(index);
    setShowForm(true);
  };


  const UpdateBanner = async () => {
    if (loading) return; // Prevent multiple submissions

    setLoading(true);

    try {
      const payload: UpdateBannerPayload = {

        _id: newBanner._id,
        type: newBanner.type === 'desktop' ? 'Desktop View' : 'Mobile View',
        title: newBanner.title,
        images: Array.isArray(newBanner.images)
          ? newBanner.images.filter((img): img is File => img instanceof File)
          : [],

        ctaLabel: newBanner.ctaLabel,
        ctaLink: newBanner.ctaLink,
        shortDescription: newBanner.shortDescription,


      };
      const result = await dispatch(updateHomepageBanner(payload)).unwrap();
      setAlertType('success');
      setAlertMessage('Banner updated successfully.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);

      setShowForm(false);
      setEditIndex(null);
      dispatch(fetchHomepageBanners({
        search: searchTerm,
        page: pageIndex,
        limit: pageSize,
      }));
    } catch (err: any) {
      setAlertType('error');
      setAlertMessage('Failed to update Banner: ' + err);
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
      await dispatch(deleteHomepageBanner(deleteId)).unwrap();
      setAlertType('error');
      setAlertMessage('Banner deleted successfully.');
      dispatch(fetchHomepageBanners({ page: pageIndex, limit: pageSize }));
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


  // const handleToggleStatus = async (id: string) => {
  //   try {
  //     await dispatch(toggleHomepageBannerStatus(id)).unwrap();
  //     setAlertType('success');
  //     setAlertMessage('Status updated successfully.');
  //     dispatch(fetchHomepageBanners({ page: pageIndex, limit: pageSize }));
  //   } catch (err) {
  //     setAlertType('error');
  //     setAlertMessage('Failed to update status: ' + err);
  //   }
  //   setShowAlert(true);
  //   setTimeout(() => setShowAlert(false), 3000);
  // };



  const validateField = (name: string, value: string): string => {
    if (name === "shortDescription") {
      if (!value.trim()) return `${name} is required`;
      if (!/[a-zA-Z]/.test(value)) return `${name} must contain words, not just numbers`;
      if (value.trim().length < 10) return `${name} should be at least 10 characters long`;
    }
    return "";
  };



  const truncateText = (text?: string, maxLength = 50): string => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };


  const userColumns: MRT_ColumnDef<any>[] = [

    {
      accessorKey: 'type',
      header: 'View Type',
      Cell: ({ row }) => row.original.type || 'N/A',
    },
    {
      accessorKey: 'title',
      header: 'Title',
      Cell: ({ row }) => row.original.title || 'N/A',
    },
    {
      accessorKey: 'images',
      header: 'Image',
      Cell: ({ row }) => (
        <img
          src={row.original.images[0]}
          alt="Banner"
          style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 8 }}
        />
      ),
    },
    { accessorKey: 'ctaLabel', header: 'CTA Label', Cell: ({ row }) => row.original.ctaLabel || 'N/A', },
    { accessorKey: 'ctaLink', header: 'CTA Link', Cell: ({ row }) => truncateText(row.original.ctaLink || 'N/A', 30) },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      Cell: ({ cell }) => {
        const date = cell.getValue() as string;
        return new Date(date).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        });
      },
    }, {
      accessorKey: 'updatedAt',
      header: 'Updated At',
      Cell: ({ row }) => {
        const updatedAt = new Date(row.original.updatedAt);

        // Format date
        const formattedDate = updatedAt.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        });

        // Format time
        let hours = updatedAt.getHours();
        const minutes = updatedAt.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

        return `${formattedDate} ${formattedTime}`;
      },
    }, {
      header: 'Actions',
      Cell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Tooltip title="View Details" arrow>
            <IconButton color="primary" onClick={() => handleView(row.original)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Banner" arrow>
            <IconButton color="secondary" onClick={() => handleEdit(row.original, row.index)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <IconButton color="error" onClick={() => requestDelete(row.original._id)}>
            <DeleteIcon />
          </IconButton>
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
        message="Are you sure you want to delete this banner?"
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

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
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
              <Typography variant="h5" fontWeight={500} className="font-outfit">
                Homepage Banners  <Tooltip
                  title="Add, update, and view hero banners displayed on the website’s home page."
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
            <Button onClick={() => {
              setNewBanner({
                _id: '',
                type: '',
                title: '',
                images: [],
                ctaLabel: '',
                shortDescription: '',
                ctaLink: '',
                createdAt: '',
                updatedAt: '',
                isActive: false,
              });
              setEditIndex(null);
              setShowForm(true);
            }}><AddIcon />Add New Banner
            </Button>
          </Box>

          <DataTable
            clickHandler={clickHandler}
            data={bannerList}
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
        <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '25px' } }}
          BackdropProps={{
            sx: {
              backdropFilter: 'blur(4px)',
              backgroundColor: 'rgba(0, 0, 0, 0.2)'
            }
          }}>
          <Box sx={{ background: 'linear-gradient( #255593 103.05%)', height: 25, p: 4, position: 'relative' }}>
            <DialogTitle className='font-outfit' sx={{ color: 'white', position: 'absolute', top: 5 }}>
              {editIndex !== null ? 'Edit Banner' : 'Add Bannner'}
            </DialogTitle>
            <IconButton sx={{ position: 'absolute', top: 12, right: 12, color: 'white' }} onClick={() => {
              setShowForm(false);
              setErrorsData(null);
            }} ><CloseIcon /></IconButton>
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

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 dark:text-white mb-2 block">View Type <span className="text-error-500"> * </span>
                </label>

                <select
                  name="type"
                  value={newBanner.type === 'desktop' ? 'Desktop View' : newBanner.type === 'mobile' ? 'Mobile View' : ''}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded"
                >
                  <option value="">Select View Type</option>
                  <option value="Desktop View">Desktop View</option>
                  <option value="Mobile View">Mobile View</option>
                </select>

              </div>

              <TextField
                label="Banner Title"
                name="title"
                value={newBanner.title}
                onChange={handleChange}
                required={false}
              />

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-4">
                  Banner Image
                  <span className="text-error-500">
                    * (
                    {newBanner.type === 'mobile'
                      ? 'Image resolution should be 1320×1055px'
                      : newBanner.type === 'desktop'
                        ? 'Image resolution should be 1920×736px'
                        : 'Please select view type'}
                    )
                  </span>
                </label>

                <FileInput
                  accept="image/*"
                  id="image"
                  name='image'
                  onChange={handleFileChange}
                />
                {editIndex !== null && newBanner.images && (
                  <span className="text-xs text-gray-500 mb-1 ms-2">
                    {Array.isArray(newBanner.images) ? (
                      typeof newBanner.images[0] === 'string' ? (
                        newBanner.images[0].split('/').pop()
                      ) : (
                        (newBanner.images[0] as File).name
                      )
                    ) : typeof newBanner.images === 'string' ? (
                      newBanner.images.split('/').pop()
                    ) : (
                      (newBanner.images as File).name
                    )}
                  </span>
                )}

                {errorsData && (
                  <span className="text-xs text-error-500">
                    {errorsData}
                  </span>
                )}
              </div>

              <TextField
                label="Banner ctaLabel"
                name="ctaLabel"
                value={newBanner.ctaLabel}
                onChange={handleChange}
                required={false}
              />
              <TextField
                label="Banner ctaLink"
                name="ctaLink"
                value={newBanner.ctaLink}
                onChange={handleChange}
                required={false}
              />
              <TextArea
                label="Short Description"
                name="shortDescription"
                value={newBanner.shortDescription}
                onChange={handleChange}
                maxLength={95}
                errorMessage={errors.shortDescription}
              />
            </div>

            <Box display="flex" justifyContent="center" gap={6} mt={4}>
              <Button
                onClick={editIndex !== null ? UpdateBanner : addHomepageBanner}
                className="rounded-[25px]"
                disabled={!isFormValid || loading}
              >
                {loading ? (editIndex !== null ? 'Updating...' : 'Submitting...') : (editIndex !== null ? 'Update' : 'Submit')}
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

      <Dialog
        open={!!selectedBanner}
        onClose={handleCloseModal}
        maxWidth="md"
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
              Banner Details
            </Typography>
            <IconButton sx={{ color: 'white' }} onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <DialogContent>
            {selectedBanner && (
              <Box display="flex" flexDirection="column" gap={2}>
                <Typography className="font-outfit">
                  <strong>Title:</strong> {selectedBanner.title}
                </Typography>
                <Typography className="font-outfit">
                  <strong>CTA Label:</strong> {selectedBanner.ctaLabel}
                </Typography>
                <Typography className="font-outfit">
                  <strong>CTA Link:</strong> {selectedBanner.ctaLink}
                </Typography>
                <Typography className="font-outfit">
                  <strong>Created At:</strong> {new Date(selectedBanner.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </Typography>
                <Typography className="font-outfit">
                  <strong>Updated At:</strong> {new Date(selectedBanner.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </Typography>
                <Typography className="font-outfit" display="flex" alignItems="center" gap={1}>
                  <strong>Full Image:</strong>
                  {Array.isArray(selectedBanner.images) &&
                    selectedBanner.images.length > 0 &&
                    typeof selectedBanner.images[0] === 'string' && (
                      <IconButton
                        onClick={() => {
                          const imageUrl = selectedBanner.images?.[0] as string;
                          setPreviewUrl(imageUrl);
                          setPreviewOpen(true);
                        }}
                      >
                        <PreviewIcon color="primary" />
                      </IconButton>
                    )}
                </Typography>
              </Box>
            )}
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};
export default HomepageBanner;
