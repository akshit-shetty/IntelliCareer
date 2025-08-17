import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User profiles with additional career information
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  age: varchar("age"),
  experienceLevel: varchar("experience_level"),
  educationLevel: varchar("education_level"),
  currentField: varchar("current_field"),
  careerGoals: text("career_goals"),
  completedOnboarding: boolean("completed_onboarding").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Psychometric assessment results
export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  personalityTraits: jsonb("personality_traits"), // Big Five scores
  interestAreas: jsonb("interest_areas"), // RIASEC scores
  workValues: jsonb("work_values"),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Skills master list
export const skills = pgTable("skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull().unique(),
  category: varchar("category").notNull(), // technical, soft, domain-specific
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User skills with proficiency levels
export const userSkills = pgTable("user_skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  skillId: varchar("skill_id").notNull().references(() => skills.id),
  currentLevel: integer("current_level").notNull(), // 1-5 scale
  targetLevel: integer("target_level"), // 1-5 scale
  isLearning: boolean("is_learning").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Career paths master list
export const careerPaths = pgTable("career_paths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  demandLevel: varchar("demand_level"), // high, medium, low
  growthOutlook: varchar("growth_outlook"), // growing, stable, declining
  requiredSkills: jsonb("required_skills"), // array of skill requirements
  createdAt: timestamp("created_at").defaultNow(),
});

// User career recommendations
export const careerRecommendations = pgTable("career_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  careerPathId: varchar("career_path_id").notNull().references(() => careerPaths.id),
  matchScore: decimal("match_score", { precision: 5, scale: 2 }), // 0-100
  reasons: jsonb("reasons"), // array of reasons for recommendation
  isBookmarked: boolean("is_bookmarked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Learning resources/courses
export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  provider: varchar("provider").notNull(), // Coursera, edX, LinkedIn Learning, etc.
  description: text("description"),
  url: varchar("url"),
  duration: varchar("duration"),
  difficultyLevel: varchar("difficulty_level"), // beginner, intermediate, advanced
  cost: varchar("cost"),
  skillsCovered: jsonb("skills_covered"), // array of skill IDs
  rating: decimal("rating", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// User course enrollments and progress
export const userCourses = pgTable("user_courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  status: varchar("status").notNull(), // enrolled, in_progress, completed, dropped
  progress: integer("progress").default(0), // 0-100
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Define relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  assessments: many(assessments),
  skills: many(userSkills),
  recommendations: many(careerRecommendations),
  courses: many(userCourses),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const assessmentsRelations = relations(assessments, ({ one }) => ({
  user: one(users, {
    fields: [assessments.userId],
    references: [users.id],
  }),
}));

export const userSkillsRelations = relations(userSkills, ({ one }) => ({
  user: one(users, {
    fields: [userSkills.userId],
    references: [users.id],
  }),
  skill: one(skills, {
    fields: [userSkills.skillId],
    references: [skills.id],
  }),
}));

export const careerRecommendationsRelations = relations(careerRecommendations, ({ one }) => ({
  user: one(users, {
    fields: [careerRecommendations.userId],
    references: [users.id],
  }),
  careerPath: one(careerPaths, {
    fields: [careerRecommendations.careerPathId],
    references: [careerPaths.id],
  }),
}));

export const userCoursesRelations = relations(userCourses, ({ one }) => ({
  user: one(users, {
    fields: [userCourses.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [userCourses.courseId],
    references: [courses.id],
  }),
}));

// Export types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;
export type Skill = typeof skills.$inferSelect;
export type UserSkill = typeof userSkills.$inferSelect;
export type InsertUserSkill = typeof userSkills.$inferInsert;
export type CareerPath = typeof careerPaths.$inferSelect;
export type CareerRecommendation = typeof careerRecommendations.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type UserCourse = typeof userCourses.$inferSelect;
export type InsertUserCourse = typeof userCourses.$inferInsert;

// Validation schemas
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  completedAt: true,
});

export const insertUserSkillSchema = createInsertSchema(userSkills).omit({
  id: true,
  updatedAt: true,
});
