# Learning Progression System - Game-like Flow

## Konsep Progression System

### 1. Material Progression (Step-by-step)
- **Level 1**: Pengenalan Gerbang Logika (INTRODUCTION)
- **Level 2**: Gerbang Dasar - AND, OR, NOT (BASIC_GATES)  
- **Level 3**: Gerbang Turunan - NAND, NOR, XOR, XNOR (ADVANCED_GATES)
- **Level 4**: Tabel Kebenaran (TRUTH_TABLES)
- **Level 5**: Aplikasi & Rangkaian (APPLICATIONS)

### 2. Quiz Progression (Unlock by Material + Previous Quiz)
- **Quiz 1**: Simbol Gerbang (GATE_SYMBOLS) - Unlock: Level 1 completed
- **Quiz 2**: Gerbang Dasar (BASIC_GATES) - Unlock: Level 2 completed + Quiz 1 passed
- **Quiz 3**: Gerbang Turunan (ADVANCED_GATES) - Unlock: Level 3 completed + Quiz 2 passed  
- **Quiz 4**: Tabel Kebenaran (TRUTH_TABLE) - Unlock: Level 4 completed + Quiz 3 passed

### 3. Passing Requirements
- **Material**: Read completion (scroll/time based)
- **Quiz**: Minimum 70% score untuk unlock next level

## Database Schema Extension

Perlu menambahkan tabel untuk tracking progression:

```sql
-- User progress tracking
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    material_level INTEGER DEFAULT 1, -- Current unlocked material level
    quiz_level INTEGER DEFAULT 0,     -- Current unlocked quiz level (0 = none unlocked)
    completed_materials INTEGER[] DEFAULT ARRAY[],  -- Array of completed material IDs
    passed_quizzes TEXT[] DEFAULT ARRAY[],          -- Array of passed quiz codes
    total_xp INTEGER DEFAULT 0,       -- Experience points (gamification)
    streak_days INTEGER DEFAULT 0,    -- Daily streak
    last_activity DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);
```

## Features to Implement

### 1. Locked/Unlocked UI States
- 🔒 Locked (gray, disabled)
- ✅ Completed (green checkmark)
- 🟡 Current/Available (highlighted)
- ⭐ Excellent completion (special badge)

### 2. Gamification Elements
- **XP Points**: Material completion (+10), Quiz pass (+50), Perfect score (+100)
- **Streaks**: Daily learning streak counter
- **Badges**: Achievement system
- **Progress Bars**: Visual completion indicators

### 3. Smooth Animations
- Unlock animations (confetti, slide-in)
- Progress bar animations
- Badge earning celebrations
