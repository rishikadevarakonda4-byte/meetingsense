import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Mail, Link, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Document } from "@shared/schema";

interface DocumentActionsProps {
  documentId: string;
}

export default function DocumentActions({ documentId }: DocumentActionsProps) {
  const { toast } = useToast();
  const { data: document } = useQuery<Document>({
    queryKey: ['/api/documents', documentId],
  });

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download/pdf`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${document?.title || 'document'}.pdf`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download started",
        description: "Your PDF download has started.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadDOCX = async () => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download/docx`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${document?.title || 'document'}.docx`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download started",
        description: "Your DOCX download has started.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download DOCX. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareEmail = () => {
    toast({
      title: "Feature coming soon",
      description: "Email sharing will be available in a future update.",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Document link has been copied to clipboard.",
    });
  };

  const handleShareTeams = () => {
    toast({
      title: "Feature coming soon",
      description: "Teams integration will be available in a future update.",
    });
  };

  if (!document || document.status !== 'completed') {
    return (
      <Card data-testid="card-actions-disabled">
        <CardHeader>
          <CardTitle className="text-pwc-navy">Document Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-pwc-gray text-center py-8">
            Actions will be available after document processing is complete.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card data-testid="card-document-actions">
        <CardHeader>
          <CardTitle className="text-pwc-navy">Document Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={handleDownloadPDF}
              className="bg-pwc-orange text-white hover:bg-pwc-orange/90 flex items-center justify-center"
              data-testid="button-download-pdf"
            >
              <FileText className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button
              onClick={handleDownloadDOCX}
              className="bg-pwc-blue text-white hover:bg-pwc-blue/90 flex items-center justify-center"
              data-testid="button-download-docx"
            >
              <Download className="mr-2 h-4 w-4" />
              Download DOCX
            </Button>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-pwc-navy mb-3">Share Options</h4>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShareEmail}
                className="text-pwc-blue hover:text-pwc-navy"
                data-testid="button-share-email"
              >
                <Mail className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyLink}
                className="text-pwc-blue hover:text-pwc-navy"
                data-testid="button-copy-link"
              >
                <Link className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShareTeams}
                className="text-pwc-blue hover:text-pwc-navy"
                data-testid="button-share-teams"
              >
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Metrics */}
      <Card data-testid="card-document-metrics">
        <CardHeader>
          <CardTitle className="text-pwc-navy">Document Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-pwc-orange" data-testid="text-word-count">
                {document.wordCount?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-pwc-gray">Words</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600" data-testid="text-confidence-score">
                {document.confidenceScore || 0}%
              </p>
              <p className="text-sm text-pwc-gray">Confidence</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-pwc-blue" data-testid="text-requirements-count">
                {(document.brdContent as any)?.functionalRequirements?.length || 0}
              </p>
              <p className="text-sm text-pwc-gray">Requirements</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-pwc-navy" data-testid="text-processing-time">
                {document.processingTime 
                  ? `${Math.floor(document.processingTime / 60)}m ${document.processingTime % 60}s`
                  : '0s'
                }
              </p>
              <p className="text-sm text-pwc-gray">Process Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
