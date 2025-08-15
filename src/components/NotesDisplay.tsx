import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Share2, BookOpen, Target, Lightbulb, CheckCircle2 } from 'lucide-react';

interface NotesDisplayProps {
  requirement: string;
  selectedOptions: string[];
  images: File[];
  onBack: () => void;
}

const generateNoteContent = (requirement: string, options: string[]) => {
  const sections = [
    {
      title: "需求概述",
      icon: Target,
      content: `基于您的需求描述："${requirement.slice(0, 100)}..."，我们进行了全面的分析。`
    },
    {
      title: "核心要点",
      icon: Lightbulb,
      content: "通过对您选择的分析维度进行深入研究，我们识别出以下关键要素需要重点关注。"
    },
    {
      title: "实施建议",
      icon: CheckCircle2,
      content: "结合行业最佳实践和您的具体需求，我们制定了分阶段的实施路径。"
    }
  ];

  return sections;
};

export default function NotesDisplay({ requirement, selectedOptions, images, onBack }: NotesDisplayProps) {
  const sections = generateNoteContent(requirement, selectedOptions);

  const handleDownload = () => {
    // 这里可以实现下载功能
    console.log('下载笔记');
  };

  const handleShare = () => {
    // 这里可以实现分享功能
    console.log('分享笔记');
  };

  return (
    <div className="space-y-8">
      {/* 标题区域 */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-primary rounded-xl animate-pulse-glow">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            智能分析报告
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          基于您的需求和选择的 {selectedOptions.length} 个分析维度，我们为您生成了详细的图文笔记
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-primary/40 hover:bg-primary/10"
        >
          返回编辑
        </Button>
        <Button
          onClick={handleDownload}
          className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
        >
          <Download className="h-4 w-4 mr-2" />
          下载报告
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          className="border-primary/40 hover:bg-primary/10"
        >
          <Share2 className="h-4 w-4 mr-2" />
          分享报告
        </Button>
      </div>

      {/* 分析维度概览 */}
      <Card className="p-6 bg-gradient-card backdrop-blur-sm border-primary/20 shadow-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          已选择的分析维度
        </h3>
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((option, index) => (
            <Badge
              key={index}
              className="bg-gradient-primary text-primary-foreground animate-float"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {option}
            </Badge>
          ))}
        </div>
      </Card>

      {/* 产品图片展示 */}
      {images.length > 0 && (
        <Card className="p-6 bg-gradient-card backdrop-blur-sm border-primary/20 shadow-card">
          <h3 className="text-lg font-semibold mb-4">产品图片</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Product ${index + 1}`}
                  className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 分析报告内容 */}
      <div className="grid gap-6">
        {sections.map((section, index) => (
          <Card
            key={index}
            className="p-8 bg-gradient-card backdrop-blur-sm border-primary/20 shadow-card hover:shadow-elegant transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-primary rounded-lg shrink-0">
                <section.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{section.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
                
                {/* 根据不同部分生成相关内容 */}
                {index === 0 && (
                  <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
                    <h4 className="font-medium mb-2">需求分析摘要</h4>
                    <p className="text-sm text-muted-foreground">
                      您的需求涉及 {selectedOptions.length} 个关键领域，我们将从技术可行性、用户体验、市场需求等多个角度进行深入分析。
                    </p>
                  </div>
                )}
                
                {index === 1 && (
                  <div className="grid gap-3">
                    {selectedOptions.slice(0, 3).map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-3 bg-background/50 rounded-lg p-3 border border-primary/10">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm">{option}分析</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {index === 2 && (
                  <div className="space-y-3">
                    <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="font-medium text-sm">第一阶段：基础架构</span>
                      </div>
                      <p className="text-sm text-muted-foreground">建立核心功能模块和基础设施</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-primary-glow rounded-full"></div>
                        <span className="font-medium text-sm">第二阶段：功能完善</span>
                      </div>
                      <p className="text-sm text-muted-foreground">实现高级功能和用户体验优化</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 总结卡片 */}
      <Card className="p-8 bg-gradient-primary text-primary-foreground shadow-glow">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">分析完成</h3>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto">
            基于您提供的需求描述、{selectedOptions.length} 个分析维度和 {images.length} 张产品图片，
            我们生成了这份全面的分析报告。希望这些洞察能够帮助您更好地规划和实施您的项目。
          </p>
        </div>
      </Card>
    </div>
  );
}