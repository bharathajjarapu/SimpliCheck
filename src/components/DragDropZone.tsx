import { cn } from "@/lib/utils";
import { useState } from "react";
import { ImageIcon, FileCode } from "lucide-react";

interface DragDropZoneProps {
  onDrop: (file: File) => void;
  type: "image" | "code";
  label: string;
  className?: string;
}

export function DragDropZone({ onDrop, type, label, className }: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onDrop(file);
    }
  };

  const Icon = type === "image" ? ImageIcon : FileCode;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-lg transition-all duration-300",
        isDragging && "scale-105 border-primary bg-primary/5",
        !isDragging && "hover:border-primary/50",
        className
      )}
    >
      {type === "code" ? (
        <>
          <FileCode className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">Drop any file here or click to upload</p>
          <p className="text-xs text-muted-foreground">
            Max file size: 10MB
          </p>
        </>
      ) : (
        <>
          <Icon className={cn(
            "h-8 w-8 transition-transform duration-300",
            isDragging && "scale-110 text-primary",
            !isDragging && "text-muted-foreground"
          )} />
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-primary cursor-pointer">
              {label}
            </span>
            <p className="text-xs text-muted-foreground">
              {type === "image" ? "Max file size: 5MB" : "Max file size: 10MB"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}