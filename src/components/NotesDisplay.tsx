import { Button } from "@/components/ui/button";
import { Download, Check, Send } from "lucide-react";
import { useState, useEffect } from "react";
import scriptsData from "@/assets/outdoor-vibe.json";
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
  onBack: () => void;
}

const generateNoteOptions = (
  requirement: string,
  noteCount: number,
  images: File[],
  selectedSection: string
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
    });
  }

  return {
    noteOptions,
    imageOptions,
    selectedNote: 1,
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
  const [activeTab, setActiveTab] = useState<SelectionTab>("note");
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
        });
      }
      setNote({
        ...note,
        imageOptions: [...note.imageOptions, ...newImageOptions],
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

  if (!note) {
    return <div>加载中...</div>;
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
      <div className="flex gap-4 max-w-7xl mx-auto px-4 py-6 h-full">
        {/* 左侧选择栏 */}
        <div className="flex-none w-72 bg-card rounded-lg border flex flex-col">
          {/* 简约导航 */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("note")}
              className={`flex-1 py-2 px-3 text-sm transition-colors ${
                activeTab === "note"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              笔记
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
          <div className="p-3 flex-1">
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
              {activeTab === "note" &&
                note.noteOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`p-2 rounded-md cursor-pointer transition-colors ${
                      note.selectedNote === option.id
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => handleSelectNote(option.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1 mb-1">
                          {option.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {option.content}
                        </p>
                      </div>
                      {note.selectedNote === option.id && (
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

        {/* 右侧预览区域 */}
        <div className="flex-1 flex flex-col gap-2">
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
  );
}
