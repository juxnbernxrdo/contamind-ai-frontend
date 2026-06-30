'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showStatus?: boolean;
  status?: 'online' | 'offline';
}

const sizeMap = {
  sm: 'h-7 w-7 text-[11px]',
  md: 'h-8 w-8 text-[12px]',
  lg: 'h-9 w-9 text-sm',
};

const statusSizeMap = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
};

export function Avatar({
  src,
  alt = 'Avatar',
  initials = 'U',
  size = 'sm',
  className,
  showStatus = false,
  status = 'online',
}: AvatarProps) {
  const sizeClasses = sizeMap[size];
  const statusSize = statusSizeMap[size];

  return (
    <div className={cn('relative flex-shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            'rounded-full object-cover ring-2 ring-[var(--border-light)]',
            sizeClasses
          )}
        />
      ) : (
        <div
          className={cn(
            'flex items-center justify-center rounded-full font-bold shadow-sm',
            'bg-[var(--avatar-bg)] text-[var(--avatar-text)]',
            'transition-colors duration-300',
            sizeClasses
          )}
          aria-label={alt}
        >
          {initials}
        </div>
      )}
      {showStatus && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-[var(--white)]',
            status === 'online' ? 'bg-[var(--green)]' : 'bg-[var(--text-4)]',
            statusSize
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
