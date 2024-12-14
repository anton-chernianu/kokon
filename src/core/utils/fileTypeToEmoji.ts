export const fileTypeToEmoji = (fileType: string) => {
  const fileTypeMap: Record<string, string> = {
    webp: "🖼️",
    png: "🖼️",
    jpg: "🖼️",
    jpeg: "🖼️",
    gif: "🎞️",
    svg: "🖍️",
    mkv: "🎥",
    mp4: "🎥",
    avi: "🎬",
    mov: "🎞️",
    mp3: "🎵",
    wav: "🔊",
    flac: "🎶",
    pdf: "📄",
    doc: "📄",
    docx: "📄",
    xlsx: "📊",
    ppt: "📊",
    pptx: "📊",
    zip: "📦",
    rar: "📦",
    "7z": "📦",
    txt: "📝",
    json: "📂",
    js: "💻",
    html: "🌐",
    css: "🎨",
    py: "🐍",
    java: "☕",
    c: "🔧",
    cpp: "🔧",
    exe: "⚙️",
    bat: "⚙️",
    sh: "📜",
    iso: "💿",
  };

  return fileTypeMap[fileType.toLowerCase()] || "";
};