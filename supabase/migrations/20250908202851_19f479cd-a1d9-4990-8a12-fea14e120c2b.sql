-- Update consultations table to use text identifiers instead of UUIDs for manual auth
ALTER TABLE public.consultations 
ALTER COLUMN patient_id TYPE TEXT,
ALTER COLUMN doctor_id TYPE TEXT;

-- Update the RLS policies to work with text identifiers
DROP POLICY IF EXISTS "Users can view their own consultations" ON public.consultations;
DROP POLICY IF EXISTS "Patients can request consultations" ON public.consultations;
DROP POLICY IF EXISTS "Doctors can update consultations" ON public.consultations;

-- Create new policies for text-based identifiers
CREATE POLICY "Users can view their own consultations" 
ON public.consultations 
FOR SELECT 
USING (patient_id = current_setting('app.current_user_email', true) OR doctor_id = current_setting('app.current_user_email', true));

CREATE POLICY "Anyone can create consultations" 
ON public.consultations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update consultations" 
ON public.consultations 
FOR UPDATE 
USING (true);