import {
  FileIcon,
  Download,
  X,
  FileImage,
  FileText,
  FileSpreadsheet,
  FileType2,
  FileVideo,
  FileAudio,
  FileArchive,
  File,
} from "lucide-react";

export const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    // Hình ảnh
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
    case "webp":
    case "bmp":
    case "ico":
      return <FileImage size={16} />;

    // Word
    case "doc":
    case "docx":
      return <FileText size={16} />;

    // Excel
    case "xls":
    case "xlsx":
    case "csv":
      return <FileSpreadsheet size={16} />;

    // PDF
    case "pdf":
      return <FileType2 size={16} />;

    // Video
    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
    case "flv":
    case "mkv":
    case "webm":
      return <FileVideo size={16} />;

    // Audio
    case "mp3":
    case "wav":
    case "ogg":
    case "flac":
    case "aac":
    case "m4a":
      return <FileAudio size={16} />;

    // Archive
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return <FileArchive size={16} />;

    // Text files
    case "txt":
    case "md":
    case "json":
    case "xml":
    case "html":
    case "css":
    case "js":
    case "ts":
    case "tsx":
    case "jsx":
      return <File size={16} />;

    default:
      return <FileIcon size={16} />;
  }
};

export const getIconColor = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    // Hình ảnh - Xanh lá
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
    case "webp":
    case "bmp":
    case "ico":
      return "bg-green-50 text-green-500";

    // Word - Xanh dương
    case "doc":
    case "docx":
      return "bg-blue-50 text-blue-500";

    // Excel - Xanh lá đậm
    case "xls":
    case "xlsx":
    case "csv":
      return "bg-emerald-50 text-emerald-600";

    // PDF - Đỏ
    case "pdf":
      return "bg-red-50 text-red-500";

    // Video - Tím
    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
    case "flv":
    case "mkv":
    case "webm":
      return "bg-purple-50 text-purple-500";

    // Audio - Hồng
    case "mp3":
    case "wav":
    case "ogg":
    case "flac":
    case "aac":
    case "m4a":
      return "bg-pink-50 text-pink-500";

    // Archive - Vàng
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return "bg-yellow-50 text-yellow-600";

    // Text files - Xám
    case "txt":
    case "md":
    case "json":
    case "xml":
    case "html":
    case "css":
    case "js":
    case "ts":
    case "tsx":
    case "jsx":
      return "bg-gray-50 text-gray-500";

    default:
      return "bg-orange-50 text-orange-500";
  }
};
