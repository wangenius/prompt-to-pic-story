import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Share2, BookOpen, Target, Lightbulb, CheckCircle2 } from 'lucide-react';

interface NotesDisplayProps {
  requirement: string;
  noteCount: number;
  images: File[];
  onBack: () => void;
}

const generateNoteContent = (requirement: string, noteCount: number) => {
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

export default function NotesDisplay({ requirement, noteCount, images, onBack }: NotesDisplayProps) {
  const sections = generateNoteContent(requirement, noteCount);

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
          基于您的需求，我们为您生成了 {noteCount} 份小红书风格的图文笔记
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

      {/* 笔记数量概览 */}
      <Card className="p-6 bg-gradient-card backdrop-blur-sm border-primary/20 shadow-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          生成笔记概览
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-background/50 rounded-lg border border-primary/10">
            <div className="text-2xl font-bold text-primary">{noteCount}</div>
            <div className="text-sm text-muted-foreground">图文笔记</div>
          </div>
          <div className="text-center p-4 bg-background/50 rounded-lg border border-primary/10">
            <div className="text-2xl font-bold text-primary">{images.length}</div>
            <div className="text-sm text-muted-foreground">产品图片</div>
          </div>
          <div className="text-center p-4 bg-background/50 rounded-lg border border-primary/10">
            <div className="text-2xl font-bold text-primary">{Math.ceil(noteCount / 7)}</div>
            <div className="text-sm text-muted-foreground">发布周期(周)</div>
          </div>
          <div className="text-center p-4 bg-background/50 rounded-lg border border-primary/10">
            <div className="text-2xl font-bold text-primary">小红书</div>
            <div className="text-sm text-muted-foreground">平台风格</div>
          </div>
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
                      将为您生成 {noteCount} 份小红书风格的图文笔记，涵盖产品特色、使用场景、用户体验等多个维度。
                    </p>
                  </div>
                )}
                
                {index === 1 && (
                  <div className="grid gap-3">
                    {['产品卖点', '使用场景', '用户反馈'].map((topic, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-3 bg-background/50 rounded-lg p-3 border border-primary/10">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm">{topic}笔记 ({Math.ceil(noteCount / 3)} 份)</span>
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
            基于您提供的需求描述和 {images.length} 张产品图片，
            我们将生成 {noteCount} 份精美的小红书图文笔记。每份笔记都将包含吸引人的标题、精心设计的配图和引人入胜的文案。
          </p>
        </div>
      </Card>
    </div>
  );
}