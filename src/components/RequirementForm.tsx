import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Sparkles, CheckCircle, Mountain, Camera, ShoppingBag, Coffee } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface RequirementFormProps {
  onSubmit: (data: { requirement: string; noteCount: number; images: File[]; selectedSection: string }) => void;
}

type SectionType = 'outdoor-wild' | 'outdoor-guide' | 'life-sam' | 'life-taste';

interface SectionConfig {
  id: SectionType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
  hasImageUpload: boolean;
  hasTextInput: boolean;
}

const sections: SectionConfig[] = [
  {
    id: 'outdoor-wild',
    title: '户外线-旷野回响',
    subtitle: '综艺图片+文案',
    icon: <Mountain className="h-5 w-5" />,
    description: '上传综艺图片并输入相关文案',
    hasImageUpload: true,
    hasTextInput: true
  },
  {
    id: 'outdoor-guide',
    title: '户外线-氛围出片指南',
    subtitle: '文案',
    icon: <Camera className="h-5 w-5" />,
    description: '输入氛围出片相关的文案内容',
    hasImageUpload: false,
    hasTextInput: true
  },
  {
    id: 'life-sam',
    title: '精致生活线-入驻山姆',
    subtitle: '山姆会员店相关内容',
    icon: <ShoppingBag className="h-5 w-5" />,
    description: '生成山姆会员店相关的精致生活内容',
    hasImageUpload: false,
    hasTextInput: true
  },
  {
    id: 'life-taste',
    title: '精致生活线-赏味一刻',
    subtitle: '美食体验内容',
    icon: <Coffee className="h-5 w-5" />,
    description: '生成美食体验相关的精致生活内容',
    hasImageUpload: false,
    hasTextInput: true
  }
];

export default function RequirementForm({ onSubmit }: RequirementFormProps) {
  const [selectedSection, setSelectedSection] = useState<SectionType | null>(null);
  const [requirement, setRequirement] = useState('');
  const [noteCount, setNoteCount] = useState(20);
  const [images, setImages] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const selectedSectionConfig = selectedSection ? sections.find(s => s.id === selectedSection) : null;

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
    if (selectedSection && requirement.trim() && noteCount > 0) {
      onSubmit({ requirement, noteCount, images, selectedSection });
    }
  };

  const resetForm = () => {
    setSelectedSection(null);
    setRequirement('');
    setImages([]);
  };

  return (
    <div className="space-y-8">
      {/* 板块选择区域 */}
      <Card className="p-6 bg-gradient-card backdrop-blur-sm border-primary/20 shadow-card">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <Label className="text-lg font-semibold">
              选择内容板块
            </Label>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={selectedSection === section.id ? "default" : "outline"}
                size="sm"
                className={`
                  flex items-center gap-2 px-4 py-2 transition-all duration-300
                  ${selectedSection === section.id 
                    ? 'bg-gradient-primary text-primary-foreground shadow-glow' 
                    : 'border-primary/40 hover:border-primary hover:bg-primary/5'
                  }
                `}
                onClick={() => setSelectedSection(section.id)}
              >
                <div className={`p-1 rounded ${selectedSection === section.id ? 'bg-primary-foreground/20' : 'bg-primary/10'}`}>
                  {section.icon}
                </div>
                <span className="font-medium">{section.title}</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {selectedSection && selectedSectionConfig && (
        <>
          {/* 需求输入区域 */}
          {selectedSectionConfig.hasTextInput && (
            <Card className="p-8 bg-gradient-card backdrop-blur-sm border-primary/20 shadow-card">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <FileText className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <Label htmlFor="requirement" className="text-lg font-semibold">
                    {selectedSectionConfig.title} - 文案内容
                  </Label>
                </div>
                <Textarea
                  id="requirement"
                  placeholder={`请详细描述您的${selectedSectionConfig.title}需求、目标用户、期望内容等...`}
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  className="min-h-32 resize-none bg-background/50 border-primary/20 focus:border-primary transition-all duration-300"
                />
              </div>
            </Card>
          )}

          {/* 图片上传区域 - 仅旷野回响板块显示 */}
          {selectedSectionConfig.hasImageUpload && (
            <Card className="p-8 bg-gradient-card backdrop-blur-sm border-primary/20 shadow-card">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <Upload className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <Label className="text-lg font-semibold">
                    综艺图片上传 ({images.length} 张)
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
                  <p className="text-lg mb-2">拖拽综艺图片到此处或点击上传</p>
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
          )}

          {/* 笔记数量选择区域 */}
          <Card className="p-8 bg-gradient-card backdrop-blur-sm border-primary/20 shadow-card">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <CheckCircle className="h-5 w-5 text-primary-foreground" />
                </div>
                <Label className="text-lg font-semibold">
                  生成笔记数量
                </Label>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="noteCount" className="text-sm text-muted-foreground whitespace-nowrap">
                    选择生成数量：
                  </Label>
                  <div className="flex-1">
                    <Slider
                      id="noteCount"
                      max={30}
                      step={1}
                      value={[noteCount]}
                      onValueChange={(value) => setNoteCount(value[0])}
                    />
                  </div>
                  <Badge 
                    variant="outline" 
                    className="border-primary/40 bg-gradient-primary text-primary-foreground min-w-[3rem] justify-center"
                  >
                    {noteCount}
                  </Badge>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0份</span>
                  <span>默认20份</span>
                  <span>30份</span>
                </div>
              </div>
            </div>
          </Card>

          {/* 生成按钮 */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={resetForm}
              className="px-8 py-6 text-lg border-primary/40 hover:bg-primary/10"
            >
              重新选择板块
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!requirement.trim() || noteCount === 0}
              className="px-12 py-6 text-lg bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              生成{selectedSectionConfig.title}内容
            </Button>
          </div>
        </>
      )}
    </div>
  );
}