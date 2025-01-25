-- Create cute names table
create table public.cute_names (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    taken boolean not null default false
);

-- Enable RLS
alter table public.cute_names enable row level security;

-- Anyone can read cute names
create policy "Anyone can view cute names"
on public.cute_names for select
to authenticated
using (true);

-- Insert some initial cute names
insert into public.cute_names (name)
values
    ('★ Stardust ✧'),
    ('✿ Blossom ✿'),
    ('☁️ Cloudy ☁️'),
    ('🌸 Cherry 🌸'),
    ('✨ Sparkle ✨'),
    ('🌟 Nova 🌟'),
    ('🎀 Ribbon 🎀'),
    ('💫 Comet 💫'),
    ('🌈 Rainbow 🌈'),
    ('💝 Heart 💝'),
    ('🦋 Flutter 🦋'),
    ('🌺 Lotus 🌺'),
    ('⭐ Twinkle ⭐'),
    ('🍪 Cookie 🍪'),
    ('🎮 Pixel 🎮');
