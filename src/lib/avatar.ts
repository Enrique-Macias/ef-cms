interface AvatarOptions {
  username: string;
  background?: string;
  color?: string;
  bold?: boolean;
  uppercase?: boolean;
  size?: number;
  format?: 'png' | 'jpg';
  length?: 1 | 2;
}

const AVATAR_API_BASE = 'https://avatar.iran.liara.run/username';

/**
 * Generate avatar URL using Avatar Placeholder API
 * @param options Avatar generation options
 * @returns Complete avatar URL
 */
export function generateAvatarUrl(options: AvatarOptions): string {
  const {
    username,
    background,
    color,
    bold = true,
    uppercase = true,
    size = 128,
    format = 'png',
    length = 2
  } = options;

  const params = new URLSearchParams();
  
  // Required parameter
  params.append('username', username);
  
  // Optional parameters
  if (background) params.append('background', background);
  if (color) params.append('color', color);
  if (bold !== undefined) params.append('bold', bold.toString());
  if (uppercase !== undefined) params.append('uppercase', uppercase.toString());
  if (size) params.append('size', size.toString());
  if (format) params.append('format', format);
  if (length) params.append('length', length.toString());

  return `${AVATAR_API_BASE}?${params.toString()}`;
}

/**
 * Generate avatar for user with consistent styling
 * @param fullName User's full name
 * @param size Avatar size in pixels
 * @returns Avatar URL with consistent styling
 */
export function generateUserAvatar(fullName: string, size: number = 128): string {
  return generateAvatarUrl({
    username: fullName,
    background: 'f4d9b2', // Warm beige background
    color: 'FF9800',      // Orange text
    bold: true,
    uppercase: true,
    size,
    format: 'png',
    length: 2
  });
}

/**
 * Generate small avatar for lists and tables
 * @param fullName User's full name
 * @returns Small avatar URL
 */
export function generateSmallAvatar(fullName: string): string {
  return generateUserAvatar(fullName, 40);
}

/**
 * Generate medium avatar for profile displays
 * @param fullName User's full name
 * @returns Medium avatar URL
 */
export function generateMediumAvatar(fullName: string): string {
  return generateUserAvatar(fullName, 128);
}

/**
 * Generate large avatar for profile pages
 * @param fullName User's full name
 * @returns Large avatar URL
 */
export function generateLargeAvatar(fullName: string): string {
  return generateUserAvatar(fullName, 256);
}

/**
 * Predefined avatar styles for different user types
 */
export const avatarStyles = {
  admin: {
    background: 'dc2626', // Red background
    color: 'ffffff',      // White text
  },
  editor: {
    background: '2563eb', // Blue background
    color: 'ffffff',      // White text
  },
  default: {
    background: 'f4d9b2', // Beige background
    color: 'FF9800',      // Orange text
  }
};

/**
 * Generate avatar with specific style
 * @param fullName User's full name
 * @param style Avatar style (admin, editor, default)
 * @param size Avatar size
 * @returns Styled avatar URL
 */
export function generateStyledAvatar(
  fullName: string, 
  style: keyof typeof avatarStyles = 'default',
  size: number = 128
): string {
  const styleConfig = avatarStyles[style];
  
  return generateAvatarUrl({
    username: fullName,
    background: styleConfig.background,
    color: styleConfig.color,
    bold: true,
    uppercase: true,
    size,
    format: 'png',
    length: 2
  });
}
