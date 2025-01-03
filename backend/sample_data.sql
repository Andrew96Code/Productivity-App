-- Insert sample quiz questions
insert into quizzes (question, options, correct_answer, difficulty_level) values
(
    'What is the most effective way to build a new habit?',
    '["Start big and ambitious", "Start small and consistent", "Wait for motivation", "Change everything at once"]'::jsonb,
    'Start small and consistent',
    'easy'
),
(
    'How many days does it typically take to form a new habit?',
    '["21 days", "66 days", "7 days", "100 days"]'::jsonb,
    '66 days',
    'medium'
),
(
    'Which technique is most effective for maintaining focus during work?',
    '["Multitasking", "Pomodoro Technique", "Working longer hours", "Constant email checking"]'::jsonb,
    'Pomodoro Technique',
    'easy'
),
(
    'What is the recommended duration for a power nap?',
    '["10-20 minutes", "1 hour", "2 hours", "30-40 minutes"]'::jsonb,
    '10-20 minutes',
    'medium'
),
(
    'Which of these is a key principle of time management?',
    '["Do everything yourself", "Prioritize tasks", "Work longer hours", "Never take breaks"]'::jsonb,
    'Prioritize tasks',
    'easy'
); 