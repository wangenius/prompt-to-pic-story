import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Share2,
  BookOpen,
  Heart,
  MessageCircle,
  Hash,
  MoreVertical,
  Copy,
  Check,
  Send,
  Type,
  FileText,
  Image,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import scriptsData from "@/assets/scripts.json";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ScriptData {
  title: string;
  content: string;
  tags: string[];
}

interface NoteOption {
  id: number;
  title: string;
  content: string;
  imageSrc: string;
  tags: string[];
}

interface Note {
  titleOptions: NoteOption[];
  contentOptions: NoteOption[];
  imageOptions: NoteOption[];
  selectedTitle: number;
  selectedContent: number;
  selectedImages: number[];
}

type SelectionTab = "title" | "content" | "image";

interface NotesDisplayProps {
  requirement: string;
  noteCount: number;
  images: File[];
  selectedSection: string;
  onBack: () => void;
}

const generateNoteOptions = (
  requirement: string,
  noteCount: number,
  images: File[],
  selectedSection: string
): Note => {
  const scripts = Object.values(scriptsData) as ScriptData[];

  // 生成多个标题选项
  const titleOptions: NoteOption[] = [];
  for (let i = 0; i < 8; i++) {
    const scriptIndex = i % scripts.length;
    const script = scripts[scriptIndex];
    titleOptions.push({
      id: i + 1,
      title: script.title,
      content: script.content,
      imageSrc: `/${(i % 20) + 1}.png`,
      tags: script.tags,
    });
  }

  // 生成多个文案选项
  const contentOptions: NoteOption[] = [];
  for (let i = 0; i < 8; i++) {
    const scriptIndex = (i + 8) % scripts.length;
    const script = scripts[scriptIndex];
    contentOptions.push({
      id: i + 1,
      title: script.title,
      content: script.content,
      imageSrc: `/${((i + 8) % 20) + 1}.png`,
      tags: script.tags,
    });
  }

  // 生成多个图片选项
  const imageOptions: NoteOption[] = [];
  for (let i = 0; i < 12; i++) {
    const scriptIndex = (i + 16) % scripts.length;
    const script = scripts[scriptIndex];
    imageOptions.push({
      id: i + 1,
      title: script.title,
      content: script.content,
      imageSrc: `/${((i + 16) % 20) + 1}.png`,
      tags: script.tags,
    });
  }

  return {
    titleOptions,
    contentOptions,
    imageOptions,
    selectedTitle: 1,
    selectedContent: 1,
    selectedImages: [1],
  };
};

export default function NotesDisplay({
  requirement,
  noteCount,
  images,
  selectedSection,
  onBack,
}: NotesDisplayProps) {
  const [note, setNote] = useState<Note | null>(null);
  const [activeTab, setActiveTab] = useState<SelectionTab>("title");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    setNote(
      generateNoteOptions(requirement, noteCount, images, selectedSection)
    );
  }, [requirement, noteCount, images, selectedSection]);

  // 当选中项改变时，更新编辑状态的值
  useEffect(() => {
    if (note) {
      const selectedTitleOption = note.titleOptions.find(
        (opt) => opt.id === note.selectedTitle
      );
      const selectedContentOption = note.contentOptions.find(
        (opt) => opt.id === note.selectedContent
      );
      
      if (selectedTitleOption) {
        setEditedTitle(selectedTitleOption.title);
        setEditedTags([...selectedTitleOption.tags]);
      }
      if (selectedContentOption) {
        setEditedContent(selectedContentOption.content);
      }
    }
  }, [note?.selectedTitle, note?.selectedContent]);

  const handleSelectTitle = (titleId: number) => {
    if (note) {
      setNote({ ...note, selectedTitle: titleId });
    }
  };

  const handleSelectContent = (contentId: number) => {
    if (note) {
      setNote({ ...note, selectedContent: contentId });
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

  const handleRegenerateOptions = (type: "title" | "content" | "image") => {
    if (!note) return;

    const scripts = Object.values(scriptsData) as ScriptData[];

    if (type === "title") {
      // 生成更多标题选项，添加到现有选项后面
      const newTitleOptions: NoteOption[] = [];
      const startId = note.titleOptions.length + 1;
      for (let i = 0; i < 8; i++) {
        const randomScript =
          scripts[Math.floor(Math.random() * scripts.length)];
        newTitleOptions.push({
          id: startId + i,
          title: randomScript.title,
          content: randomScript.content,
          imageSrc: `/${Math.floor(Math.random() * 20) + 1}.png`,
          tags: randomScript.tags,
        });
      }
      setNote({ 
        ...note, 
        titleOptions: [...note.titleOptions, ...newTitleOptions] 
      });
    } else if (type === "content") {
      // 生成更多文案选项，添加到现有选项后面
      const newContentOptions: NoteOption[] = [];
      const startId = note.contentOptions.length + 1;
      for (let i = 0; i < 8; i++) {
        const randomScript =
          scripts[Math.floor(Math.random() * scripts.length)];
        newContentOptions.push({
          id: startId + i,
          title: randomScript.title,
          content: randomScript.content,
          imageSrc: `/${Math.floor(Math.random() * 20) + 1}.png`,
          tags: randomScript.tags,
        });
      }
      setNote({ 
        ...note, 
        contentOptions: [...note.contentOptions, ...newContentOptions] 
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
        });
      }
      setNote({ 
        ...note, 
        imageOptions: [...note.imageOptions, ...newImageOptions] 
      });
    }
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
      title: editedTitle || note.titleOptions.find(
        (opt) => opt.id === note.selectedTitle
      )?.title,
      content: editedContent || note.contentOptions.find(
        (opt) => opt.id === note.selectedContent
      )?.content,
      images: selectedImageOptions.map((opt) => opt.imageSrc),
      tags: editedTags.length > 0 ? editedTags : note.titleOptions.find(
        (opt) => opt.id === note.selectedTitle
      )?.tags || [],
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
    setEditedTags(editedTags.filter(tag => tag !== tagToRemove));
  };

  if (!note) {
    return <div>加载中...</div>;
  }

  const selectedTitleOption = note.titleOptions.find(
    (opt) => opt.id === note.selectedTitle
  );
  const selectedContentOption = note.contentOptions.find(
    (opt) => opt.id === note.selectedContent
  );
  const selectedImageOptions = note.imageOptions.filter((opt) =>
    note.selectedImages.includes(opt.id)
  );

  return (
    <div className="bg-background">
      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧选择栏 */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border">
              {/* 简约导航 */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab("title")}
                  className={`flex-1 py-2 px-3 text-sm transition-colors ${
                    activeTab === "title"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  标题
                </button>
                <button
                  onClick={() => setActiveTab("content")}
                  className={`flex-1 py-2 px-3 text-sm transition-colors ${
                    activeTab === "content"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  内容
                </button>
                <button
                  onClick={() => setActiveTab("image")}
                  className={`flex-1 py-2 px-3 text-sm transition-colors ${
                    activeTab === "image"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  图片
                </button>
              </div>

              {/* 选择栏内容 */}
              <div className="p-3">
                {/* 生成按钮 */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRegenerateOptions(activeTab)}
                  className="w-full mb-3"
                >
                  更多生成
                </Button>

                {/* 选项列表 */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {activeTab === "title" &&
                    note.titleOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`p-2 rounded-md cursor-pointer transition-colors ${
                          note.selectedTitle === option.id
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => handleSelectTitle(option.id)}
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-sm line-clamp-2 flex-1">
                            {option.title}
                          </p>
                          {note.selectedTitle === option.id && (
                            <Check className="h-3 w-3 text-primary flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </div>
                    ))}

                  {activeTab === "content" &&
                    note.contentOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`p-2 rounded-md cursor-pointer transition-colors ${
                          note.selectedContent === option.id
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => handleSelectContent(option.id)}
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-sm line-clamp-3 flex-1">
                            {option.content}
                          </p>
                          {note.selectedContent === option.id && (
                            <Check className="h-3 w-3 text-primary flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </div>
                    ))}

                  {activeTab === "image" && (
                    <div className="grid grid-cols-2 gap-2">
                      {note.imageOptions.map((option) => (
                        <div
                          key={option.id}
                          className={`relative aspect-square cursor-pointer transition-all ${
                            note.selectedImages.includes(option.id)
                              ? "ring-2 ring-primary"
                              : "hover:opacity-80"
                          }`}
                          onClick={() => handleSelectImage(option.id)}
                        >
                          <img
                            src={option.imageSrc}
                            alt={`图片选项 ${option.id}`}
                            className="w-full h-full object-cover rounded-md"
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
            </div>
          </div>

          {/* 右侧预览区域 */}
          <div className="lg:col-span-3 space-y-2">
            <div className="flex gap-2 justify-end">
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
            <div className="bg-card rounded-lg border p-4">
              <h2 className="text-sm font-medium text-muted-foreground mb-4">
                预览
              </h2>

              {/* 图片预览 */}
              {selectedImageOptions.length > 0 && (
                <div className="flex gap-4 overflow-x-auto mb-4">
                  {selectedImageOptions.map((imageOption) => (
                    <div
                      key={imageOption.id}
                      className="relative w-64 h-80 flex-shrink-0 overflow-hidden rounded-md"
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
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
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
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    内容
                  </label>
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    placeholder="输入内容..."
                    className="w-full min-h-[100px]"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    标签
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="添加新标签..."
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
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
                  <div className="flex flex-wrap gap-1">
                    {editedTags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-destructive"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
