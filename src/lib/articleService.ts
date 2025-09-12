import { prisma } from './prisma';
import { uploadImageFromBase64, deleteImage } from './cloudinary';
import { logUserAction } from './audit';

export interface Article {
  id: string;
  title: string;
  title_en: string;
  body_es: string;
  body_en: string;
  imageUrl: string;
  author: string;
  date: Date;
  linkUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateArticleData {
  title: string;
  title_en: string;
  body_es: string;
  body_en: string;
  imageUrl: string; // Base64 string for new image
  author: string;
  date: Date;
  linkUrl: string | null;
}

export interface UpdateArticleData {
  title?: string;
  title_en?: string;
  body_es?: string;
  body_en?: string;
  imageUrl?: string; // Base64 string for new image or existing URL
  author?: string;
  date?: Date;
  linkUrl?: string | null;
  originalImageUrl?: string; // Original image URL for deletion
}

export const getAllArticles = async (): Promise<Article[]> => {
  return prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getArticleById = async (id: string): Promise<Article | null> => {
  return prisma.article.findUnique({
    where: { id },
  });
};

export const createArticle = async (data: CreateArticleData): Promise<Article> => {
  let uploadedImageUrl = data.imageUrl;
  if (data.imageUrl && data.imageUrl.startsWith('data:image')) {
    uploadedImageUrl = await uploadImageFromBase64(data.imageUrl, 'articles');
  }

  const newArticle = await prisma.article.create({
    data: {
      title: data.title,
      title_en: data.title_en,
      body_es: data.body_es,
      body_en: data.body_en,
      imageUrl: uploadedImageUrl,
      author: data.author,
      date: data.date,
      linkUrl: data.linkUrl,
    },
  });

  await logUserAction(1, 'CREATE', 'Article', newArticle); // Assuming userId 1 for now
  return newArticle;
};

export const updateArticle = async (id: string, data: UpdateArticleData): Promise<Article> => {
  let updatedImageUrl = data.imageUrl;

  if (data.imageUrl && data.imageUrl.startsWith('data:image')) {
    // New image uploaded, delete old one if it exists
    if (data.originalImageUrl) {
      await deleteImage(data.originalImageUrl);
    }
    updatedImageUrl = await uploadImageFromBase64(data.imageUrl, 'articles');
  } else if (data.imageUrl === null && data.originalImageUrl) {
    // Image explicitly removed
    await deleteImage(data.originalImageUrl);
    updatedImageUrl = ''; // Or a default placeholder image URL
  } else if (data.imageUrl === undefined) {
    // Image not changed, keep existing one
    const existingArticle = await prisma.article.findUnique({ where: { id } });
    updatedImageUrl = existingArticle?.imageUrl;
  }

  const updatedArticle = await prisma.article.update({
    where: { id },
    data: {
      title: data.title,
      title_en: data.title_en,
      body_es: data.body_es,
      body_en: data.body_en,
      imageUrl: updatedImageUrl,
      author: data.author,
      date: data.date,
      linkUrl: data.linkUrl,
    },
  });

  await logUserAction(1, 'UPDATE', 'Article', updatedArticle); // Assuming userId 1 for now
  return updatedArticle;
};

export const deleteArticle = async (id: string): Promise<Article> => {
  const articleToDelete = await prisma.article.findUnique({ where: { id } });
  if (!articleToDelete) {
    throw new Error('Article not found');
  }

  // Delete image from Cloudinary
  if (articleToDelete.imageUrl) {
    await deleteImage(articleToDelete.imageUrl);
  }

  const deletedArticle = await prisma.article.delete({
    where: { id },
  });

  await logUserAction(1, 'DELETE', 'Article', deletedArticle); // Assuming userId 1 for now
  return deletedArticle;
};
