import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface User {
  id: number
  Email: string
  FullName: string
  User_type: string // Changed to string to match actual data
  PhoneNumber?: number
  Password?: string
  password_hash?: string
}

interface Consultation {
  id: string
  patient_id: string
  doctor_id: string
  consultation_date: string
  status: string
  consultation_type: string
  notes?: string
}

interface Message {
  id: string
  sender_id: string
  recipient_id: string
  message: string
  read: boolean
  created_at: string
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('id', { ascending: true })

      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()

    // Set up realtime subscription
    const channel = supabase
      .channel('users-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' },
        () => {
          fetchUsers()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { users, loading, error, refetch: fetchUsers }
}

export const useConsultations = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConsultations = async () => {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('consultation_date', { ascending: true })

      if (error) throw error
      setConsultations(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConsultations()

    // Set up realtime subscription
    const channel = supabase
      .channel('consultations-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'consultations' },
        () => {
          fetchConsultations()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { consultations, loading, error, refetch: fetchConsultations }
}

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()

    // Set up realtime subscription
    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'messages' },
        () => {
          fetchMessages()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { messages, loading, error, refetch: fetchMessages }
}

// Create admin user utility
export const createAdminUser = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        Email: 'soumya30garg@gmail.com',
        FullName: 'Admin User',
        User_type: 'admin',
        Password: 'soumya30garg',
        PhoneNumber: 1234567890
      })
      .select()

    if (error) throw error
    return { data, error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to create admin user' }
  }
}