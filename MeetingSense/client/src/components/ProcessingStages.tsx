import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Check, Loader2, RotateCcw, Play } from "lucide-react";
import { Document } from "@shared/schema";

interface ProcessingStagesProps {
  documentId: string;
}

export default function ProcessingStages({ documentId }: ProcessingStagesProps) {
  const { data: document, isLoading } = useQuery<Document>({
    queryKey: ['/api/documents', documentId],
    refetchInterval: (query) => query.state.data?.status === 'processing' ? 2000 : false,
  });

  if (isLoading) {
    return (
      <Card data-testid="card-processing-loading">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!document) {
    return null;
  }

  const stages = [
    {
      id: 'audio_extraction',
      title: 'Audio Extraction',
      description: 'Extract audio track from video',
    },
    {
      id: 'transcription',
      title: 'Speech-to-Text',
      description: 'Convert audio to text using Whisper AI',
    },
    {
      id: 'nlp_analysis',
      title: 'NLP Analysis',
      description: 'Extract requirements using Gemini 2.5',
    },
    {
      id: 'brd_generation',
      title: 'BRD Generation',
      description: 'Structure and format final document',
    },
  ];

  const getStageStatus = (stageId: string) => {
    const currentStage = document.processingStage;
    const stageIndex = stages.findIndex(s => s.id === stageId);
    const currentIndex = stages.findIndex(s => s.id === currentStage);

    if (document.status === 'completed') {
      return 'completed';
    }
    if (document.status === 'failed') {
      return stageIndex <= currentIndex ? 'failed' : 'pending';
    }
    if (stageIndex < currentIndex) {
      return 'completed';
    }
    if (stageIndex === currentIndex) {
      return 'processing';
    }
    return 'pending';
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="text-green-600 h-4 w-4" />;
      case 'processing':
        return <Loader2 className="text-white h-4 w-4 animate-spin" />;
      case 'failed':
        return <span className="text-red-500 text-sm font-bold">✕</span>;
      default:
        return <span className="text-gray-400 text-sm font-bold">{stages.findIndex(s => getStageStatus(s.id) === status) + 1}</span>;
    }
  };

  const getStageCircleClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3';
      case 'processing':
        return 'w-8 h-8 rounded-full bg-pwc-orange flex items-center justify-center mr-3';
      case 'failed':
        return 'w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3';
      default:
        return 'w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3';
    }
  };

  return (
    <div className="space-y-6">
      <Card data-testid="card-processing-stages">
        <CardHeader>
          <CardTitle className="flex items-center text-pwc-navy">
            <Settings className="text-pwc-blue mr-2 h-5 w-5" />
            Processing Stages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stages.map((stage) => {
              const status = getStageStatus(stage.id);
              return (
                <div 
                  key={stage.id} 
                  className="flex items-center"
                  data-testid={`stage-${stage.id}`}
                >
                  <div className={getStageCircleClass(status)}>
                    {getStageIcon(status)}
                  </div>
                  <div>
                    <p className={`font-medium ${status === 'pending' ? 'text-pwc-gray' : 'text-pwc-navy'}`}>
                      {stage.title}
                    </p>
                    <p className="text-sm text-pwc-gray">{stage.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        <Button
          className="bg-pwc-orange text-white hover:bg-pwc-orange/90 flex-1"
          disabled={document.status === 'processing'}
          data-testid="button-start-processing"
        >
          <Play className="mr-2 h-4 w-4" />
          {document.status === 'processing' ? 'Processing...' : 'Start Processing'}
        </Button>
        <Button
          variant="outline"
          className="border-pwc-gray text-pwc-gray hover:bg-gray-50"
          data-testid="button-reset"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
