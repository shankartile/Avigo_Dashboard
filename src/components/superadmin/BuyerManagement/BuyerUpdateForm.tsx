import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '../../form/input/InputField'
import Button from '../../ui/button/Button';
import { fetchCityMaster } from '../../../store/Masters/CityMasterSlice';
// import { fetchCategoryMaster } from '../../../store/Masters/CategoryMasterSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBuyer, updateBuyerProfile } from '../../../store/AppUserManagement/BuyerManagementslice';
import Alert from '../../ui/alert/Alert';

type BuyerManagementType = {
  _id: string;
  name: string;
  phone: string;
  categories: [];
  cityName?: string;
  cityId?: string;
  categoryId?: string;
};

type Props = {
  editData?: BuyerManagementType;
  isEditMode?: boolean;
  onCancel: () => void;
};

const BuyerUpdateForm: React.FC<Props> = ({ editData, isEditMode, onCancel }) => {
  const [formData, setFormData] = useState<BuyerManagementType>(
    editData || {
      _id: '',
      name: '',
      phone: '',
      categories: [],
      cityName: '',
      cityId: '',
      categoryId: '',
    }
  );

  const dispatch = useDispatch<AppDispatch>();
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchCityMaster({ search: searchTerm, page: pageIndex, limit: pageSize }));
    // dispatch(fetchCategoryMaster({ search: searchTerm, page: pageIndex, limit: pageSize }));
  }, [dispatch, searchTerm, pageIndex, pageSize]);

  // const { CategoryMaster } = useSelector((state: RootState) => state.CategoryMaster);
  const { CityMaster } = useSelector((state: RootState) => state.CityMaster);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode && editData?._id) {
        const finalForm = {
          name: formData.name,
          phone: formData.phone,
          cityId: formData.cityId,
          categoryId: [formData.categoryId],
        };

        await dispatch(updateBuyerProfile({ _id: editData._id, ...finalForm })).unwrap();

        setAlertType('success');
        setAlertMessage('Buyer Profile updated successfully');
        setShowAlert(true);
        onCancel();
        dispatch(fetchBuyer({ search: '', page: 0, limit: 10 }));
      }
    } catch (error: any) {
      setAlertType('error');
      setAlertMessage(`Failed: ` + error.message);
      setShowAlert(true);
    }

    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <>

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

      <Box className="max-w-8xl mx-auto bg-white shadow-md rounded-xl mb-6">
        <Box
          sx={{
            background: 'linear-gradient( #255593 103.05%)',
            height: 60,
            px: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            color: 'white',
          }}
        >
          <Typography className="font-outfit" variant="h6">
            {isEditMode ? 'Edit Buyer Details' : 'Add Buyer'}
          </Typography>
          <IconButton sx={{ color: 'white' }} onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box px={6} py={4}>
          {(isEditMode) && (
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="font-outfit"
              />
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="font-outfit"
              />

              <Box className="flex flex-col w-full">
                <label className="text-sm text-gray-600 dark:text-white mb-1 block">
                  City <span className="text-error-500"> * </span>
                </label>
                <select
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded w-full"
                >
                  <option value="">Select City</option>
                  {CityMaster?.filter((c) => c.isActive).map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
              </Box>


              {/* <Box className="flex flex-col w-full">
                <label className="text-sm text-gray-600 dark:text-white mb-1 block">
                  Category <span className="text-error-500"> * </span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded w-full"
                >
                  <option value="">Select Category</option>
                  {CategoryMaster?.filter((c) => c.isActive).map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.category_name}
                    </option>
                  ))}
                </select>
              </Box> */}



            </div>
          )}

          <div className="flex justify-center gap-6 mt-6">
            <Button onClick={handleSubmit}>
              {isEditMode ? 'Update' : 'Create User'}
            </Button>
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default BuyerUpdateForm;
