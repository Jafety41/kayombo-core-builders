import React from 'react';

export interface Project {
  id: string;
  title: string;
  description?: string;
  location: string;
  category: string;
  image_url: string;
}

export interface Message {
  id: string;
  name: string;
  phone: string;
  details: string;
  created_at: string;
  is_read?: boolean;
}

export interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
}
