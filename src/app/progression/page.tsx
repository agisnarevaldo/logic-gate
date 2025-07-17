'use client';

import React from 'react';
import { FeaturePageLayout } from '@/components/feature-page-layout';
import { ProgressionPath } from '@/components/progression/progression-path';
import { Sparkles } from 'lucide-react';

export default function ProgressionPage() {
  return (
    <FeaturePageLayout
      title="Jalur Pembelajaran"
      icon={<Sparkles className="w-6 h-6" />}
      bgColor="bg-gradient-to-r from-blue-500 to-purple-500"
    >
      <ProgressionPath />
    </FeaturePageLayout>
  );
}
