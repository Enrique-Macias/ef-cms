'use client'

import { useState } from 'react'
import Image from 'next/image'
import { generateStyledAvatar } from '@/lib/avatar'
import { translateToEnglish, translateToSpanish } from '@/lib/translation'

interface UserCardProps {
  user: {
    id: number
    fullName: string
    email: string
    role: 'ADMIN' | 'EDITOR'
  }
}

export function UserCard({ user }: UserCardProps) {
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatedName, setTranslatedName] = useState<string | null>(null)

  const handleTranslate = async (targetLang: 'ES' | 'EN') => {
    setIsTranslating(true)
    try {
      let result: string
      if (targetLang === 'EN') {
        result = await translateToEnglish(user.fullName)
      } else {
        result = await translateToSpanish(user.fullName)
      }
      setTranslatedName(result)
    } catch (error) {
      console.error('Translation failed:', error)
    } finally {
      setIsTranslating(false)
    }
  }

  const avatarUrl = generateStyledAvatar(user.fullName, user.role.toLowerCase() as 'admin' | 'editor', 64)

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center space-x-4">
        <Image
          src={avatarUrl}
          alt={user.fullName}
          width={64}
          height={64}
          className="h-16 w-16 rounded-full"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {translatedName || user.fullName}
          </h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.role === 'ADMIN' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {user.role}
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => handleTranslate('EN')}
          disabled={isTranslating}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
        >
          {isTranslating ? 'Translating...' : 'Translate to EN'}
        </button>
        <button
          onClick={() => handleTranslate('ES')}
          disabled={isTranslating}
          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
        >
          {isTranslating ? 'Translating...' : 'Translate to ES'}
        </button>
        {translatedName && (
          <button
            onClick={() => setTranslatedName(null)}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Show Original
          </button>
        )}
      </div>
    </div>
  )
}
