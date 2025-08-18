import { useState } from "react";
import { Card } from "@/components/ui/card";
import RequirementForm from "@/components/RequirementForm";
import NotesDisplay from "@/components/NotesDisplay";
import { Sparkles, Zap, Target } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

interface SubmittedData {
  requirement: string;
  noteCount: number;
  images: File[];
  selectedSection: string;
}

const Index = () => {
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(
    null
  );

  const handleFormSubmit = (data: SubmittedData) => {
    setSubmittedData(data);
  };

  const handleBack = () => {
    setSubmittedData(null);
  };

  if (submittedData) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <NotesDisplay
          requirement={submittedData.requirement}
          noteCount={submittedData.noteCount}
          images={submittedData.images}
          selectedSection={submittedData.selectedSection}
          onBack={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              小红书图文笔记生成器
            </h2>
            <p className="text-lg text-muted-foreground">
              只需三步，即可获得精美的小红书图文笔记
            </p>
          </div>

          <RequirementForm onSubmit={handleFormSubmit} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>© 2024 智能需求分析器 - 让产品规划更简单</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
