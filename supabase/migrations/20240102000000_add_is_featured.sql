-- Add is_featured column to menu_items for homepage featured selection
ALTER TABLE public.menu_items
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;
