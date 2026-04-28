import { supabase } from '../lib/supabaseClient';

export const login = async (formData) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });
  if (error) throw error;
  return { data: { token: data.session.access_token, user: data.user } };
};

export const register = async (formData) => {
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: { name: formData.name, role: formData.role }
    }
  });
  if (error) throw error;
  return { data: { token: data.session?.access_token, user: data.user } };
};

export const fetchMe = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return { data: data.user };
};

export const fetchAlerts = async () => {
  const { data, error } = await supabase.from('incidents').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return { data };
};

export const createAlert = async (newAlert) => {
  const { data, error } = await supabase.from('incidents').insert([{
    type: newAlert.type,
    location: newAlert.location,
    severity: newAlert.severity,
    description: newAlert.description,
    status: 'active',
  }]).select();
  if (error) throw error;
  return { data: data[0] };
};

export const updateAlertStatus = async (id, status) => {
  const { data, error } = await supabase.from('incidents').update({ status }).eq('id', id).select();
  if (error) throw error;
  return { data: data[0] };
};

export const fetchStats = async () => {
  const { data, error } = await supabase.from('incidents').select('status');
  if (error) throw error;
  const total = data.length;
  const active = data.filter(d => d.status === 'active').length;
  const resolved = data.filter(d => d.status === 'resolved').length;
  return { data: { total, active, resolved, avgResponseTime: 'N/A' } };
};

export const fetchResources = async () => {
  const { data, error } = await supabase.from('resources').select('*');
  if (error) throw error;
  return { data };
};

export const updateResource = async (id, deployed) => {
  const { data, error } = await supabase.from('resources').update({ available: deployed ? 0 : 1 }).eq('id', id).select();
  if (error) throw error;
  return { data: data[0] };
};

export const fetchDistribution = async () => { return { data: [] }; };
export const fetchTrends = async () => { return { data: [] }; };
export const fetchResponseTrends = async () => { return { data: [] }; };

export default { login, register, fetchMe, fetchAlerts, createAlert, updateAlertStatus, fetchStats, fetchResources, updateResource, fetchDistribution, fetchTrends, fetchResponseTrends };
