import { prisma } from './prisma'

export interface Team {
  id: string
  name: string
  role: string
  role_en: string
  instagram_url: string | null
  facebook_url: string | null
  x_url: string | null
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateTeamData {
  name: string
  role: string
  role_en: string
  instagram_url?: string | null
  facebook_url?: string | null
  x_url?: string | null
  imageUrl: string
}

export interface UpdateTeamData {
  id: string
  name?: string
  role?: string
  role_en?: string
  instagram_url?: string | null
  facebook_url?: string | null
  x_url?: string | null
  imageUrl?: string
}

// Create a new team member
export const createTeam = async (data: CreateTeamData): Promise<Team> => {
  const team = await prisma.team.create({
    data: {
      name: data.name,
      role: data.role,
      role_en: data.role_en,
      instagram_url: data.instagram_url || null,
      facebook_url: data.facebook_url || null,
      x_url: data.x_url || null,
      imageUrl: data.imageUrl,
    },
  })
  return team
}

// Get all team members
export const getAllTeams = async (): Promise<Team[]> => {
  const teams = await prisma.team.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
  return teams
}

// Get a single team member by ID
export const getTeamById = async (id: string): Promise<Team | null> => {
  const team = await prisma.team.findUnique({
    where: { id },
  })
  return team
}

// Update a team member
export const updateTeam = async (id: string, data: UpdateTeamData): Promise<Team> => {
  const team = await prisma.team.update({
    where: { id },
    data: {
      name: data.name,
      role: data.role,
      role_en: data.role_en,
      instagram_url: data.instagram_url,
      facebook_url: data.facebook_url,
      x_url: data.x_url,
      imageUrl: data.imageUrl,
    },
  })
  return team
}

// Delete a team member
export const deleteTeam = async (id: string): Promise<void> => {
  await prisma.team.delete({
    where: { id },
  })
}

// Get team statistics
export const getTeamStats = async () => {
  const totalTeams = await prisma.team.count()
  
  return {
    totalTeams,
  }
}
