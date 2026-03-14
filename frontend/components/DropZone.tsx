"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { extractText, getFileType } from "@/lib/ocr";

interface DropZoneProps {
  label: string;
  fileTag: string;
  dotColor: string;
  onTextExtracted: (text: string) => void;
  existingText: string;
}

type ScanState = "idle" | "scanning" | "done" | "error";

const ACCEPTED = ".pdf,.png,.jpg,.jpeg,.webp,.bmp,.tiff,.tif,.txt,.md";

const FILE_ICONS: Record<string, string> = {
  pdf: "PDF",
  image: "IMG",
  text: "TXT",
  unsupported: "???",
};

export default function DropZone({
  label,
  fileTag,
  dotColor,
  onTextExtracted,
  existingText,
}: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");
  const [scanLog, setScanLog] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((line: string) => {
    setScanLog((prev) => [...prev, line]);
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [scanLog]);

  const processFile = useCallback(
    async (file: File) => {
      const type = getFileType(file);
      if (type === "unsupported") {
        setErrorMsg("Unsupported file. Use PDF, PNG, JPG, or TXT.");
        return;
      }

      setFileName(file.name);
      setFileType(FILE_ICONS[type]);
      setScanState("scanning");
      setProgress(0);
      setScanLog([]);
      setErrorMsg("");

      addLog(`> File detected: ${file.name}`);
      addLog(`> Type: ${type.toUpperCase()} (${(file.size / 1024).toFixed(1)} KB)`);

      if (type === "pdf") {
        addLog("> Loading PDF parser...");
        addLog("> Extracting text layer...");
      } else if (type === "image") {
        addLog("> Initializing Tesseract OCR engine...");
        addLog("> Loading English language pack...");
        addLog("> Running character recognition...");
      } else {
        addLog("> Reading plain text...");
      }

      try {
        const text = await extractText(file, (pct) => {
          setProgress(pct);
          if (pct === 50) addLog("> 50% — processing...");
          if (pct === 80) addLog("> 80% — finalizing...");
        });

        if (!text || text.trim().length < 30) {
          throw new Error("Extracted text is too short. Try a clearer scan.");
        }

        const wordCount = text.trim().split(/\s+/).length;
        addLog(`> Extracted ${wordCount} words successfully.`);
        addLog(`> Text ready for NLP analysis.`);
        setProgress(100);
        setScanState("done");
        onTextExtracted(text);
      } catch (err: any) {
        addLog(`> ERROR: ${err.message || "Extraction failed."}`);
        setScanState("error");
        setErrorMsg(err.message || "Extraction failed. Please try another file.");
      }
    },
    [addLog, onTextExtracted]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = "";
    },
    [processFile]
  );

  const handleReset = useCallback(() => {
    setScanState("idle");
    setProgress(0);
    setFileName("");
    setFileType("");
    setScanLog([]);
    setErrorMsg("");
  }, []);

  const isDone = scanState === "done";
  const isScanning = scanState === "scanning";
  const isError = scanState === "error";

  return (
    <div className="mt-3">
      {/* Drop zone area */}
      {scanState === "idle" ? (
        <div
          className={`relative border transition-all duration-200 cursor-pointer group ${
            dragging
              ? "border-accent bg-accent/5"
              : "border-dashed border-border hover:border-accent/50 hover:bg-accent/[0.02]"
          }`}
          style={{ minHeight: 80 }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center justify-center py-5 px-4 gap-2">
            {/* Upload icon */}
            <div
              className={`w-8 h-8 border flex items-center justify-center transition-colors ${
                dragging ? "border-accent" : "border-border group-hover:border-accent/50"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 11V3M8 3L5 6M8 3L11 6"
                  stroke={dragging ? "#00E5FF" : "#4B5563"}
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 13H14"
                  stroke={dragging ? "#00E5FF" : "#4B5563"}
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="text-center">
              <p
                className={`font-mono text-xs transition-colors ${
                  dragging ? "text-accent" : "text-muted group-hover:text-dim"
                }`}
              >
                {dragging ? "Release to scan" : "Drag & drop or click to upload"}
              </p>
              <p className="font-mono text-[10px] text-muted mt-0.5">
                PDF, PNG, JPG, TXT supported
              </p>
            </div>
          </div>

          {/* Corner brackets on hover */}
          {dragging && (
            <>
              <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent" />
              <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-accent" />
              <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-accent" />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent" />
            </>
          )}
        </div>
      ) : (
        /* Scanning / Done / Error panel */
        <div className="border border-border bg-surface overflow-hidden">
          {/* File header */}
          <div className="flex items-center gap-3 px-3 py-2 border-b border-border bg-bg/60">
            <span
              className="font-mono text-[10px] px-1.5 py-0.5 border"
              style={{
                color: isDone ? "#10B981" : isError ? "#EF4444" : "#F59E0B",
                borderColor: isDone ? "#10B98140" : isError ? "#EF444440" : "#F59E0B40",
                background: isDone ? "#10B98110" : isError ? "#EF444410" : "#F59E0B10",
              }}
            >
              {fileType}
            </span>
            <span className="font-mono text-xs text-dim truncate flex-1">{fileName}</span>
            <button
              className="font-mono text-[10px] text-muted hover:text-danger transition-colors tracking-wider"
              onClick={handleReset}
            >
              CLEAR
            </button>
          </div>

          {/* Terminal log */}
          <div
            ref={logRef}
            className="px-3 py-2 space-y-0.5 overflow-y-auto"
            style={{ maxHeight: 100, minHeight: 60 }}
          >
            {scanLog.map((line, i) => (
              <div
                key={i}
                className="font-mono text-[11px] leading-relaxed"
                style={{ color: line.startsWith("> ERROR") ? "#EF4444" : "#10B981" }}
              >
                {line}
              </div>
            ))}
            {isScanning && (
              <span className="font-mono text-[11px] text-accent cursor" />
            )}
          </div>

          {/* Progress bar */}
          <div className="px-3 pb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[10px] text-muted tracking-widest">
                {isScanning ? "SCANNING" : isDone ? "COMPLETE" : "FAILED"}
              </span>
              <span
                className="font-mono text-[10px]"
                style={{
                  color: isDone ? "#10B981" : isError ? "#EF4444" : "#F59E0B",
                }}
              >
                {progress}%
              </span>
            </div>
            <div className="w-full h-px bg-border overflow-hidden">
              <div
                className="h-full transition-all duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                  background: isDone ? "#10B981" : isError ? "#EF4444" : "#00E5FF",
                  boxShadow: isDone
                    ? "0 0 6px #10B98180"
                    : isError
                    ? "0 0 6px #EF444480"
                    : "0 0 6px #00E5FF80",
                }}
              />
            </div>

            {/* Error message */}
            {isError && (
              <p className="font-mono text-[10px] text-danger mt-2">{errorMsg}</p>
            )}

            {/* Success: word count badge */}
            {isDone && existingText && (
              <div className="flex items-center justify-between mt-2">
                <span className="font-mono text-[10px] text-accent3">
                  Text loaded into editor
                </span>
                <span className="font-mono text-[10px] text-muted">
                  {existingText.trim().split(/\s+/).length} words
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
