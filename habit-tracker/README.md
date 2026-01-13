# 🎯 Consistency - Habit Tracker App

A beautiful, modern habit tracker application built with React and Supabase. Track your daily habits, build streaks, and achieve your goals with an intuitive and visually appealing interface inspired by Everyday Habits.

![Habit Tracker](https://img.shields.io/badge/React-18.x-blue)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-cyan)

## ✨ Features

- 📝 **Create & Manage Habits** - Add, edit, and delete habits with custom icons and colors
- ✅ **Daily Tracking** - Check off habits as you complete them each day
- 🔥 **Streak Counter** - Track your consistency with streak calculations
- 📊 **Statistics Dashboard** - View completion rates, streaks, and progress over time
- 🎨 **Beautiful UI** - Modern, gradient-based design with smooth animations
- 💾 **Cloud Sync** - All data synced with Supabase backend
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account (free tier available at [supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   cd habit-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   a. Create a new project at [supabase.com](https://supabase.com)

   b. Go to your project's SQL Editor and run the schema from `supabase-schema.sql`:
   ```sql
   -- Copy and paste the contents of supabase-schema.sql
   ```

   c. Get your project credentials:
      - Go to Settings > API
      - Copy your `Project URL` and `anon/public` API key

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
habit-tracker/
├── src/
│   ├── components/           # React components
│   │   ├── Header.jsx       # App header with navigation
│   │   ├── HabitList.jsx    # List of all habits
│   │   ├── HabitCard.jsx    # Individual habit card
│   │   ├── AddHabitModal.jsx # Modal for creating habits
│   │   ├── EditHabitModal.jsx # Modal for editing habits
│   │   └── StatsView.jsx    # Statistics dashboard
│   ├── context/             # React context
│   │   └── HabitContext.jsx # Global habit state management
│   ├── services/            # API services
│   │   └── habitService.js  # Supabase CRUD operations
│   ├── lib/                 # Libraries
│   │   └── supabase.js      # Supabase client configuration
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles with Tailwind
├── supabase-schema.sql      # Database schema
├── .env.example             # Environment variables template
└── package.json             # Dependencies
```

## 🎨 UI Features

### Habit Management
- **Custom Icons**: Choose from 15+ emoji icons for each habit
- **Color Coding**: Select from 10 vibrant colors to categorize habits
- **Descriptions**: Add optional descriptions to remember why each habit matters
- **Frequency Settings**: Set habits as daily, weekly, or custom

### Tracking Interface
- **Quick Check-off**: Tap the circle to mark habits as complete
- **Visual Feedback**: Completed habits show with green checkmarks and animations
- **Progress Indicators**: See your completion status at a glance
- **Easy Editing**: Access edit and delete options from the menu

### Statistics View
- **Overview Cards**: See total habits, completion rate, completed days, and best streak
- **Individual Stats**: Detailed breakdown for each habit including:
  - 30-day completion rate
  - Days completed vs. missed
  - Current streak with fire emoji
  - Visual progress bars

## 🗄️ Database Schema

The app uses two main tables:

### `habits`
- Stores habit information (name, description, icon, color, frequency)
- Tracks active/inactive status
- Maintains order for display

### `habit_completions`
- Records when habits are completed
- Links to habits via foreign key
- Stores date and optional notes
- Unique constraint on habit_id + date

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.x
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📝 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔒 Security Notes

- The current schema uses public access policies for simplicity
- For production, implement Row Level Security (RLS) with authentication
- Never commit your `.env` file with real credentials
- Use environment-specific configurations for different deployments

## 🎯 Usage Tips

1. **Start Small**: Begin with 2-3 habits and build from there
2. **Be Consistent**: Check off habits at the same time each day
3. **Track Meaningful Habits**: Focus on habits that align with your goals
4. **Review Stats**: Use the statistics view to identify patterns and improve
5. **Celebrate Streaks**: Watch your streaks grow and celebrate milestones!

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables
5. Deploy!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## 💬 Support

If you encounter any issues:
1. Check that your Supabase credentials are correct
2. Ensure the database schema is properly set up
3. Verify your environment variables are loaded
4. Check the browser console for any errors

## 🎉 Acknowledgments

- Inspired by the Everyday Habits app
- Built with love for building better habits
- Powered by Supabase and React

---

**Made with ❤️ for building consistency**

*"We are what we repeatedly do. Excellence, then, is not an act, but a habit." - Aristotle*
