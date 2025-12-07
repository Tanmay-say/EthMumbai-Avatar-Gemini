-- Create table for generated avatars
CREATE TABLE public.avatars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  original_photo_url TEXT,
  generated_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.avatars ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required)
CREATE POLICY "Avatars are viewable by everyone" 
ON public.avatars 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create avatars" 
ON public.avatars 
FOR INSERT 
WITH CHECK (true);

-- Create storage bucket for avatar images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- Create storage policies for public access
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload avatar images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars');