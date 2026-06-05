import { useState, useEffect } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import agent from "../../../api/agent";

interface SecureAttachmentProps {
    file: any;
    isMine: boolean;
}

const mediaFileExtensions = ['.gif', '.png', '.jpg', '.jpeg', '.webp'];

export const SecureAttachment = ({ file, isMine }: SecureAttachmentProps) => {
    const [blobUrl, setBlobUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string>("");

    const parsedFile = typeof file === "string" ? (() => {
        try { return JSON.parse(file); } 
        catch { return null; }
    })() : file;

    const attachmentId = parsedFile?.attachmentId || parsedFile?.AttachmentId || parsedFile?._id || "NULL";
    const fileName = parsedFile?.name || parsedFile?.Name || "Прикріплений файл";
    const fileContentType = parsedFile?.contentType || parsedFile?.ContentType || "application/octet-stream";
    const fileSize = parsedFile?.size || parsedFile?.Size || 0;
    
    let rawUrl = parsedFile?.url || parsedFile?.Url || "";
    if (!rawUrl && attachmentId !== "NULL" && attachmentId !== "00000000-0000-0000-0000-000000000000") {
        rawUrl = `/api/v1/media/download/${attachmentId.replace(/-/g, "").toLowerCase()}`;
    }

    const isImage = fileContentType.startsWith("image/") || 
                    mediaFileExtensions.some(ext => fileName.toLowerCase().endsWith(ext));

    useEffect(() => {
        let url = "";
        if (!rawUrl) {
        setErrorMsg("Не вдалося визначити URL файлу.");
        setLoading(false);
        return;
        }

    const fetchFileBytes = async () => {
        try {
            const fileId = rawUrl.split("/").pop();
            if (!fileId) return;
            const blob = await agent.Media.download(fileId);
            url = URL.createObjectURL(blob);
            setBlobUrl(url);
        } catch (err: any) {
            setErrorMsg(`Помилка: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    fetchFileBytes();
    return () => { if (url) URL.revokeObjectURL(url); };
    }, [rawUrl]);

    if (loading) {
        return (
        <div className="flex items-center gap-2 p-2 text-xs font-semibold opacity-60">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#348F96]" />
            <span>Отримання файлу...</span>
        </div>
        );
    }

    if (!rawUrl || !blobUrl) {
        return (
        <div className="text-[10px] text-red-500 font-bold p-2.5 border border-red-200 rounded-xl bg-red-50 mt-1 max-w-sm break-all">
            ❌ {errorMsg} <br/>
            <span className="font-mono text-gray-400 font-normal text-[9px] mt-0.5 block">
            ID: {attachmentId}
            </span>
        </div>
        );
    }

    return isImage ? (
        <div className="rounded-xl overflow-hidden border border-white/10 max-w-sm shadow-sm bg-black/5 mt-1 animate-in fade-in duration-200">
        <img src={blobUrl} alt={fileName} className="max-w-full h-auto object-cover max-h-64" />
        </div>
    ) : (
        <div className={`flex items-center justify-between gap-4 p-2.5 rounded-xl border text-left mt-1 animate-in fade-in duration-200 ${
        isMine ? "bg-white/10 border-white/20 text-white" : "bg-gray-50 border-gray-100 text-slate-800"
        }`}>
        <div className="flex items-center gap-2 min-w-0">
            <FileText className={`w-4 h-4 flex-shrink-0 ${isMine ? "text-white/80" : "text-[#348F96]"}`} />
            <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs truncate max-w-[150px]">{fileName}</span>
            <span className={`text-[9px] uppercase font-black tracking-wider ${isMine ? "text-white/60" : "text-gray-400"}`}>
                {fileContentType.split("/")[1] || "FILE"} • {(fileSize / 1024).toFixed(1)} KB
            </span>
            </div>
        </div>
        <a href={blobUrl} download={fileName} className={`p-1.5 rounded-lg transition-colors ${isMine ? "hover:bg-white/20 text-white" : "hover:bg-gray-200 text-slate-500"}`}>
            <Download className="w-3.5 h-3.5" />
        </a>
        </div>
    );
};