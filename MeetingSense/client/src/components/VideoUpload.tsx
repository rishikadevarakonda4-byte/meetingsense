import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { CloudUpload, Video, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface VideoUploadProps {
  onDocumentCreated: (documentId: string) => void;
}

export default function VideoUpload({ onDocumentCreated }: VideoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', file.name);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Upload successful",
        description: "Your video has been uploaded and processing has started.",
      });
      onDocumentCreated(data.document?.id || data.id);
      setSelectedFile(null);
      setUploadProgress(0);
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Validate file size (500MB limit)
      if (file.size > 500 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 500MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/x-msvideo': ['.avi'],
    },
    multiple: false,
  });

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card data-testid="card-upload">
      <CardHeader>
        <CardTitle className="flex items-center text-pwc-navy">
          <CloudUpload className="text-pwc-orange mr-2 h-5 w-5" />
          Upload Meeting Video
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-pwc-orange bg-orange-50"
              : "border-gray-300 hover:border-pwc-orange"
          }`}
          data-testid="dropzone-upload"
        >
          <input {...getInputProps()} data-testid="input-file" />
          <CloudUpload className="mx-auto h-12 w-12 text-pwc-gray mb-4" />
          <p className="text-lg font-medium text-pwc-navy mb-2">
            Drag and drop your video file here
          </p>
          <p className="text-pwc-gray mb-4">or click to browse files</p>
          <Button 
            variant="outline" 
            className="bg-pwc-orange text-white hover:bg-pwc-orange/90 border-pwc-orange"
            data-testid="button-select-file"
          >
            Select Video File
          </Button>
          <p className="text-xs text-pwc-gray mt-3">Maximum file size: 500MB</p>
        </div>

        {uploadMutation.isPending && (
          <div className="space-y-2" data-testid="upload-progress">
            <div className="flex items-center justify-between">
              <span className="text-sm text-pwc-gray">Uploading video...</span>
              <span className="text-sm text-pwc-gray">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {selectedFile && !uploadMutation.isPending && (
          <div className="p-4 bg-gray-50 rounded-md" data-testid="file-info">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Video className="text-pwc-blue mr-2 h-5 w-5" />
                <div>
                  <p className="font-medium text-pwc-navy" data-testid="text-filename">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-pwc-gray" data-testid="text-filesize">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleUpload}
                  className="bg-pwc-orange text-white hover:bg-pwc-orange/90"
                  data-testid="button-upload"
                >
                  Upload
                </Button>
                <Button
                  onClick={removeFile}
                  variant="outline"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  data-testid="button-remove-file"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
