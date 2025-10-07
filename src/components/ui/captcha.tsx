import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface CaptchaProps {
  onVerify: (verified: boolean) => void;
  className?: string;
}

export const Captcha = ({ onVerify, className = '' }: CaptchaProps) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const generateQuestion = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setNum1(n1);
    setNum2(n2);
    setUserAnswer('');
    setIsVerified(false);
    onVerify(false);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleAnswerChange = (value: string) => {
    setUserAnswer(value);
    const answer = parseInt(value);
    const correctAnswer = num1 + num2;
    
    if (answer === correctAnswer) {
      setIsVerified(true);
      onVerify(true);
    } else {
      setIsVerified(false);
      onVerify(false);
    }
  };

  return (
    <div className={`border-2 border-muted rounded-lg p-4 bg-background/50 backdrop-blur-sm ${className}`}>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">
            {num1} + {num2} = ?
          </span>
          <Input
            type="number"
            value={userAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Answer"
            className={`w-20 text-center ${
              isVerified ? 'border-green-500 bg-green-500/10' : ''
            }`}
          />
          {isVerified && (
            <span className="text-green-600 dark:text-green-400 font-medium">
              ✓
            </span>
          )}
        </div>
        
        <div className="pt-2 border-t border-muted/50 flex items-center justify-between text-xs text-muted-foreground">
          <span>Bot Protection</span>
          <button
            onClick={generateQuestion}
            className="text-primary hover:underline"
            type="button"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};