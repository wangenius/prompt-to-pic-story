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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import scriptsData from "@/assets/scripts.json";

interface ScriptData {
  title: string;
  content: string;
  tags: string[];
}

interface Note {
  id: number;
  title: string;
  content: string;
  imageSrc: string;
  tags: string[];
  likes: number;
  comments: number;
}

interface NotesDisplayProps {
  requirement: string;
  noteCount: number;
  images: File[];
  onBack: () => void;
}

const generateNotes = (
  requirement: string,
  noteCount: number,
  images: File[]
): Note[] => {
  const notes = [];
  const scripts = Object.values(scriptsData) as ScriptData[];

  for (let i = 0; i < noteCount; i++) {
    const scriptIndex = i % scripts.length;
    const script = scripts[scriptIndex];
    // 使用 public 目录中的图片，对应编号 1-20
    const imageNumber = (i % 20) + 1;
    const imageSrc = `/${imageNumber}.png`;

    notes.push({
      id: i + 1,
      title: script.title,
      content: script.content,
      imageSrc,
      tags: script.tags,
      likes: Math.floor(Math.random() * 1000) + 100,
      comments: Math.floor(Math.random() * 100) + 10,
    });
  }

  return notes;
};

export default function NotesDisplay({
  requirement,
  noteCount,
  images,
  onBack,
}: NotesDisplayProps) {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    setNotes(generateNotes(requirement, noteCount, images));
  }, [requirement, noteCount, images]);

  const handleRegenerateText = (noteId: number) => {
    const scripts = Object.values(scriptsData) as ScriptData[];
    setNotes(
      notes.map((note) => {
        if (note.id === noteId) {
          const randomScript = scripts[Math.floor(Math.random() * scripts.length)];
          return { 
            ...note, 
            title: randomScript.title, 
            content: randomScript.content,
            tags: randomScript.tags
          };
        }
        return note;
      })
    );
  };

  const handleRegenerateImage = (noteId: number) => {
    setNotes(
      notes.map((note) => {
        if (note.id === noteId) {
          // 随机选择一个 1-20 的图片
          const newImageNumber = Math.floor(Math.random() * 20) + 1;
          const newImageSrc = `/${newImageNumber}.png`;
          return { ...note, imageSrc: newImageSrc };
        }
        return note;
      })
    );
  };

  const handleDownload = () => {
    // 这里可以实现下载功能
    console.log("下载笔记");
  };

  const handleShare = () => {
    // 这里可以实现分享功能
    console.log("分享笔记");
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
            小红书图文笔记
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
          保存全部
        </Button>
      </div>

      {/* 图文笔记展示 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card
            key={note.id}
            className="overflow-hidden bg-gradient-card backdrop-blur-sm border-primary/20 shadow-card hover:shadow-elegant transition-all duration-300 group"
          >
            {/* 笔记图片 */}
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={note.imageSrc}
                alt={note.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white border-0"
                  onClick={() => {
                    // 复制图片到剪贴板
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.onload = () => {
                      const canvas = document.createElement('canvas');
                      canvas.width = img.width;
                      canvas.height = img.height;
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob((blob) => {
                          if (blob) {
                            const item = new ClipboardItem({ 'image/png': blob });
                            navigator.clipboard.write([item]).then(() => {
                              console.log('图片已复制到剪贴板');
                            });
                          }
                        });
                      }
                    };
                    img.src = note.imageSrc;
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* 笔记内容 */}
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="flex-grow font-semibold text-lg leading-tight line-clamp-2">
                  {note.title}
                </h3>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                {note.content}
              </p>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, tagIndex) => (
                  <Badge
                    key={tagIndex}
                    variant="secondary"
                    className="text-xs bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    <Hash className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* 互动数据 */}
              <div className="flex items-center gap-4 w-full justify-between">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-xs text-primary hover:bg-primary/10"
                      >
                      重新生成
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => handleRegenerateText(note.id)}
                    >
                      重新生成文案
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRegenerateImage(note.id)}
                    >
                      重新生成图片
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-primary hover:bg-primary/10"
                >
                  复制
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
