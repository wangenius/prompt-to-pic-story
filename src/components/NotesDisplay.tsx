import { Button } from "@/components/ui/button";
import { Download, Check, Send } from "lucide-react";
import { useState, useEffect } from "react";
import scriptsData from "@/assets/outdoor-vibe.json";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import LoadingAnimation from "./LoadingAnimation";

interface Strategy {
  style: string;
  view: string;
  target: string;
}

interface ScriptData {
  title: string;
  content: string;
  tags: string[];
  strategy: Strategy;
}

interface NoteOption {
  id: number;
  title: string;
  content: string;
  imageSrc: string;
  tags: string[];
  strategy: Strategy;
}

interface Note {
  noteOptions: NoteOption[];
  imageOptions: NoteOption[];
  selectedNote: number;
  selectedImages: number[];
}

type SelectionTab = "note" | "image";

interface NotesDisplayProps {
  requirement: string;
  noteCount: number;
  images: File[];
  selectedSection: string;
  styleFlexibility: string[];
  userPersona: string[];
  communicationGoal: string[];
  onBack: () => void;
}

const generateNoteOptions = (
  requirement: string,
  noteCount: number,
  images: File[],
  selectedSection: string,
  styleFlexibility: string[],
  userPersona: string[],
  communicationGoal: string[]
): Note => {
  const scripts = Object.values(scriptsData) as ScriptData[];

  // 生成多个笔记选项（标题和内容一体）
  const noteOptions: NoteOption[] = [];
  for (let i = 0; i < 8; i++) {
    const scriptIndex = i % scripts.length;
    const script = scripts[scriptIndex];
    noteOptions.push({
      id: i + 1,
      title: script.title,
      content: script.content,
      imageSrc: `/${(i % 20) + 1}.png`,
      tags: script.tags,
      strategy: script.strategy,
    });
  }

  // 生成多个图片选项
  const imageOptions: NoteOption[] = [];
  for (let i = 0; i < 12; i++) {
    const scriptIndex = (i + 8) % scripts.length;
    const script = scripts[scriptIndex];
    imageOptions.push({
      id: i + 1,
      title: script.title,
      content: script.content,
      imageSrc: `/${((i + 8) % 20) + 1}.png`,
      tags: script.tags,
      strategy: script.strategy,
    });
  }

  return {
    noteOptions,
    imageOptions,
    selectedNote: 1,
    selectedImages: [1],
  };
};

// 策略颜色映射
const getStrategyColor = (type: string, value: string) => {
  const colorMap: Record<string, Record<string, string>> = {
    style: {
      "适中型": "bg-blue-100 text-blue-800",
      "创新型": "bg-green-100 text-green-800", 
      "保守型": "bg-gray-100 text-gray-800"
    },
    view: {
      "精致白领": "bg-purple-100 text-purple-800",
      "社交达人": "bg-pink-100 text-pink-800",
      "户外玩家": "bg-orange-100 text-orange-800"
    },
    target: {
      "深度种草": "bg-red-100 text-red-800",
      "激发好奇": "bg-yellow-100 text-yellow-800",
      "号召行动": "bg-indigo-100 text-indigo-800"
    }
  };
  
  return colorMap[type]?.[value] || "bg-gray-100 text-gray-800";
};

export default function NotesDisplay({
  requirement,
  noteCount,
  images,
  selectedSection,
  styleFlexibility,
  userPersona,
  communicationGoal,
  onBack,
}: NotesDisplayProps) {
  const [note, setNote] = useState<Note | null>(null);
  const [activeTab, setActiveTab] = useState<SelectionTab>("note");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  
  // 新增加载状态管理
  const [isLoading, setIsLoading] = useState(true);
  const [loadingType, setLoadingType] = useState<"note" | "image">("note");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratingType, setRegeneratingType] = useState<"note" | "image">("note");

  useEffect(() => {
    // 初始加载时显示笔记生成动画
    setLoadingType("note");
    setIsLoading(true);
    
    // 移除独立的计时器，让 LoadingAnimation 控制加载流程
    // 数据立即生成，但显示由 LoadingAnimation 控制
    setNote(
      generateNoteOptions(requirement, noteCount, images, selectedSection, styleFlexibility, userPersona, communicationGoal)
    );
  }, [requirement, noteCount, images, selectedSection, styleFlexibility, userPersona, communicationGoal]);

  // 处理初始加载完成
  const handleInitialLoadComplete = () => {
    setIsLoading(false);
  };

  // 处理重新生成完成
  const handleRegenerateComplete = () => {
    setIsRegenerating(false);
  };

  // 当选中项改变时，更新编辑状态的值
  useEffect(() => {
    if (note) {
      const selectedNoteOption = note.noteOptions.find(
        (opt) => opt.id === note.selectedNote
      );

      if (selectedNoteOption) {
        setEditedTitle(selectedNoteOption.title);
        setEditedContent(selectedNoteOption.content);
        setEditedTags([...selectedNoteOption.tags]);
      }
    }
  }, [note?.selectedNote]);

  const handleSelectNote = (noteId: number) => {
    if (note) {
      setNote({ ...note, selectedNote: noteId });
    }
  };

  const handleSelectImage = (imageId: number) => {
    if (note) {
      const newSelectedImages = note.selectedImages.includes(imageId)
        ? note.selectedImages.filter((id) => id !== imageId)
        : [...note.selectedImages, imageId];
      setNote({ ...note, selectedImages: newSelectedImages });
    }
  };

  const handleRegenerateOptions = (type: "note" | "image") => {
    if (!note) return;

    setIsRegenerating(true);
    setRegeneratingType(type);

    // 移除计时器，让 LoadingAnimation 控制流程
    // 数据立即生成，但显示由 LoadingAnimation 控制
    const scripts = Object.values(scriptsData) as ScriptData[];

    if (type === "note") {
      // 生成更多笔记选项，添加到现有选项后面
      const newNoteOptions: NoteOption[] = [];
      const startId = note.noteOptions.length + 1;
      for (let i = 0; i < 8; i++) {
        const randomScript =
          scripts[Math.floor(Math.random() * scripts.length)];
        newNoteOptions.push({
          id: startId + i,
          title: randomScript.title,
          content: randomScript.content,
          imageSrc: `/${Math.floor(Math.random() * 20) + 1}.png`,
          tags: randomScript.tags,
          strategy: randomScript.strategy,
        });
      }
      setNote({
        ...note,
        noteOptions: [...note.noteOptions, ...newNoteOptions],
      });
    } else if (type === "image") {
      // 生成更多图片选项，添加到现有选项后面
      const newImageOptions: NoteOption[] = [];
      const startId = note.imageOptions.length + 1;
      for (let i = 0; i < 12; i++) {
        const randomScript =
          scripts[Math.floor(Math.random() * scripts.length)];
        newImageOptions.push({
          id: startId + i,
          title: randomScript.title,
          content: randomScript.content,
          imageSrc: `/${Math.floor(Math.random() * 20) + 1}.png`,
          tags: randomScript.tags,
          strategy: randomScript.strategy,
        });
      }
      setNote({
        ...note,
        imageOptions: [...note.imageOptions, ...newImageOptions],
      });
    }
    
    // 移除 setIsRegenerating(false)，由 LoadingAnimation 的 onComplete 控制
  };

  const handleDownload = () => {
    // 这里可以实现下载功能
    console.log("下载笔记");
  };

  const handleShare = () => {
    // 这里可以实现分享功能
    console.log("分享笔记");
  };

  const handlePublish = () => {
    if (!note) return;

    const selectedImageOptions = note.imageOptions.filter((opt) =>
      note.selectedImages.includes(opt.id)
    );

    // 构建发布数据，使用编辑后的内容
    const publishData = {
      title:
        editedTitle ||
        note.noteOptions.find((opt) => opt.id === note.selectedNote)?.title,
      content:
        editedContent ||
        note.noteOptions.find((opt) => opt.id === note.selectedNote)?.content,
      images: selectedImageOptions.map((opt) => opt.imageSrc),
      tags:
        editedTags.length > 0
          ? editedTags
          : note.noteOptions.find((opt) => opt.id === note.selectedNote)
              ?.tags || [],
      timestamp: new Date().toISOString(),
    };

    console.log("发布笔记数据:", publishData);

    // 这里可以添加实际的发布逻辑，比如：
    // - 调用API发布到小红书
    // - 保存到本地数据库
    // - 发送到其他平台

    // 模拟发布成功
    alert("笔记发布成功！");
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editedTags.includes(newTag.trim())) {
      setEditedTags([...editedTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedTags(editedTags.filter((tag) => tag !== tagToRemove));
  };

  if (!note || isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <div className="flex gap-4 max-w-7xl mx-auto px-4 py-6 h-screen">
          {/* 左侧加载动画区域 */}
          <div className="flex-none w-80 bg-card rounded-lg border flex flex-col h-full">
            <LoadingAnimation 
              type={loadingType} 
              onComplete={handleInitialLoadComplete} 
              isInline={true} 
            />
          </div>
          
          {/* 右侧预览区域 - 显示加载状态 */}
          <div className="flex-1 flex flex-col gap-4 h-full max-w-2xl">
            <div className="flex gap-2 justify-end flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground"
              >
                返回
              </Button>
            </div>
            
            <div className="bg-card rounded-lg border p-6 flex-1 flex flex-col overflow-hidden">
              <h2 className="text-lg font-medium text-foreground mb-4 flex-shrink-0">
                预览
              </h2>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p>正在生成内容，请稍候...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedNoteOption = note.noteOptions.find(
    (opt) => opt.id === note.selectedNote
  );
  const selectedImageOptions = note.imageOptions.filter((opt) =>
    note.selectedImages.includes(opt.id)
  );

  return (
    <div className="bg-background min-h-screen">
      {/* 主要内容区域 */}
      <div className="flex gap-4 max-w-7xl mx-auto px-4 py-6 h-screen">
        {/* 左侧选择栏 */}
        <div className="flex-none w-80 bg-card rounded-lg border flex flex-col h-full">
          {/* 如果正在重新生成，显示加载动画 */}
          {isRegenerating ? (
            <LoadingAnimation 
              type={regeneratingType} 
              onComplete={handleRegenerateComplete} 
              isInline={true} 
            />
          ) : (
            <>
              {/* 简约导航 */}
              <div className="flex border-b flex-shrink-0">
                <button
                  onClick={() => setActiveTab("note")}
                  className={`flex-1 py-3 px-4 text-sm transition-colors ${
                    activeTab === "note"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  笔记
                </button>
                <button
                  onClick={() => setActiveTab("image")}
                  className={`flex-1 py-3 px-4 text-sm transition-colors ${
                    activeTab === "image"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  图片
                </button>
              </div>

              {/* 选择栏内容 */}
              <div className="flex-1 flex flex-col min-h-0">
                {/* 生成按钮 */}
                <div className="p-4 pb-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRegenerateOptions(activeTab)}
                    className="w-full"
                    disabled={isRegenerating}
                  >
                    更多生成
                  </Button>
                </div>

                {/* 选项列表 */}
                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                  {activeTab === "note" &&
                    note.noteOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`p-2 rounded-lg cursor-pointer transition-colors border ${
                          note.selectedNote === option.id
                            ? "bg-primary/10 border-primary/30"
                            : "hover:bg-muted/50 border-transparent"
                        }`}
                        onClick={() => handleSelectNote(option.id)}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1 mb-1">
                              {option.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {option.content}
                            </p>
                          </div>
                          {note.selectedNote === option.id && (
                            <Check className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                          )}
                        </div>
                        
                        {/* 策略标签 */}
                        <div className="flex flex-wrap gap-1">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs px-1.5 py-0.5 ${getStrategyColor('style', option.strategy.style)}`}
                          >
                            {option.strategy.style}
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs px-1.5 py-0.5 ${getStrategyColor('view', option.strategy.view)}`}
                          >
                            {option.strategy.view}
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs px-1.5 py-0.5 ${getStrategyColor('target', option.strategy.target)}`}
                          >
                            {option.strategy.target}
                          </Badge>
                        </div>
                      </div>
                    ))}

                  {activeTab === "image" && (
                    <div className="grid grid-cols-2 gap-2">
                      {note.imageOptions.map((option) => (
                        <div
                          key={option.id}
                          className={`relative aspect-square cursor-pointer transition-all rounded-lg overflow-hidden ${
                            note.selectedImages.includes(option.id)
                              ? "ring-2 ring-primary"
                              : "hover:opacity-80"
                          }`}
                          onClick={() => handleSelectImage(option.id)}
                        >
                          <img
                            src={option.imageSrc}
                            alt={`图片选项 ${option.id}`}
                            className="w-full h-full object-cover"
                          />
                          {note.selectedImages.includes(option.id) && (
                            <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5">
                              <Check className="h-2 w-2" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 右侧预览区域 */}
        <div className="flex-1 flex flex-col gap-4 h-full max-w-2xl">
          <div className="flex gap-2 justify-end flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              返回
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              className="bg-primary hover:bg-primary/90"
            >
              <Download className="h-4 w-4 mr-1" />
              保存
            </Button>
            <Button
              size="sm"
              onClick={handlePublish}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-1" />
              发布
            </Button>
          </div>
          
          <div className="bg-card rounded-lg border p-6 flex-1 flex flex-col overflow-hidden">
            <h2 className="text-lg font-medium text-foreground mb-4 flex-shrink-0">
              预览
            </h2>

            <div className="flex-1 overflow-y-auto space-y-6 px-2">
              {/* 图片预览 */}
              {selectedImageOptions.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {selectedImageOptions.map((imageOption) => (
                    <div
                      key={imageOption.id}
                      className="relative w-64 h-80 flex-shrink-0 overflow-hidden rounded-lg"
                    >
                      <img
                        src={imageOption.imageSrc}
                        alt={`预览图片 ${imageOption.id}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 内容编辑 */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    标题
                  </label>
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="输入标题..."
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    内容
                  </label>
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    placeholder="输入内容..."
                    className="w-full min-h-[200px] resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    标签
                  </label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="添加新标签..."
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={handleAddTag}
                      disabled={!newTag.trim()}
                    >
                      添加
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editedTags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-destructive ml-1"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 当前选中笔记的策略信息 */}
                {selectedNoteOption && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      策略信息
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant="outline" 
                        className={`${getStrategyColor('style', selectedNoteOption.strategy.style)}`}
                      >
                        风格: {selectedNoteOption.strategy.style}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`${getStrategyColor('view', selectedNoteOption.strategy.view)}`}
                      >
                        视角: {selectedNoteOption.strategy.view}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`${getStrategyColor('target', selectedNoteOption.strategy.target)}`}
                      >
                        目标: {selectedNoteOption.strategy.target}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
