import { useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface CaptchaProps {
  onVerify: (token: string) => void;
  className?: string;
}

export const Captcha = ({ onVerify, className = '' }: CaptchaProps) => {
  const captchaRef = useRef<HCaptcha>(null);
  const siteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001';

  const handleVerify = (token: string) => {
    onVerify(token);
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <HCaptcha
        ref={captchaRef}
        sitekey={siteKey}
        onVerify={handleVerify}
        theme="dark"
      />
    </div>
  );
};