import React, { useState, useRef, useEffect } from 'react';
import Label from "../../form/Label";
import Input from "../../form/input/InputField";

interface OTPInputProps {
    showOtp: boolean;
    onChangeOtp?: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ showOtp, onChangeOtp }) => {
    const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [animateIndex, setAnimateIndex] = useState<number | null>(null);

    const handleChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otpDigits];
        newOtp[index] = value;
        setOtpDigits(newOtp);

        // Trigger animation for the current index
        setAnimateIndex(index);
        setTimeout(() => setAnimateIndex(null), 150); // Reset animation after 150ms

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }

        if (onChangeOtp) {
            onChangeOtp(newOtp.join(''));
        }
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData.getData('Text').slice(0, 4);
        if (/^\d{4}$/.test(pasted)) {
            const digits = pasted.split('');
            setOtpDigits(digits);
            digits.forEach((digit, idx) => {
                if (inputRefs.current[idx]) {
                    inputRefs.current[idx]!.value = digit;
                }
            });
            inputRefs.current[3]?.focus();
            if (onChangeOtp) onChangeOtp(pasted);
        }
        e.preventDefault();
    };

    useEffect(() => {
        if (showOtp) {
            inputRefs.current[0]?.focus();
        }
    }, [showOtp]);

    return showOtp ? (
        <div>
            <Label className="block mb-2">
                Enter OTP <span className="text-error-500">*</span>
            </Label>
            <div className="flex gap-3">
                {otpDigits.map((digit, index) => (
                    <Input
                        key={index}
                        type="text"
                        variant="otp"
                         value={digit ? '*' : ''}
                        onChange={(e) => handleChange(e.target.value, index)}
                        className={`${animateIndex === index ? 'animate-ping-fast' : ''}`} 
                        inputProps={{
                            inputMode: 'numeric',
                            maxLength: 1,
                            onKeyDown: (e) => handleKeyDown(e, index),
                            onPaste: handlePaste,
                        }}
                        ref={(el) => {
                            inputRefs.current[index] = el;
                        }}
                    />


                ))}
            </div>
        </div>
    ) : null;
};

export default OTPInput;
