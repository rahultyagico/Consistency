-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#0ea5e9',
  icon VARCHAR(50) DEFAULT '🎯',
  frequency VARCHAR(20) DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'custom')),
  target_days INTEGER[] DEFAULT ARRAY[0,1,2,3,4,5,6],
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0
);

-- Create habit_completions table
CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  UNIQUE(habit_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_habits_active ON habits(is_active);
CREATE INDEX IF NOT EXISTS idx_habits_order ON habits(order_index);
CREATE INDEX IF NOT EXISTS idx_completions_habit ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_completions_date ON habit_completions(date);
CREATE INDEX IF NOT EXISTS idx_completions_habit_date ON habit_completions(habit_id, date);

-- Enable Row Level Security
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you can modify these for authenticated users)
CREATE POLICY "Enable read access for all users" ON habits FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON habits FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON habits FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON habits FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON habit_completions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON habit_completions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON habit_completions FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON habit_completions FOR DELETE USING (true);
