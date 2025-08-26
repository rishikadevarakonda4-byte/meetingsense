import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoUpload from "@/components/VideoUpload";
import ProcessingStages from "@/components/ProcessingStages";
import BRDPreview from "@/components/BRDPreview";
import DocumentActions from "@/components/DocumentActions";
import RecentDocuments from "@/components/RecentDocuments";
import { Clock, Video, FileText } from "lucide-react";

export default function Home() {
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);

  return (
    <div className="bg-pwc-light font-inter min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pwc-navy mb-2" data-testid="page-title">
            Meeting Video to BRD Generator
          </h1>
          <p className="text-pwc-gray text-lg" data-testid="page-description">
            Transform your meeting recordings into structured Business Requirements Documents using AI-powered analysis.
          </p>
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200" data-testid="stat-formats">
              <div className="flex items-center">
                <Video className="text-pwc-orange text-xl mr-3 h-5 w-5" />
                <div>
                  <p className="text-sm text-pwc-gray">Supported Formats</p>
                  <p className="font-semibold text-pwc-navy">MP4, MOV, AVI</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200" data-testid="stat-time">
              <div className="flex items-center">
                <Clock className="text-pwc-blue text-xl mr-3 h-5 w-5" />
                <div>
                  <p className="text-sm text-pwc-gray">Processing Time</p>
                  <p className="font-semibold text-pwc-navy">2-5 minutes</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200" data-testid="stat-output">
              <div className="flex items-center">
                <FileText className="text-green-600 text-xl mr-3 h-5 w-5" />
                <div>
                  <p className="text-sm text-pwc-gray">Output Format</p>
                  <p className="font-semibold text-pwc-navy">PDF, DOCX</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload and Processing */}
          <div className="space-y-6">
            <VideoUpload onDocumentCreated={setCurrentDocumentId} />
            {currentDocumentId && <ProcessingStages documentId={currentDocumentId} />}
          </div>

          {/* Right Column - BRD Preview and Actions */}
          <div className="space-y-6">
            {currentDocumentId && (
              <>
                <BRDPreview documentId={currentDocumentId} />
                <DocumentActions documentId={currentDocumentId} />
              </>
            )}
          </div>
        </div>

        <RecentDocuments />
      </main>

      <Footer />
    </div>
  );
}
