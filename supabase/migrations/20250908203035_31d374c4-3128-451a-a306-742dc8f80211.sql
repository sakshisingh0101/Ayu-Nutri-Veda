-- First drop all existing policies
DROP POLICY IF EXISTS "Users can view their own consultations" ON public.consultations;
DROP POLICY IF EXISTS "Patients can request consultations" ON public.consultations;
DROP POLICY IF EXISTS "Doctors can update consultations" ON public.consultations;

-- Now alter the column types from uuid to text
ALTER TABLE public.consultations 
ALTER COLUMN patient_id TYPE TEXT,
ALTER COLUMN doctor_id TYPE TEXT;

-- Create new simple policies for text-based identifiers
CREATE POLICY "Anyone can view consultations" 
ON public.consultations 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create consultations" 
ON public.consultations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update consultations" 
ON public.consultations 
FOR UPDATE 
USING (true);