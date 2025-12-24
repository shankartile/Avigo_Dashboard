// src/config/imageConfig.ts

export interface ImageValidationConfig {
    width: number;
    height: number;
    maxSizeInMB: number;
    aspectRatio?: string;
}

interface ProjectImageConfig {
    [featureName: string]: {
        [imageField: string]: ImageValidationConfig;
    };
}

export const imageConfig: ProjectImageConfig = {
    buyerTutorial: {
        full_image: {
            width: 1440,
            height: 3040,
            maxSizeInMB: 1,
        },
        thumbnail_image: {
            width: 1080,
            height: 1200,
            maxSizeInMB: 1,
        },
    },

    dealerTutorial: {
        full_image: {
            width: 1440,
            height: 3040,
            maxSizeInMB: 1,
        },
        thumbnail_image: {
            width: 1080,
            height: 1200,
            maxSizeInMB: 1,
        },
    },

    buyerBanner: {
        image: {
            width: 1440,
            height: 540,
            maxSizeInMB: 1,
        },
    },
    dealerBanner: {
        image: {
            width: 1440,
            height: 540,
            maxSizeInMB: 1,
        },
    },
    citymaster: {
        image: {
            width: 550,
            height: 385,
            maxSizeInMB: 1,
        },
    },


    homepagebannerdesktop: {
        image: {
            width: 1920,
            height: 736,
            maxSizeInMB: 1,
        },
    },

    homepagebannermobile: {
        image: {
            width: 1320,
            height: 1055,
            maxSizeInMB: 1,
        },
    },

    // You can add other project modules below in the same pattern
    productManagement: {
        productMainImage: {
            width: 800,
            height: 800,
            maxSizeInMB: 2,
            aspectRatio: '1:1',
        },
        productBanner: {
            width: 1920,
            height: 600,
            maxSizeInMB: 3,
        },
    },

    // Add more modules and fields as needed...
};
