
import React from 'react';
import { BRAND_INFO } from '../constants.ts';

interface SocialIconLinkProps {
  href: string;
  icon: string;
  label: string;
}

const SocialIconLink: React.FC<SocialIconLinkProps> = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    title={label}
    className="text-slate-300 hover:text-[#FFDF00] transition-colors duration-300"
    dangerouslySetInnerHTML={{ __html: icon }}
  />
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#003030] text-slate-300 py-12 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">{BRAND_INFO.shortName}</h3>
            <img src={BRAND_INFO.logoUrl} alt={`${BRAND_INFO.shortName} Logo`} className="h-10 mb-3 opacity-80" />
            <p className="text-sm">{BRAND_INFO.longName}</p>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
            <p className="text-sm mb-1">Email: <a href={`mailto:${BRAND_INFO.email}`} className="hover:text-[#FFDF00]">{BRAND_INFO.email}</a></p>
            <p className="text-sm">Mobile: <a href={`tel:${BRAND_INFO.mobile.replace(/\s/g, '')}`} className="hover:text-[#FFDF00]">{BRAND_INFO.mobile}</a></p>
            <p className="text-sm mt-2">Website: <a href={BRAND_INFO.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#FFDF00]">{BRAND_INFO.website}</a></p>
          </div>
          
          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
            <div className="flex flex-wrap gap-4">
              <SocialIconLink href={BRAND_INFO.socialLinks.blog.url} icon={BRAND_INFO.socialLinks.blog.icon} label={BRAND_INFO.socialLinks.blog.label} />
              <SocialIconLink href={BRAND_INFO.socialLinks.linkedin.url} icon={BRAND_INFO.socialLinks.linkedin.icon} label={BRAND_INFO.socialLinks.linkedin.label} />
              <SocialIconLink href={BRAND_INFO.socialLinks.instagram.url} icon={BRAND_INFO.socialLinks.instagram.icon} label={BRAND_INFO.socialLinks.instagram.label} />
              <SocialIconLink href={BRAND_INFO.socialLinks.github.url} icon={BRAND_INFO.socialLinks.github.icon} label={BRAND_INFO.socialLinks.github.label} />
              <SocialIconLink href={BRAND_INFO.socialLinks.x.url} icon={BRAND_INFO.socialLinks.x.icon} label={BRAND_INFO.socialLinks.x.label} />
              <SocialIconLink href={BRAND_INFO.socialLinks.youtube.url} icon={BRAND_INFO.socialLinks.youtube.icon} label={BRAND_INFO.socialLinks.youtube.label} />
            </div>
          </div>

          {/* Our Location */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Our Location</h3>
            <p className="text-sm mb-3">{BRAND_INFO.address}</p>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                 <div dangerouslySetInnerHTML={{ __html: BRAND_INFO.googleMapsEmbed }} />
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 pt-8 text-center text-sm">
          <p>&copy; {currentYear} {BRAND_INFO.longName}. All rights reserved.</p>
          <p className="mt-1">Designed with passion for innovation.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
