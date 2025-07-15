-- Create tables for our application

-- Users table (handled by Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CVs table - Updated with all required fields
create table public.cvs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  full_name text,
  job_title text,
  email text,
  phone text,
  location text,
  linkedin_url text,
  portfolio_url text,
  website text,
  summary text,
  experiences jsonb default '[]',
  education jsonb default '[]',
  skills jsonb default '[]',
  projects jsonb default '[]',
  languages jsonb default '[]',
  references jsonb default '[]',
  certifications text,
  template_id text default 'modern',
  is_public boolean default false,
  is_primary boolean default false,
  ats_score integer default 0,
  file_url text,
  file_name text,
  file_size integer,
  content_type text default 'manual',
  content jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Interview Questions table
create table public.interview_questions (
  id uuid default uuid_generate_v4() primary key,
  category text not null,
  question text not null,
  difficulty text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Interview Answers table
create table public.interview_answers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  question_id uuid references public.interview_questions(id) on delete cascade not null,
  answer text not null,
  feedback jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Jobs table
create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  employer_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  requirements text[] not null,
  location text not null,
  type text not null,
  status text default 'active' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Job Applications table
create table public.job_applications (
  id uuid default uuid_generate_v4() primary key,
  job_id uuid references public.jobs(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  cv_id uuid references public.cvs(id) on delete cascade not null,
  cover_letter text,
  status text default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index cvs_user_id_idx on public.cvs(user_id);
create index cvs_template_id_idx on public.cvs(template_id);
create index cvs_created_at_idx on public.cvs(created_at);
create index interview_answers_user_id_idx on public.interview_answers(user_id);
create index jobs_employer_id_idx on public.jobs(employer_id);
create index job_applications_job_id_idx on public.job_applications(job_id);
create index job_applications_user_id_idx on public.job_applications(user_id);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.cvs enable row level security;
alter table public.interview_questions enable row level security;
alter table public.interview_answers enable row level security;
alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- CV policies
create policy "Users can view their own CVs"
  on public.cvs for select
  using (auth.uid() = user_id);

create policy "Users can create their own CVs"
  on public.cvs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own CVs"
  on public.cvs for update
  using (auth.uid() = user_id);

create policy "Users can delete their own CVs"
  on public.cvs for delete
  using (auth.uid() = user_id);

create policy "Public CVs are viewable by everyone"
  on public.cvs for select
  using (is_public = true);

-- Interview questions policies
create policy "Anyone can view interview questions"
  on public.interview_questions for select
  using (true);

-- Interview answers policies
create policy "Users can view their own answers"
  on public.interview_answers for select
  using (auth.uid() = user_id);

create policy "Users can create their own answers"
  on public.interview_answers for insert
  with check (auth.uid() = user_id);

-- Jobs policies
create policy "Anyone can view active jobs"
  on public.jobs for select
  using (status = 'active');

create policy "Employers can create jobs"
  on public.jobs for insert
  with check (auth.uid() = employer_id);

create policy "Employers can update their own jobs"
  on public.jobs for update
  using (auth.uid() = employer_id);

-- Job applications policies
create policy "Users can view their own applications"
  on public.job_applications for select
  using (auth.uid() = user_id);

create policy "Employers can view applications for their jobs"
  on public.job_applications for select
  using (
    exists (
      select 1 from public.jobs
      where jobs.id = job_applications.job_id
      and jobs.employer_id = auth.uid()
    )
  );

create policy "Users can create applications"
  on public.job_applications for insert
  with check (auth.uid() = user_id); 