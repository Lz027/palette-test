import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, FolderOpen, Upload, File, FileText, Image, Film, Music, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface StoredFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

interface FileStorageToolProps {
  boardId: string;
  onClose: () => void;
}

const STORAGE_KEY = 'palette_files_';

export const FileStorageTool = ({ boardId, onClose }: FileStorageToolProps) => {
  const [files, setFiles] = useState<StoredFile[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY + boardId);
    return stored ? JSON.parse(stored) : [];
  });
  const [dragActive, setDragActive] = useState(false);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Film;
    if (type.startsWith('audio/')) return Music;
    if (type.includes('pdf')) return FileText;
    return File;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const fileRecords: StoredFile[] = newFiles.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    }));

    const updated = [...files, ...fileRecords];
    setFiles(updated);
    localStorage.setItem(STORAGE_KEY + boardId, JSON.stringify(updated));
    toast.success(`${newFiles.length} file(s) added`);
  };

  const removeFile = (id: string) => {
    const updated = files.filter(f => f.id !== id);
    setFiles(updated);
    localStorage.setItem(STORAGE_KEY + boardId, JSON.stringify(updated));
    toast.success('File removed');
  };

  return (
    <div className="flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <FolderOpen className="w-4 h-4 text-blue-500" />
          </div>
          <span className="font-semibold">File Storage</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {files.length} files
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto">
        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          )}
        >
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <p className="font-medium">Drop files here or click to upload</p>
              <p className="text-xs text-muted-foreground">Supports all file types</p>
            </div>
          </label>
        </div>

        {/* File List */}
        {files.length > 0 ? (
          <div className="space-y-2">
            {files.map((file) => {
              const Icon = getFileIcon(file.type);
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl hover:bg-muted/80 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeFile(file.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No files yet</p>
            <p className="text-xs">Upload files to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};