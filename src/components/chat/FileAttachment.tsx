import { FileText, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AttachmentProps {
  name: string
  type: string
  size: number
  url: string
  previewUrl?: string
  sender: 'user' | 'agent'
}

const getFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const FileAttachment = ({
  name,
  type,
  size,
  url,
  previewUrl,
  sender,
}: AttachmentProps) => {
  const isImage = type.startsWith('image/')
  const isUser = sender === 'user'

  if (isImage && previewUrl) {
    return (
      <div className="mb-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg overflow-hidden border border-black/10 max-w-[250px] group relative"
        >
          <img
            src={previewUrl}
            alt={name}
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
            <Download className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </a>
      </div>
    )
  }

  return (
    <div className="mb-2">
      <a
        href={url}
        download={name}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'flex items-center gap-3 p-2 rounded-lg transition-colors w-full max-w-xs',
          isUser
            ? 'bg-white/20 hover:bg-white/30'
            : 'bg-black/5 hover:bg-black/10',
        )}
      >
        <FileText className="h-6 w-6 flex-shrink-0" />
        <div className="flex-grow overflow-hidden">
          <p className="text-sm font-medium truncate">{name}</p>
          <p
            className={cn(
              'text-xs',
              isUser ? 'text-white/80' : 'text-nilo-dark-gray/80',
            )}
          >
            {getFileSize(size)}
          </p>
        </div>
        <Download className="h-5 w-5 flex-shrink-0" />
      </a>
    </div>
  )
}
