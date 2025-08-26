import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, RefreshCw, Expand } from "lucide-react";
import { BRDContent, Document } from "@shared/schema";

interface BRDPreviewProps {
  documentId: string;
}

export default function BRDPreview({ documentId }: BRDPreviewProps) {
  const { data: document, isLoading } = useQuery<Document>({
    queryKey: ['/api/documents', documentId],
    refetchInterval: (query) => query.state.data?.status === 'processing' ? 2000 : false,
  });

  if (isLoading || !document) {
    return (
      <Card data-testid="card-brd-loading">
        <CardHeader>
          <CardTitle className="flex items-center text-pwc-navy">
            <FileText className="text-green-600 mr-2 h-5 w-5" />
            Generated BRD
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 border rounded-lg h-96 flex items-center justify-center">
            <p className="text-pwc-gray">Document will appear here after processing...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const brdContent = document.brdContent as BRDContent | null;

  if (!brdContent) {
    return (
      <Card data-testid="card-brd-empty">
        <CardHeader>
          <CardTitle className="flex items-center text-pwc-navy">
            <FileText className="text-green-600 mr-2 h-5 w-5" />
            Generated BRD
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 border rounded-lg h-96 flex items-center justify-center">
            <p className="text-pwc-gray">Processing in progress...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-brd-preview">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-pwc-navy">
            <FileText className="text-green-600 mr-2 h-5 w-5" />
            Generated BRD
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-pwc-blue hover:text-pwc-navy"
              data-testid="button-refresh-preview"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-pwc-blue hover:text-pwc-navy"
              data-testid="button-fullscreen"
            >
              <Expand className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="bg-gray-50 border rounded-lg h-96 p-4" data-testid="brd-content">
          <div className="space-y-4 text-sm">
            {/* Document Title */}
            <div className="text-center border-b pb-4 mb-4">
              <h1 className="text-xl font-bold text-pwc-navy" data-testid="text-brd-title">
                {brdContent.title}
              </h1>
              <p className="text-pwc-gray mt-1" data-testid="text-brd-subtitle">
                {brdContent.subtitle}
              </p>
            </div>

            {/* Table of Contents */}
            <div className="mb-6">
              <h2 className="font-semibold text-pwc-navy mb-2">Table of Contents</h2>
              <ul className="space-y-1 text-pwc-gray">
                <li className="flex justify-between">
                  <span>1. Project Overview</span>
                  <span>2</span>
                </li>
                <li className="flex justify-between">
                  <span>2. Business Objectives</span>
                  <span>3</span>
                </li>
                <li className="flex justify-between">
                  <span>3. Scope & Deliverables</span>
                  <span>4</span>
                </li>
                <li className="flex justify-between">
                  <span>4. Functional Requirements</span>
                  <span>5</span>
                </li>
                <li className="flex justify-between">
                  <span>5. Non-Functional Requirements</span>
                  <span>7</span>
                </li>
                <li className="flex justify-between">
                  <span>6. Stakeholders</span>
                  <span>8</span>
                </li>
                <li className="flex justify-between">
                  <span>7. Constraints & Assumptions</span>
                  <span>9</span>
                </li>
              </ul>
            </div>

            {/* Content Sections */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-pwc-navy mb-2">1. Project Overview</h3>
                <p className="text-pwc-gray leading-relaxed" data-testid="text-project-overview">
                  {brdContent.projectOverview}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-pwc-navy mb-2">2. Business Objectives</h3>
                <ul className="list-disc pl-5 space-y-1 text-pwc-gray">
                  {brdContent.businessObjectives.map((objective, index) => (
                    <li key={index} data-testid={`text-objective-${index}`}>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-pwc-navy mb-2">3. Functional Requirements</h3>
                <div className="space-y-2">
                  {brdContent.functionalRequirements.slice(0, 3).map((req) => (
                    <div
                      key={req.id}
                      className={`p-3 rounded border-l-4 ${
                        req.priority === 'high'
                          ? 'bg-red-50 border-red-500'
                          : req.priority === 'medium'
                          ? 'bg-blue-50 border-pwc-blue'
                          : 'bg-green-50 border-green-500'
                      }`}
                      data-testid={`requirement-${req.id}`}
                    >
                      <p className="font-medium text-pwc-navy">
                        {req.id}: {req.title}
                      </p>
                      <p className="text-sm text-pwc-gray">{req.description}</p>
                    </div>
                  ))}
                  {brdContent.functionalRequirements.length > 3 && (
                    <p className="text-sm text-pwc-gray italic">
                      ... and {brdContent.functionalRequirements.length - 3} more requirements
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
