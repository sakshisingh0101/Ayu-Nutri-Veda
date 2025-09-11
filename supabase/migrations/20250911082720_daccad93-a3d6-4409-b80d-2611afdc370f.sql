-- Add additional profile fields to users table
ALTER TABLE public.users 
ADD COLUMN address TEXT,
ADD COLUMN date_of_birth DATE,
ADD COLUMN specialization TEXT,
ADD COLUMN experience TEXT,
ADD COLUMN qualifications TEXT,
ADD COLUMN bio TEXT,
ADD COLUMN consultation_fee NUMERIC(10,2),
ADD COLUMN availability TEXT,
ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();