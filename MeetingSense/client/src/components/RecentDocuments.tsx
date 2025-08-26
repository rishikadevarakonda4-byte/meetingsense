import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, History, Download, Eye } from "lucide-react";
import { formatDistance } from "date-fns";
import { Document } from "@shared/schema";

export default function RecentDocuments() {
  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });

  if (isLoading) {
    return (
      <Card className="mt-12" data-testid="card-recent-loading">
        <CardContent className="flex items-center justify-center p-8">
          <p className="text-pwc-gray">Loading recent documents...</p>
        </CardContent>
      </Card>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <Card className="mt-12" data-testid="card-recent-empty">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-pwc-navy">
              <History className="text-pwc-blue mr-2 h-5 w-5" />
              Recent Documents
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-pwc-gray text-center py-8">
            No documents found. Upload your first video to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleDownload = async (documentId: string, format: 'pdf' | 'docx', title: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download/${format}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <Card className="mt-12" data-testid="card-recent-documents">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-pwc-navy">
            <History className="text-pwc-blue mr-2 h-5 w-5" />
            Recent Documents
          </CardTitle>
          <Button
            variant="ghost"
            className="text-pwc-blue hover:text-pwc-navy text-sm font-medium"
            data-testid="button-view-all"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc: any) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid={`document-${doc.id}`}
            >
              <div className="flex items-center">
                <FileText className="text-green-600 mr-3 h-5 w-5" />
                <div>
                  <p className="font-medium text-pwc-navy" data-testid={`text-title-${doc.id}`}>
                    {doc.title}
                  </p>
                  <p className="text-sm text-pwc-gray" data-testid={`text-details-${doc.id}`}>
                    {doc.status === 'completed' ? 'Generated' : 'Processing'} {' '}
                    {doc.createdAt && formatDistance(new Date(doc.createdAt), new Date(), { addSuffix: true })}
                    {doc.wordCount && ` • ${doc.wordCount.toLocaleString()} words`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {doc.status === 'completed' && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(doc.id, 'pdf', doc.title)}
                      className="text-pwc-blue hover:text-pwc-navy"
                      data-testid={`button-download-${doc.id}`}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-pwc-blue hover:text-pwc-navy"
                      data-testid={`button-view-${doc.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {doc.status !== 'completed' && (
                  <span className="text-sm text-pwc-gray px-2 py-1 bg-gray-100 rounded">
                    {doc.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
