import { Button } from "./button";


interface ConfirmModalProps {
    isOpen: boolean;
    onSelect: (answer: boolean) => void;
    title: string;
    details: string;
}

export const ConfirmModal = ({isOpen, onSelect, title, details }: ConfirmModalProps) => {
    
    if (!isOpen) return;

    return (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-black/10 p-8'>
            <div className='w-full max-w-2xl rounded-xl bg-linear-[135deg] from-[#64B59D] via-[#348F96] to-[#2D6BA3] overflow-hidden p-[3px]'>
                <div className='bg-white rounded-lg p-4'>
                    <h2 className="text-3xl font-semibold text-[#111] tracking-tight leading-tight mt-2 mb-4">
                        { title }
                    </h2>
                    <p className="text-md mb-4">
                        { details }
                    </p>
                    <div className="flex items-center justify-end gap-1">
                        <Button 
                            className="p-5 bg-[#64B59D] cursor-pointer hover:bg-[#348F96] text-md"
                            onClick={() => onSelect(false)}
                            >
                            Скасувати
                        </Button>
                        <Button 
                            className={`p-5 bg-[#B54141] cursor-pointer hover:bg-[#A32D2D] text-md`}
                            onClick={() => onSelect(true)}
                            >
                            Так
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
};