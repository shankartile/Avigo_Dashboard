// src/utils/imageValidator.ts
import { imageConfig } from './imageConfig';

export const validateImage = async (
    file: File,
    feature: keyof typeof imageConfig,
    field: string
): Promise<string | null> => {
    const config = imageConfig[feature]?.[field];
    if (!config) return null; // No config set for this

    return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            const isDimensionValid =
                img.width === config.width && img.height === config.height;
            const isSizeValid = file.size <= config.maxSizeInMB * 1024 * 1024;

            if (!isSizeValid) {
                resolve(`File exceeds ${config.maxSizeInMB}MB size limit.`);
            } else if (!isDimensionValid) {
                resolve(
                    `Invalid image size.\n Expected: ${config.width}×${config.height}px\n Received: ${img.width}×${img.height}px.\n Please upload the correct size.`
                );
            } else {
                resolve(null);
            }
        };

        img.onerror = () => {
            resolve('Failed to load image.');
        };
    });
};
