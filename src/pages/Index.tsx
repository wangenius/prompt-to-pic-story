import { useState } from 'react';
import { Card } from '@/components/ui/card';
import RequirementForm from '@/components/RequirementForm';
import NotesDisplay from '@/components/NotesDisplay';
import { Sparkles, Zap, Target } from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';

interface SubmittedData {
  requirement: string;
  noteCount: number;
  images: File[];
}

const Index = () => {
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);

  const handleFormSubmit = (data: SubmittedData) => {
    setSubmittedData(data);
  };

  const handleBack = () => {
    setSubmittedData(null);
  };

  if (submittedData) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8">
          <NotesDisplay
            requirement={submittedData.requirement}
            noteCount={submittedData.noteCount}
            images={submittedData.images}
            onBack={handleBack}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div 
        className="relative py-20 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(262, 83%, 58%, 0.9), rgba(262, 100%, 75%, 0.7)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="animate-float">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                智能需求分析器
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                输入您的产品需求，选择生成数量，上传产品图片
                <br />
                <span className="text-2xl font-semibold">AI 为您生成小红书图文笔记</span>
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="h-6 w-6" />
                  <h3 className="font-semibold">精准分析</h3>
                </div>
                <p className="text-sm text-white/80">0-30份笔记定制</p>
              </Card>
              
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="h-6 w-6" />
                  <h3 className="font-semibold">快速生成</h3>
                </div>
                <p className="text-sm text-white/80">秒级响应，即时输出</p>
              </Card>
              
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="h-6 w-6" />
                  <h3 className="font-semibold">智能洞察</h3>
                </div>
                <p className="text-sm text-white/80">小红书风格笔记</p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              开始您的需求分析
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