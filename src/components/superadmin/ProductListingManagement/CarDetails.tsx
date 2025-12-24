import React, { useState, useEffect, useRef } from 'react';
import { Typography, Divider } from '@mui/material';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchProductListingbyId } from '../../../store/ProductListing/ProductListingSlice';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import Captions from "yet-another-react-lightbox/plugins/captions";
// Required styles for plugins
import "yet-another-react-lightbox/plugins/thumbnails.css";
// import "yet-another-react-lightbox/plugins/zoom.css";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type ProductType = 'car' | 'bike' | 'sparepart';

const CarDetailsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const product = useSelector((state: RootState) => state.ProductLisiting.productdetails);
  const loading = useSelector((state: RootState) => state.ProductLisiting.loading);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [filtertype, setFiltertype] = useState<ProductType>('car');
  const [showSkeleton, setShowSkeleton] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const { carId } = useParams();
  const [searchParams] = useSearchParams();

  const type = (searchParams.get('type') as ProductType) || 'car'; // fallback


  useEffect(() => {
    if (carId && type) {
      dispatch(fetchProductListingbyId({ _id: carId, type }));
    }
  }, [carId, type, dispatch]);


  if (loading || !product || showSkeleton) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6 py-10 bg-white">
        {/* Skeleton for image section */}
        <div>
          <Skeleton height={400} borderRadius={12} />
          <div className="grid grid-cols-4 gap-2 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={80} />
            ))}
          </div>
        </div>

        {/* Skeleton for details section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <Skeleton height={32} width="40%" className="mb-4" />
          <Skeleton height={6} width="100%" className="mb-4" />
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 mt-4 font-outfit">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx}>
                <Skeleton height={14} width="60%" />
                <Skeleton height={18} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  const images = product.images || [];

  const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <div
        className="absolute top-1/2 right-2 z-10 transform -translate-y-1/2 cursor-pointer bg-white p-2 rounded-full shadow-md"
        onClick={onClick}
      >
        <ChevronRight />
      </div>
    );
  };

  const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <div
        className="absolute top-1/2 left-2 z-10 transform -translate-y-1/2 cursor-pointer bg-white p-2 rounded-full shadow-md"
        onClick={onClick}
      >
        <ChevronLeft />
      </div>
    );
  };


  const isSparePart = type === 'sparepart';

  const detailFields = isSparePart
    ? [
      ['Brand Name', product.brand_name],
      ['Product Type', product.product_type_name],
      ['Condition', product.condition_name],
      ['Year of Manufacture', product.year_of_manufacture],
      ['Price', `₹${product.price?.toLocaleString('en-IN')}`],
      ['City', product.city_name?.charAt(0).toUpperCase() + product.city_name?.slice(1).toLowerCase()],
      ['Description', product.description],
      ['Published', product.isPublished ? 'Yes' : 'No'],
      ['Sold', product.isSold ? 'Yes' : 'No'],
      ['Dealer Name', product.user_id?.name || '-'],
      ['Dealer Email', product.user_id?.email || '-'],
    ]
    : [
      ['Brand Name', product.brand_name],
      [`${type.charAt(0).toUpperCase()}${type.slice(1)} Name`, product.car_name || product.bike_name || product.sparepart_name],
      ['Fuel Type', product.fuel_type],
      ['Model Name', product.model_name],
      ['Color', product.color_name],
      ['Ownership', product.ownership],
      ['City', product.city_name?.charAt(0).toUpperCase() + product.city_name?.slice(1).toLowerCase()],
      ['Kilometers Driven', `${product.kilometers_driven?.toLocaleString()} km`],
      ['Price', `₹${product.price?.toLocaleString('en-IN')}`],
      ['Year', product.year],
      ['Transmission', product.transmission || 'Manual'],
      ['Listing Date', new Date(product.createdAt).toLocaleDateString('en-IN')],
      ['Dealer Name', product.user_id?.name || '-'],
      ['Dealer Phone', product.user_id?.phone || '-'],
      ['Dealer Email', product.user_id?.email || '-'],
      ['Dealer Address', product.user_id?.address || '-'],
      ['Dealer Business Name', product.user_id?.business_name || '-'],
      ['Dealer Business Contact No', product.user_id?.business_contact_no || '-'],
      ['Dealer Business WhatsApp No', product.user_id?.business_whatsapp_no || '-'],
      ['Published', product.isPublished ? 'Yes' : 'No'],
      ['Sold', product.isSold ? 'Yes' : 'No'],
    ];



  return (
    <>
      {/* Modal for image preview*/}

      {isModalOpen && activeImage && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-80 flex items-center justify-center">
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-white bg-black/60 hover:bg-black/80 p-1 rounded-full z-10"
              onClick={() => setIsModalOpen(false)}
            >
              <CloseIcon style={{ fontSize: 28 }} />
            </button>
            <img
              src={activeImage}
              alt="preview"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded"
            />
          </div>
        </div>
      )}

      <div className="px-6 pt-6 bg-white flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#255593] hover:underline"
        >
          <ArrowBackIcon fontSize="small" />
          <span className="ml-1 font-medium">Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6 py-10 bg-white">
        {/* Image Slider Section */}
        <div>
          <div>
            <div className="w-full h-[400px] rounded-lg overflow-hidden mb-4">
              {images[0] && (
                <img
                  src={images[0].url}
                  alt="main"
                  className="w-full h-full object-contain cursor-pointer"
                  onClick={() => {
                    setPhotoIndex(0);
                    setLightboxOpen(true);
                  }}
                />
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`thumb-${idx}`}
                  className="h-20 w-full object-cover border rounded cursor-pointer"
                  onClick={() => {
                    setPhotoIndex(idx);
                    setLightboxOpen(true);
                  }}
                />
              ))}
            </div>

            <Lightbox
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              index={photoIndex}
              slides={images.map((img) => ({
                src: img.url,
                title: "Product Image",
                description: "Click to zoom or download",
              }))}

              plugins={[Fullscreen, Slideshow, Thumbnails, Zoom, Download, Captions]}
              slideshow={{ autoplay: true, delay: 3000 }}
              zoom={{ maxZoomPixelRatio: 3 }}
            />
          </div>
        </div>



        {/* Car Details Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <Typography variant="h5" className="font-bold text-gray-700 mb-4 font-outfit">
            {type.toUpperCase()} DETAILS
          </Typography>

          <Divider sx={{ borderColor: '#255593', borderBottomWidth: '2px', }} />


          <div className="grid grid-cols-2 gap-y-4 gap-x-6 mt-4 font-outfit">
            {detailFields.map(([label, value], index) => (
              <div key={index}>
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="text-gray-800 font-medium">{value || '-'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CarDetailsPage;
