import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import agent from "../../../api/agent";
import type { BinlistResponseDto } from "../../../types/binlist";
import { Loader2, CreditCard, Copy, X, Check } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface CardPreviewProps {
    cardNumber: string;
}

export const CardPreview = ({ cardNumber }: CardPreviewProps) => {
    const [data, setData] = useState<BinlistResponseDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    
    const triggerRef = useRef<HTMLButtonElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX
            });
        }

        if (isOpen) {
            setIsOpen(false);
            return;
        }

        if (data) {
            setIsOpen(true);
            return;
        }

        setLoading(true);
        try {
            const bin = cardNumber.replace(/\D/g, "").substring(0, 6);
            const res = await agent.Enrichment.getCardData(bin);
            setData(res);
            setIsOpen(true);
        } catch (err) {
            console.error("Enrichment error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(cardNumber);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <span className="inline-block relative">
            <button
                ref={triggerRef}
                onClick={handleToggle}
                className="font-mono text-white inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/30 border border-white/20 backdrop-blur-md hover:bg-black/50 transition-all shadow-sm"
            >
                <CreditCard className="w-3.5 h-3.5 text-[#64B59D]" />
                <span className="opacity-90">**** {cardNumber.slice(-4)}</span>
                {loading && <Loader2 className="ml-1 w-3.5 h-3.5 animate-spin" />}
            </button>

            {isOpen && data && createPortal(
                <div 
                    ref={cardRef}
                    className="fixed z-[9999] w-72 p-5 rounded-2xl border border-white/40 shadow-2xl backdrop-blur-2xl bg-white/90 text-slate-900 animate-in zoom-in-95 fade-in duration-200"
                    style={{ 

                        top: `${coords.top - 20}px`,
                        left: `${coords.left}px`,
                        transform: 'translateY(-100%)' 
                    }}
                >
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#64B59D]/10 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col gap-4 text-left">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="text-lg font-black tracking-tight text-slate-900">
                                    {data.bank?.name || "Unknown Bank"}
                                </span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                    {data.scheme} • {data.type}
                                </span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 rounded-md text-slate-400">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between bg-slate-100/50 p-3 rounded-xl border border-slate-200/50">
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase font-bold text-slate-400">Card Number</span>
                                <span className="text-sm font-mono tracking-widest mt-1 text-slate-700">
                                    **** **** **** {cardNumber.slice(-4)}
                                </span>
                            </div>
                            <Button 
                                onClick={handleCopy}
                                variant="ghost" 
                                size="icon" 
                                className={`h-8 w-8 rounded-lg ${isCopied ? "bg-green-100 text-green-600" : "bg-white text-slate-400 shadow-sm"}`}
                            >
                                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>

                        <div className="flex justify-between items-end pt-2 border-t border-slate-100">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] uppercase font-bold text-slate-400">Issuer Info</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-slate-600">{data.country?.name}</span>
                                    <span className="text-[10px] font-black px-1.5 py-0.5 bg-[#348F96]/10 text-[#348F96] rounded">
                                        {data.brand || "Standard"}
                                    </span>
                                </div>
                            </div>
                            <span className="text-3xl leading-none ml-1 mb-1">{data.country?.emoji}</span>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </span>
    );
};