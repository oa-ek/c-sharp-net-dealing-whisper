import React, { useState, forwardRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface MarkdownInputProps {
    value: string;
    onChange: (val: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    disabled?: boolean;
}

export const MarkdownInput = forwardRef<HTMLTextAreaElement, MarkdownInputProps>(
    ({ value, onChange, onKeyDown, placeholder, disabled }, ref) => {
        const [isExpanded, setIsExpanded] = useState(false);

        return (
        <div className="flex-1 flex gap-1 items-end relative min-w-0">
            <TextareaAutosize 
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            minRows={1}
            // Якщо режим розширений — ліміт рядків стає більшим
            maxRows={isExpanded ? 12 : 4}
            className="flex-1 resize-none border-none bg-transparent focus:outline-none focus:ring-0 text-[#111] placeholder:text-gray-400 font-medium text-sm py-2 pl-3 pr-10 max-h-56 overflow-y-auto leading-relaxed" 
            placeholder={placeholder} 
            disabled={disabled}
            />

            {/* Кнопка розширення/згортання поля */}
            <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute right-1 bottom-1 h-7 w-7 text-gray-400 hover:text-[#348F96] rounded-lg transition-colors z-10"
            title={isExpanded ? "Зменшити поле" : "Розширити поле"}
            >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
        </div>
        );
    }
);

MarkdownInput.displayName = "MarkdownInput";