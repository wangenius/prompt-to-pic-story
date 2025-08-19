import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import LoadingAnimation from "./LoadingAnimation";
import {
  Upload,
  FileText,
  Sparkles,
  Mountain,
  Camera,
  ShoppingBag,
  Coffee,
} from "lucide-react";

interface RequirementFormProps {
  onSubmit: (data: {
    requirement: string;
    images: File[];
    selectedSection: string;
    styleFlexibility: string[];
    userPersona: string[];
    communicationGoal: string[];
  }) => void;
}

type SectionType = "outdoor-wild" | "outdoor-guide" | "life-sam" | "life-taste";

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
    id: "outdoor-guide",
    title: "户外线-氛围出片指南",
    subtitle: "文案",
    icon: <Camera className="h-5 w-5" />,
    description: "输入氛围出片相关的文案内容",
    hasImageUpload: false,
    hasTextInput: true,
  },
  {
    id: "outdoor-wild",
    title: "户外线-旷野回响",
    subtitle: "综艺图片+文案",
    icon: <Mountain className="h-5 w-5" />,
    description: "上传综艺图片并输入相关文案",
    hasImageUpload: true,
    hasTextInput: true,
  },

  {
    id: "life-sam",
    title: "精致生活线-入驻山姆",
    subtitle: "山姆会员店相关内容",
    icon: <ShoppingBag className="h-5 w-5" />,
    description: "生成山姆会员店相关的精致生活内容",
    hasImageUpload: false,
    hasTextInput: true,
  },
  {
    id: "life-taste",
    title: "精致生活线-赏味一刻",
    subtitle: "美食体验内容",
    icon: <Coffee className="h-5 w-5" />,
    description: "生成美食体验相关的精致生活内容",
    hasImageUpload: false,
    hasTextInput: true,
  },
];

export default function RequirementForm({ onSubmit }: RequirementFormProps) {
  const [selectedSection, setSelectedSection] =
    useState<SectionType>("outdoor-guide");
  const [requirement, setRequirement] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [styleFlexibility, setStyleFlexibility] = useState<string[]>([]);
  const [userPersona, setUserPersona] = useState<string[]>([]);
  const [communicationGoal, setCommunicationGoal] = useState<string[]>([]);

  const selectedSectionConfig = selectedSection
    ? sections.find((s) => s.id === selectedSection)
    : null;

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      setImages((prev) => [...prev, ...Array.from(files)]);
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

  const handleSelectionChange = (
    category: "styleFlexibility" | "userPersona" | "communicationGoal",
    value: string
  ) => {
    const setterMap = {
      styleFlexibility: setStyleFlexibility,
      userPersona: setUserPersona,
      communicationGoal: setCommunicationGoal,
    };

    const currentValues = {
      styleFlexibility,
      userPersona,
      communicationGoal,
    };

    const setter = setterMap[category];
    const currentValue = currentValues[category];

    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = () => {
    if (selectedSection) {
      setIsLoading(true);
      // 延迟提交以显示加载状态
      setTimeout(() => {
        onSubmit({
          requirement,
          images,
          selectedSection,
          styleFlexibility,
          userPersona,
          communicationGoal,
        });
      }, 500);
    }
  };

  // 移除全屏加载动画

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
      {/* 左侧：板块选择 */}
      <div className="lg:col-span-2">
        <div className="bg-white h-full p-4">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              内容板块
            </h3>
            <p className="text-sm text-gray-500">选择您要生成的内容类型</p>
          </div>

          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`
                  w-full text-left p-3 rounded-lg transition-all duration-200 group
                  ${
                    selectedSection === section.id
                      ? "bg-blue-50 border border-blue-200 shadow-sm"
                      : "hover:bg-gray-50 border border-transparent"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                    p-2 rounded-lg transition-colors
                    ${
                      selectedSection === section.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    }
                  `}
                  >
                    {section.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`
                      font-medium text-sm truncate
                      ${
                        selectedSection === section.id
                          ? "text-blue-900"
                          : "text-gray-900"
                      }
                    `}
                    >
                      {section.title}
                    </div>
                    <div
                      className={`
                      text-xs truncate
                      ${
                        selectedSection === section.id
                          ? "text-blue-600"
                          : "text-gray-500"
                      }
                    `}
                    >
                      {section.subtitle}
                    </div>
                  </div>
                  {selectedSection === section.id && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 右侧：内容配置 */}
      {selectedSection && selectedSectionConfig && (
        <div className="lg:col-span-5 space-y-6">
          {/* 需求输入区域 */}
          {selectedSectionConfig.hasTextInput && (
            <Card className="p-6 border rounded-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <Label
                    htmlFor="requirement"
                    className="text-lg font-semibold"
                  >
                    {selectedSectionConfig.title} : 输入您的文案需求
                  </Label>
                </div>
                <Textarea
                  id="requirement"
                  placeholder={`请描述您的笔记内容想传达的核心信息`}
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  className="min-h-32 resize-none border-gray-300 focus:border-blue-500"
                />
              </div>
            </Card>
          )}

          {/* 风格选择区域 */}
          <Card className="p-6 border rounded-lg">
            <div className="space-y-6">
              {/* 风格灵活度 */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-900">
                  风格灵活度:
                </Label>
                <div className="flex flex-wrap gap-2">
                  {["保守型", "适中型", "创新型"].map((option) => (
                    <Button
                      key={option}
                      variant={
                        styleFlexibility.includes(option)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        handleSelectionChange("styleFlexibility", option)
                      }
                      className={`
                        ${
                          styleFlexibility.includes(option)
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }
                      `}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 用户人设视角 */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-900">
                  用户人设视角:
                </Label>
                <div className="flex flex-wrap gap-2">
                  {["精致白领", "户外玩家", "社交达人"].map((option) => (
                    <Button
                      key={option}
                      variant={
                        userPersona.includes(option) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        handleSelectionChange("userPersona", option)
                      }
                      className={`
                        ${
                          userPersona.includes(option)
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }
                      `}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 种草沟通目标 */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-900">
                  种草沟通目标:
                </Label>
                <div className="flex flex-wrap gap-2">
                  {["激发好奇", "深度种草", "号召行动"].map((option) => (
                    <Button
                      key={option}
                      variant={
                        communicationGoal.includes(option)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        handleSelectionChange("communicationGoal", option)
                      }
                      className={`
                        ${
                          communicationGoal.includes(option)
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }
                      `}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* 图片上传区域 - 仅旷野回响板块显示 */}
          {selectedSectionConfig.hasImageUpload && (
            <Card className="p-6 border rounded-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  <Label className="text-lg font-semibold">
                    综艺图片上传 ({images.length} 张)
                  </Label>
                </div>

                <div
                  className={`
                    border-2 border-dashed rounded-lg p-6 text-center transition-all
                    ${
                      isDragOver
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400"
                    }
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                  <p className="text-base mb-1">拖拽综艺图片到此处或点击上传</p>
                  <p className="text-sm text-gray-500 mb-3">
                    支持 JPG、PNG、GIF 格式
                  </p>
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
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    选择文件
                  </Button>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                          onClick={() =>
                            setImages((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
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

          {/* 生成按钮 */}
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-3 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isLoading ? "处理中..." : "生成内容"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
