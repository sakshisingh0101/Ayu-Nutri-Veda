-- Create messages table for patient-doctor communication
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create consultations table for scheduling
CREATE TABLE public.consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL,
  consultation_date TIMESTAMP WITH TIME ZONE NOT NULL,
  consultation_type TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'requested',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- RLS policies for messages
CREATE POLICY "Users can view their own messages"
ON public.messages
FOR SELECT
TO authenticated
USING (
  sender_id::text = auth.jwt()->>'sub' OR 
  recipient_id::text = auth.jwt()->>'sub'
);

CREATE POLICY "Users can send messages"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (sender_id::text = auth.jwt()->>'sub');

-- RLS policies for consultations
CREATE POLICY "Users can view their own consultations"
ON public.consultations
FOR SELECT
TO authenticated
USING (
  patient_id::text = auth.jwt()->>'sub' OR 
  doctor_id::text = auth.jwt()->>'sub'
);

CREATE POLICY "Patients can request consultations"
ON public.consultations
FOR INSERT
TO authenticated
WITH CHECK (patient_id::text = auth.jwt()->>'sub');

CREATE POLICY "Doctors can update consultations"
ON public.consultations
FOR UPDATE
TO authenticated
USING (doctor_id::text = auth.jwt()->>'sub');

-- Create update triggers for timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at
BEFORE UPDATE ON public.consultations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();