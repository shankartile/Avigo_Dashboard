import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import JoditEditor from 'jodit-react';
import TextField from '../../form/input/InputField';
import Button from '../../ui/button/Button';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchBuyerTerms, updateBuyerTerms } from '../../../store/TermsandConditionPrivacyPolicy/TermsandConditionSlice';
import Alert from '../../ui/alert/Alert';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';



type BuyerTermsConditionForm = {
  title: string;
  description: string;
};


const BuyerTermsConditionForm = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { data: termsData } = useSelector((state: RootState) => state.termsandcondition);

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 1000);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    dispatch(fetchBuyerTerms());
  }, [dispatch]);


  useEffect(() => {
    if (termsData) {
      setTitle(termsData.title);
      setDescription(termsData.description);
    }
  }, [termsData]);



  const handleSubmit = async () => {

    if (loading) return; // Prevent multiple submissions
    setLoading(true);

    try {
      if (!termsData?._id) return;

      await dispatch(
        updateBuyerTerms({ id: termsData._id, payload: { title, description } })
      ).unwrap();

      setAlertType('success');
      setAlertMessage('Buyer Terms and Condition updated successfully.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      dispatch(fetchBuyerTerms());
    } catch (err) {
      setAlertType('error');
      setAlertMessage('Failed to update Terms and Conditions.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
    finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (termsData) {
      setTitle(termsData.title);
      setDescription(termsData.description);
    }
  };



  const formvalid = title.trim() !== '' && description.trim() !== '';




  const renderBuyerTermsSkeleton = () => (
    <Box className="max-w-8xl mx-auto rounded-xl shadow-md bg-white mb-10">
      {/* Header Skeleton */}
      <Box
        sx={{
          background: 'linear-gradient( #255593 103.05%)',
          height: 60,
          px: 4,
          display: 'flex',
          alignItems: 'center',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          color: 'white',
        }}
      >
        <Skeleton height={30} width="40%" />
      </Box>

      {/* Form Skeleton */}
      <Box className="p-6 space-y-6">
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton height={56} />
          <Skeleton height={56} />
        </Box>

        <Box>
          <Skeleton height={24} width="20%" style={{ marginBottom: 8 }} />
          <Skeleton height={400} />
        </Box>

        <Box display="flex" justifyContent="center" gap={4}>
          <Skeleton height={40} width={120} />
        </Box>
      </Box>
    </Box>
  );


  return (
    <>
      {showAlert && alertType && (
        <div className="p-4">
          <Alert
            type={alertType}
            title={alertType === 'success' ? 'Success!' : alertType === 'error' ? 'Error!' : 'Warning!'}
            message={alertMessage}
            variant="filled"
            showLink={false}
            linkHref=""
            linkText=""
            onClose={() => setShowAlert(false)}
          />
        </div>
      )}


      {showSkeleton ? renderBuyerTermsSkeleton() : (
        <Box className="max-w-8xl mx-auto rounded-xl shadow-md bg-white mb-10">
          {/* Gradient Header */}
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
              Buyer Terms & Conditions
            </Typography>

          </Box>

          {/* Form Content */}
          <Box className="p-6 space-y-6">
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <TextField
                label="Type"
                name="type"
                value="Buyer"
                disabled
              />
            </Box>

            <Box>
              <Typography variant="subtitle1" className="font-outfit mb-2 text-gray-600">
                Description
              </Typography>
              <JoditEditor
                value={description}
                config={{
                  height: 500,
                  toolbarAdaptive: false,
                  askBeforePasteHTML: false,
                  askBeforePasteFromWord: false,
                  defaultActionOnPaste: 'insert_clear_html',
                  enableDragAndDropFileToEditor: true,
                }}
                onBlur={(newContent) => setDescription(newContent)}
                onChange={() => { }}
              />
            </Box>

            <Box display="flex" justifyContent="center" gap={4}>
              <Button disabled={!formvalid || loading} onClick={handleSubmit}>
                {loading ? 'Updating...' : 'Update'}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default BuyerTermsConditionForm;
