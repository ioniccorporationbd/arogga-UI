import React from 'react';
import HeroBannerSlider from './HeroBannerSlider';
import HomeLabTestSection from './HomeLabTestSection';
import TrustedLabPartners from './TrustedLabPartners';
import HealthPackageExplorer from './HealthPackageExplorer';
import LabSeoContentSection from './LabSeoContentSection';

const page = () => {
    return (
        <div>
            <HeroBannerSlider/>
            <HomeLabTestSection/>
            <TrustedLabPartners/>
            <HealthPackageExplorer/>
            <LabSeoContentSection/>
        </div>
    );
};

export default page;