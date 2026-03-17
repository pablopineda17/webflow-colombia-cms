import { useRef, useState } from 'react'
import { UploadCloud, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface ImageUploadFieldProps {
  label: string
  bucket: string
  value: string | null
  onChange: (url: string | null) => void
}

export default function ImageUploadField({ label, bucket, value, onChange }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
      onChange(data.publicUrl)
    } catch (err) {
      console.error(err)
      alert('Error uploading image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-gray-200">
          <img src={value} alt="" className="w-full h-28 object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-28 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-1" />
              <span className="text-xs">Uploading…</span>
            </>
          ) : (
            <>
              <UploadCloud size={20} className="mb-1" />
              <span className="text-xs">Click to upload</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
