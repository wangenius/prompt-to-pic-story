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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

interface Note {
  id: number;
  title: string;
  content: string;
  image: File;
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

const noteTemplates = [
  "🔥 超好用的${product}！真的太惊艳了",
  "💫 ${product}使用心得分享！姐妹们快来看",
  "✨ 入手${product}一个月后的真实感受",
  "🌟 ${product}深度测评！值得入手吗？",
  "💕 ${product}使用技巧大公开！",
  "🎉 ${product}开箱！第一印象超棒",
  "🌈 ${product}日常使用分享",
  "💎 ${product}性价比分析！",
  "🎯 ${product}适合什么人群？",
  "🔍 ${product}详细评测报告",
];

const contentTemplates = [
  "用了一段时间真的爱了！质量超好，性价比很高，强烈推荐给大家～",
  "这个真的太好用了！完全符合我的需求，而且价格也很合理",
  "姐妹们，这个真的值得入手！用了之后生活质量提升了不少",
  "第一次用就被惊艳到了！功能齐全，操作也很简单",
  "用过很多同类产品，这个真的是最满意的一个！",
  "包装精美，质量上乘，使用体验非常好！",
  "性价比真的很高，比预期的还要好用！",
  "朋友推荐的，用了之后觉得真的很不错！",
  "这个设计真的很贴心，细节处理得很到位！",
  "用了一个月了，没有任何问题，质量很稳定！",
];

const generateRandomText = (productKeyword: string) => {
  const titleTemplate =
    noteTemplates[Math.floor(Math.random() * noteTemplates.length)];
  const title = titleTemplate.replace("${product}", productKeyword);
  const content =
    contentTemplates[Math.floor(Math.random() * contentTemplates.length)];
  return { title, content };
};

const generateNotes = (
  requirement: string,
  noteCount: number,
  images: File[]
): Note[] => {
  const notes = [];
  const productKeyword = requirement.split(" ")[0] || "产品";

  for (let i = 0; i < noteCount; i++) {
    const titleTemplate = noteTemplates[i % noteTemplates.length];
    const title = titleTemplate.replace("${product}", productKeyword);
    const content = contentTemplates[i % contentTemplates.length];
    const image = images[i % images.length] || images[0];

    notes.push({
      id: i + 1,
      title,
      content,
      image,
      tags: ["好物推荐", "种草", "测评", "日常分享"].slice(
        0,
        Math.floor(Math.random() * 3) + 2
      ),
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

  const productKeyword = requirement.split(" ")[0] || "产品";

  const handleRegenerateText = (noteId: number) => {
    setNotes(
      notes.map((note) => {
        if (note.id === noteId) {
          const { title, content } = generateRandomText(productKeyword);
          return { ...note, title, content };
        }
        return note;
      })
    );
  };

  const handleRegenerateImage = (noteId: number) => {
    if (images.length === 0) return;
    setNotes(
      notes.map((note) => {
        if (note.id === noteId) {
          const newImage = images[Math.floor(Math.random() * images.length)];
          return { ...note, image: newImage };
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
            <div className="relative aspect-square overflow-hidden">
              {note.image && (
                <img
                  src={URL.createObjectURL(note.image)}
                  alt={note.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              )}
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm font-medium">
                  #{note.id}
                </span>
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
