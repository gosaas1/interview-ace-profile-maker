import React from 'react';
import { cn } from '@/lib/utils';
import { type CVTemplate } from '@/data/cvTemplates';

interface TemplatePreviewProps {
  template: CVTemplate;
  className?: string;
  showContent?: boolean;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  className,
  showContent = true
}) => {
  const getTemplateStyle = () => {
    switch (template.colorScheme) {
      case 'blue':
        return {
          header: 'bg-blue-600',
          accent: 'text-blue-600',
          border: 'border-blue-200'
        };
      case 'emerald':
        return {
          header: 'bg-emerald-600',
          accent: 'text-emerald-600',
          border: 'border-emerald-200'
        };
      case 'amber':
        return {
          header: 'bg-amber-600',
          accent: 'text-amber-600',
          border: 'border-amber-200'
        };
      case 'rose':
        return {
          header: 'bg-rose-600',
          accent: 'text-rose-600',
          border: 'border-rose-200'
        };
      case 'gray':
        return {
          header: 'bg-gray-700',
          accent: 'text-gray-700',
          border: 'border-gray-200'
        };
      default:
        return {
          header: 'bg-blue-600',
          accent: 'text-blue-600',
          border: 'border-blue-200'
        };
    }
  };

  const styles = getTemplateStyle();

  const renderLayout = () => {
    switch (template.layout) {
      case 'single-column':
        return (
          <div className="w-full h-full bg-white">
            {/* Header */}
            <div className={cn("h-12", styles.header)}></div>
            
            {/* Content */}
            <div className="p-3 space-y-2">
              {/* Name */}
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              {/* Title */}
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              {/* Contact */}
              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
              
              {/* Section */}
              <div className="h-3 bg-gray-400 rounded w-1/4 mt-3"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-4/5"></div>
              <div className="h-2 bg-gray-200 rounded w-3/5"></div>
              
              {/* Section */}
              <div className="h-3 bg-gray-400 rounded w-1/4 mt-3"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        );

      case 'two-column':
        return (
          <div className="w-full h-full bg-white flex">
            {/* Left Column */}
            <div className="w-1/3 bg-gray-50 p-2">
              <div className={cn("h-8 rounded mb-2", styles.header)}></div>
              <div className="space-y-1">
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="w-2/3 p-2 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
              
              <div className="h-3 bg-gray-400 rounded w-1/4 mt-2"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        );

      case 'modern':
        return (
          <div className="w-full h-full bg-white">
            {/* Modern Header */}
            <div className={cn("h-16 relative", styles.header)}>
              <div className="absolute bottom-2 left-3 right-3">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-3 bg-white/20 rounded w-1/2 mt-1"></div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-4/5"></div>
              
              <div className="h-3 bg-gray-400 rounded w-1/4 mt-2"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-3/5"></div>
            </div>
          </div>
        );

      case 'classic':
        return (
          <div className="w-full h-full bg-white">
            {/* Classic Header */}
            <div className="p-3 border-b-2 border-gray-300">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
            </div>
            
            {/* Content */}
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-400 rounded w-1/4"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-4/5"></div>
              
              <div className="h-3 bg-gray-400 rounded w-1/4 mt-2"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-3/5"></div>
            </div>
          </div>
        );

      case 'creative':
        return (
          <div className="w-full h-full bg-white">
            {/* Creative Header */}
            <div className="relative">
              <div className={cn("h-8", styles.header)}></div>
              <div className="absolute -bottom-2 left-3 right-3">
                <div className="h-6 bg-white rounded shadow-sm border border-gray-200 p-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-3 pt-4 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              
              <div className="h-3 bg-gray-400 rounded w-1/4 mt-2"></div>
              <div className="h-2 bg-gray-200 rounded w-4/5"></div>
              <div className="h-2 bg-gray-200 rounded w-3/5"></div>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-white">
            <div className={cn("h-12", styles.header)}></div>
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={cn("w-full h-full rounded-lg overflow-hidden shadow-sm", className)}>
      {showContent ? (
        renderLayout()
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="text-2xl mb-2">📄</div>
            <div className="text-sm font-medium text-gray-700">{template.name}</div>
            <div className="text-xs text-gray-500 mt-1">{template.layout}</div>
          </div>
        </div>
      )}
    </div>
  );
}; 