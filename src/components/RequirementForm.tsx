import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Sparkles, CheckCircle } from 'lucide-react';

interface RequirementFormProps {
  onSubmit: (data: { requirement: string; selectedOptions: string[]; images: File[] }) => void;
}

const options = [
  "用户体验优化", "界面设计改进", "功能需求分析", "技术架构评估",
  "性能优化建议", "安全性检查", "移动端适配", "多语言支持",
  "数据分析需求", "API接口设计", "数据库优化", "缓存策略",
  "测试策略制定", "部署方案规划", "监控告警配置", "文档规范化",
  "用户权限管理", "内容管理系统", "搜索功能优化", "社交媒体集成"
];

export default function RequirementForm({ onSubmit }: RequirementFormProps) {
  const [requirement, setRequirement] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const toggleOption = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      setImages(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleSubmit = () => {
    if (requirement.trim() && selectedOptions.length > 0) {
      onSubmit({ requirement, selectedOptions, images });
    }
  };

  return (
    <div className="space-y-8">
      {/* 需求输入区域 */}
      <Card className="p-8 bg-gradient-card backdrop-blur-sm border-primary/20 shadow-card">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <Label htmlFor="requirement" className="text-lg font-semibold">
              需求描述
            </Label>
          </div>
          <Textarea
            id="requirement"
            placeholder="请详细描述您的产品需求、目标用户、期望功能等..."
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            className="min-h-32 resize-none bg-background/50 border-primary/20 focus:border-primary transition-all duration-300"
          />
        </div>
      </Card>

      {/* 选项选择区域 */}
      <Card className="p-8 bg-gradient-card backdrop-blur-sm border-primary/20 shadow-card">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <CheckCircle className="h-5 w-5 text-primary-foreground" />
            </div>
            <Label className="text-lg font-semibold">
              分析维度选择 ({selectedOptions.length}/20)
            </Label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {options.map((option) => (
              <Badge
                key={option}
                variant={selectedOptions.includes(option) ? "default" : "secondary"}
                className={`
                  cursor-pointer p-3 text-center transition-all duration-300 hover:scale-105
                  ${selectedOptions.includes(option) 
                    ? 'bg-gradient-primary text-primary-foreground shadow-glow' 
                    : 'hover:bg-primary/10 hover:border-primary/40'
                  }
                `}
                onClick={() => toggleOption(option)}
              >
                {option}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* 图片上传区域 */}
      <Card className="p-8 bg-gradient-card backdrop-blur-sm border-primary/20 shadow-card">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Upload className="h-5 w-5 text-primary-foreground" />
            </div>
            <Label className="text-lg font-semibold">
              产品图片上传 ({images.length} 张)
            </Label>
          </div>
          
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
              ${isDragOver 
                ? 'border-primary bg-primary/5 scale-105' 
                : 'border-border hover:border-primary/50'
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg mb-2">拖拽图片到此处或点击上传</p>
            <p className="text-sm text-muted-foreground mb-4">支持 JPG、PNG、GIF 格式</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
              id="image-upload"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('image-upload')?.click()}
              className="border-primary/40 hover:bg-primary/10"
            >
              选择文件
            </Button>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-primary/20"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* 生成按钮 */}
      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={!requirement.trim() || selectedOptions.length === 0}
          className="px-12 py-6 text-lg bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          生成图文笔记
        </Button>
      </div>
    </div>
  );
}