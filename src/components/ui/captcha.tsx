import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

interface CaptchaProps {
  onVerify: (verified: boolean) => void;
  className?: string;
}

export const Captcha = ({ onVerify, className = '' }: CaptchaProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleCheck = async (checked: boolean) => {
    if (checked && !isVerified) {
      setIsChecked(true);
      setIsVerifying(true);

      await new Promise(resolve => setTimeout(resolve, 1200));

      setIsVerifying(false);
      setIsVerified(true);
      onVerify(true);
    } else if (!checked) {
      setIsChecked(false);
      setIsVerified(false);
      onVerify(false);
    }
  };

  useEffect(() => {
    setIsChecked(false);
    setIsVerified(false);
    setIsVerifying(false);
  }, []);

  return (
    <div className={`border-2 border-muted rounded-lg p-4 bg-background/50 backdrop-blur-sm ${className}`}>
      <div className="flex items-center gap-3">
        {isVerifying ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <Checkbox
            id="captcha"
            checked={isChecked}
            onCheckedChange={handleCheck}
            disabled={isVerified}
            className="h-5 w-5"
          />
        )}
        
        <label
          htmlFor="captcha"
          className={`text-sm font-medium cursor-pointer select-none transition-colors ${
            isVerified ? 'text-green-600 dark:text-green-400' : 'text-foreground'
          }`}
        >
          {isVerifying ? 'Проверяем...' : isVerified ? '✓ Вы человек!' : 'Я не робот'}
        </label>
      </div>
      
      <div className="mt-3 pt-3 border-t border-muted/50 flex items-center justify-between text-xs text-muted-foreground">
        <span>Защита от ботов</span>
        <span className="font-mono">CAPTCHA</span>
      </div>
    </div>
  );
};
