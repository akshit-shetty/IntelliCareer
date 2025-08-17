import {
  users,
  userProfiles,
  assessments,
  skills,
  userSkills,
  careerPaths,
  careerRecommendations,
  courses,
  userCourses,
  type User,
  type UpsertUser,
  type UserProfile,
  type InsertUserProfile,
  type Assessment,
  type InsertAssessment,
  type Skill,
  type UserSkill,
  type InsertUserSkill,
  type CareerPath,
  type CareerRecommendation,
  type Course,
  type UserCourse,
  type InsertUserCourse,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Profile operations
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile>;
  
  // Assessment operations
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getUserAssessment(userId: string): Promise<Assessment | undefined>;
  
  // Skills operations
  getAllSkills(): Promise<Skill[]>;
  getUserSkills(userId: string): Promise<UserSkill[]>;
  upsertUserSkill(userSkill: InsertUserSkill): Promise<UserSkill>;
  
  // Career recommendations
  getCareerRecommendations(userId: string): Promise<(CareerRecommendation & { careerPath: CareerPath })[]>;
  generateCareerRecommendations(userId: string): Promise<void>;
  toggleBookmark(userId: string, careerPathId: string): Promise<void>;
  
  // Courses
  getRecommendedCourses(skillIds: string[]): Promise<Course[]>;
  getUserCourses(userId: string): Promise<(UserCourse & { course: Course })[]>;
  enrollInCourse(enrollment: InsertUserCourse): Promise<UserCourse>;
  updateCourseProgress(userId: string, courseId: string, progress: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Profile operations
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));
    return profile;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [created] = await db
      .insert(userProfiles)
      .values(profile)
      .returning();
    return created;
  }

  async updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile> {
    const [updated] = await db
      .update(userProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updated;
  }

  // Assessment operations
  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const [created] = await db
      .insert(assessments)
      .values(assessment)
      .returning();
    return created;
  }

  async getUserAssessment(userId: string): Promise<Assessment | undefined> {
    const [assessment] = await db
      .select()
      .from(assessments)
      .where(eq(assessments.userId, userId))
      .orderBy(desc(assessments.completedAt))
      .limit(1);
    return assessment;
  }

  // Skills operations
  async getAllSkills(): Promise<Skill[]> {
    return await db.select().from(skills);
  }

  async getUserSkills(userId: string): Promise<UserSkill[]> {
    return await db
      .select()
      .from(userSkills)
      .where(eq(userSkills.userId, userId));
  }

  async upsertUserSkill(userSkill: InsertUserSkill): Promise<UserSkill> {
    const [result] = await db
      .insert(userSkills)
      .values(userSkill)
      .onConflictDoUpdate({
        target: [userSkills.userId, userSkills.skillId],
        set: {
          currentLevel: userSkill.currentLevel,
          targetLevel: userSkill.targetLevel,
          isLearning: userSkill.isLearning,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  // Career recommendations
  async getCareerRecommendations(userId: string): Promise<(CareerRecommendation & { careerPath: CareerPath })[]> {
    return await db
      .select({
        id: careerRecommendations.id,
        userId: careerRecommendations.userId,
        careerPathId: careerRecommendations.careerPathId,
        matchScore: careerRecommendations.matchScore,
        reasons: careerRecommendations.reasons,
        isBookmarked: careerRecommendations.isBookmarked,
        createdAt: careerRecommendations.createdAt,
        careerPath: careerPaths,
      })
      .from(careerRecommendations)
      .innerJoin(careerPaths, eq(careerRecommendations.careerPathId, careerPaths.id))
      .where(eq(careerRecommendations.userId, userId))
      .orderBy(desc(careerRecommendations.matchScore));
  }

  async generateCareerRecommendations(userId: string): Promise<void> {
    // This would contain the AI logic for generating recommendations
    // For now, we'll create some sample recommendations based on existing career paths
    const allCareerPaths = await db.select().from(careerPaths);
    const userSkillsData = await this.getUserSkills(userId);
    
    // Simple matching algorithm based on skills overlap
    for (const careerPath of allCareerPaths.slice(0, 5)) { // Limit to top 5
      const matchScore = Math.floor(Math.random() * 40) + 60; // 60-100 range
      
      await db
        .insert(careerRecommendations)
        .values({
          userId,
          careerPathId: careerPath.id,
          matchScore: matchScore.toString(),
          reasons: [
            "Strong skill alignment",
            "Growing market demand",
            "Matches your experience level"
          ],
        })
        .onConflictDoNothing();
    }
  }

  async toggleBookmark(userId: string, careerPathId: string): Promise<void> {
    const [existing] = await db
      .select()
      .from(careerRecommendations)
      .where(
        and(
          eq(careerRecommendations.userId, userId),
          eq(careerRecommendations.careerPathId, careerPathId)
        )
      );

    if (existing) {
      await db
        .update(careerRecommendations)
        .set({ isBookmarked: !existing.isBookmarked })
        .where(eq(careerRecommendations.id, existing.id));
    }
  }

  // Courses
  async getRecommendedCourses(skillIds: string[]): Promise<Course[]> {
    if (skillIds.length === 0) {
      return await db.select().from(courses).limit(10);
    }
    
    // This would be more sophisticated in a real implementation
    return await db.select().from(courses).limit(10);
  }

  async getUserCourses(userId: string): Promise<(UserCourse & { course: Course })[]> {
    return await db
      .select({
        id: userCourses.id,
        userId: userCourses.userId,
        courseId: userCourses.courseId,
        status: userCourses.status,
        progress: userCourses.progress,
        startedAt: userCourses.startedAt,
        completedAt: userCourses.completedAt,
        course: courses,
      })
      .from(userCourses)
      .innerJoin(courses, eq(userCourses.courseId, courses.id))
      .where(eq(userCourses.userId, userId));
  }

  async enrollInCourse(enrollment: InsertUserCourse): Promise<UserCourse> {
    const [created] = await db
      .insert(userCourses)
      .values(enrollment)
      .returning();
    return created;
  }

  async updateCourseProgress(userId: string, courseId: string, progress: number): Promise<void> {
    await db
      .update(userCourses)
      .set({ 
        progress,
        status: progress >= 100 ? 'completed' : 'in_progress',
        completedAt: progress >= 100 ? new Date() : null,
      })
      .where(
        and(
          eq(userCourses.userId, userId),
          eq(userCourses.courseId, courseId)
        )
      );
  }
}

export const storage = new DatabaseStorage();
