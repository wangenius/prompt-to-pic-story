import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Image, FileText, CheckCircle } from "lucide-react";

interface LoadingAnimationProps {
  type: "note" | "image";
  onComplete: () => void;
  isInline?: boolean;
}

interface ThinkingStep {
  id: number;
  text: string;
  icon: React.ReactNode;
  duration: number;
}

const noteThinkingSteps: ThinkingStep[] = [
  {
    id: 1,
    text: "分析用户需求并查询知识库...",
    icon: <Brain className="h-4 w-4" />,
    duration: 2500,
  },
  {
    id: 2,
    text: "研究平台热门话题、趋势标签和用户行为...",
    icon: <Sparkles className="h-4 w-4" />,
    duration: 3000,
  },
  {
    id: 3,
    text: "构思富有创意的标题和引人入胜的文案结构...",
    icon: <FileText className="h-4 w-4" />,
    duration: 3500,
  },
  {
    id: 4,
    text: "优化语言表达，增强情感共鸣和互动性...",
    icon: <CheckCircle className="h-4 w-4" />,
    duration: 2500,
  },
];

const imageThinkingSteps: ThinkingStep[] = [
  {
    id: 1,
    text: "分析文案内容和视觉风格需求...",
    icon: <Brain className="h-4 w-4" />,
    duration: 2000,
  },
  {
    id: 2,
    text: "生成视觉概念和精美构图方案...",
    icon: <Image className="h-4 w-4" />,
    duration: 2500,
  },
  {
    id: 3,
    text: "渲染高质量图片...",
    icon: <Sparkles className="h-4 w-4" />,
    duration: 4000,
  },
  {
    id: 4,
    text: "优化色彩搭配和细节处理...",
    icon: <CheckCircle className="h-4 w-4" />,
    duration: 2000,
  },
];

export default function LoadingAnimation({ type, onComplete, isInline = false }: LoadingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const steps = type === "note" ? noteThinkingSteps : imageThinkingSteps;

  useEffect(() => {
    if (isComplete) {
      // 立即调用 onComplete，不延迟
      onComplete();
      return;
    }

    const stepTimer = setTimeout(() => {
      if (currentStep < steps.length) {
        setCompletedSteps(prev => [...prev, currentStep]);
        setCurrentStep(prev => prev + 1);
      } else {
        setIsComplete(true);
      }
    }, steps[currentStep]?.duration || 0);

    return () => clearTimeout(stepTimer);
  }, [currentStep, steps, isComplete, onComplete]);

  // 图片生成动画
  useEffect(() => {
    if (type === "image" && currentStep >= 2) {
      const imageTimer = setInterval(() => {
        if (currentImageIndex < 12) {
          const newImage = `/sam/${(Math.floor(Math.random() * 16) + 1)}.png`;
          setGeneratedImages(prev => [...prev, newImage]);
          setCurrentImageIndex(prev => prev + 1);
        } else {
          clearInterval(imageTimer);
        }
      }, 400);

      return () => clearInterval(imageTimer);
    }
  }, [type, currentStep, currentImageIndex]);

  if (isInline) {
    return (
      <div className="w-full h-full flex flex-col">
        {/* 内嵌模式的头部 */}
        <div className="text-center mb-4 p-4 border-b">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
            {type === "note" ? (
              <FileText className="h-6 w-6 text-primary animate-pulse" />
            ) : (
              <Image className="h-6 w-6 text-primary animate-pulse" />
            )}
          </div>
          <h4 className="text-sm font-medium mb-1">
            {type === "note" ? "正在生成笔记" : "正在生成图片"}
          </h4>
          <p className="text-xs text-muted-foreground">
            {type === "note" ? "AI深度思考中..." : "AI精心制作中..."}
          </p>
        </div>

        {/* 思考步骤 - 简化版 */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
                completedSteps.includes(index)
                  ? "bg-green-50 border border-green-200"
                  : index === currentStep
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                  completedSteps.includes(index)
                    ? "bg-green-500 text-white"
                    : index === currentStep
                    ? "bg-blue-500 text-white animate-pulse"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {completedSteps.includes(index) ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  step.icon
                )}
              </div>
              <span
                className={`text-xs transition-colors flex-1 ${
                  completedSteps.includes(index)
                    ? "text-green-700 font-medium"
                    : index === currentStep
                    ? "text-blue-700 font-medium"
                    : "text-gray-600"
                }`}
              >
                {step.text}
              </span>
              {index === currentStep && (
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 图片生成预览 - 简化版 */}
        {type === "image" && (
          <div className="px-4 pb-4">
            <h5 className="text-xs font-medium text-muted-foreground mb-2">
              生成进度 ({generatedImages.length}/12)
            </h5>
            <div className="grid grid-cols-3 gap-1">
              {generatedImages.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square rounded overflow-hidden border border-gray-200 animate-in fade-in-0 zoom-in-95 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <img
                    src={image}
                    alt={`生成图片 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {Array.from({ length: 12 - generatedImages.length }).map((_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="aspect-square rounded border border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
                >
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 进度条 */}
        <div className="px-4 pb-4">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${isComplete ? 100 : ((completedSteps.length / steps.length) * 100)}%`,
              }}
            ></div>
          </div>
          {isComplete && (
            <div className="text-center mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                <CheckCircle className="h-2.5 w-2.5 mr-1" />
                完成
              </Badge>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 全屏模式（保持原有设计）
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-4 p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 animate-in zoom-in-50 duration-700">
            {type === "note" ? (
              <FileText className="h-8 w-8 text-primary animate-pulse" />
            ) : (
              <Image className="h-8 w-8 text-primary animate-pulse" />
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
            {type === "note" ? "正在生成笔记内容" : "正在生成图片"}
          </h3>
          <p className="text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-200">
            {type === "note" 
              ? "AI正在深度思考，为您创作优质内容..." 
              : "AI正在为您生成精美的配图..."
            }
          </p>
        </div>

        {/* 思考步骤 */}
        <div className="space-y-3 mb-6">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                completedSteps.includes(index)
                  ? "bg-green-50 border border-green-200"
                  : index === currentStep
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                  completedSteps.includes(index)
                    ? "bg-green-500 text-white"
                    : index === currentStep
                    ? "bg-blue-500 text-white animate-pulse"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {completedSteps.includes(index) ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  step.icon
                )}
              </div>
              <span
                className={`text-sm transition-colors ${
                  completedSteps.includes(index)
                    ? "text-green-700 font-medium"
                    : index === currentStep
                    ? "text-blue-700 font-medium"
                    : "text-gray-600"
                }`}
              >
                {step.text}
              </span>
              {index === currentStep && (
                <div className="ml-auto">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 图片生成预览 */}
        {type === "image" && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              正在生成图片 ({generatedImages.length}/12)
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {generatedImages.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 animate-in fade-in-0 zoom-in-95 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={image}
                    alt={`生成图片 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {Array.from({ length: 12 - generatedImages.length }).map((_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
                >
                  <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 进度条 */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${isComplete ? 100 : ((completedSteps.length / steps.length) * 100)}%`,
            }}
          ></div>
        </div>

        {isComplete && (
          <div className="text-center mt-4 animate-in fade-in-0 zoom-in-95 duration-500">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-0">
                <CheckCircle className="h-3 w-3 mr-1" />
                生成完成！
              </Badge>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
