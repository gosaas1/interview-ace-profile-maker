import React from 'react';
import { motion } from 'framer-motion';
import { Check, User, Briefcase, GraduationCap, Code, FolderOpen, Award, Users, Palette, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepData {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isCompleted: boolean;
  isActive: boolean;
  isAccessible: boolean;
}

interface CVBuilderStepperProps {
  currentStep: number;
  steps: StepData[];
  onStepClick: (stepIndex: number) => void;
  className?: string;
}

export const CVBuilderStepper: React.FC<CVBuilderStepperProps> = ({
  currentStep,
  steps,
  onStepClick,
  className
}) => {
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop Stepper */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <StepIndicator
                step={step}
                index={index}
                currentStep={currentStep}
                onStepClick={onStepClick}
              />
              {index < steps.length - 1 && (
                <StepConnector
                  isCompleted={step.isCompleted}
                  isActive={index < currentStep}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Stepper */}
      <div className="lg:hidden mb-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                {steps[currentStep]?.icon && React.createElement(steps[currentStep].icon, { className: 'w-4 h-4 text-white' })}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{steps[currentStep]?.title}</h3>
              <p className="text-sm text-gray-600">{steps[currentStep]?.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StepIndicatorProps {
  step: StepData;
  index: number;
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  step,
  index,
  currentStep,
  onStepClick
}) => {
  const isActive = index === currentStep;
  const isCompleted = step.isCompleted;
  const isAccessible = step.isAccessible;

  return (
    <div className="flex flex-col items-center">
      <motion.button
        onClick={() => isAccessible && onStepClick(index)}
        disabled={!isAccessible}
        className={cn(
          "relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          {
            "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg": isActive,
            "bg-green-500 text-white": isCompleted && !isActive,
            "bg-white/10 backdrop-blur-md border border-white/20 text-gray-400": !isActive && !isCompleted,
            "cursor-pointer hover:scale-105": isAccessible,
            "cursor-not-allowed opacity-50": !isAccessible
          }
        )}
        whileHover={isAccessible ? { scale: 1.05 } : {}}
        whileTap={isAccessible ? { scale: 0.95 } : {}}
      >
        {isCompleted && !isActive ? (
          <Check className="w-5 h-5" />
        ) : (
          <step.icon className="w-5 h-5" />
        )}
        
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-30"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
      
      <div className="mt-2 text-center max-w-20">
        <p className={cn(
          "text-xs font-medium transition-colors duration-200",
          {
            "text-blue-600": isActive,
            "text-green-600": isCompleted && !isActive,
            "text-gray-500": !isActive && !isCompleted
          }
        )}>
          {step.title}
        </p>
      </div>
    </div>
  );
};

interface StepConnectorProps {
  isCompleted: boolean;
  isActive: boolean;
}

const StepConnector: React.FC<StepConnectorProps> = ({ isCompleted, isActive }) => {
  return (
    <div className="flex-1 mx-4">
      <div className="h-0.5 bg-gray-200 relative overflow-hidden">
        <motion.div
          className={cn(
            "absolute inset-0 h-full",
            {
              "bg-gradient-to-r from-blue-500 to-purple-600": isActive || isCompleted,
              "bg-green-500": isCompleted
            }
          )}
          initial={{ width: 0 }}
          animate={{ width: isActive || isCompleted ? "100%" : "0%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

// Default steps configuration
export const defaultSteps: StepData[] = [
  {
    id: 'template',
    title: 'Template',
    description: 'Choose design',
    icon: Palette,
    isCompleted: false,
    isActive: true,
    isAccessible: true
  },
  {
    id: 'personal',
    title: 'Personal',
    description: 'Basic information',
    icon: User,
    isCompleted: false,
    isActive: false,
    isAccessible: false
  },
  {
    id: 'experience',
    title: 'Experience',
    description: 'Work history',
    icon: Briefcase,
    isCompleted: false,
    isActive: false,
    isAccessible: false
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Academic background',
    icon: GraduationCap,
    isCompleted: false,
    isActive: false,
    isAccessible: false
  },
  {
    id: 'skills',
    title: 'Skills',
    description: 'Technical & soft skills',
    icon: Code,
    isCompleted: false,
    isActive: false,
    isAccessible: false
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Portfolio & achievements',
    icon: FolderOpen,
    isCompleted: false,
    isActive: false,
    isAccessible: false
  },
  {
    id: 'certifications',
    title: 'Certifications',
    description: 'Licenses & awards',
    icon: Award,
    isCompleted: false,
    isActive: false,
    isAccessible: false
  },
  {
    id: 'references',
    title: 'References',
    description: 'Professional contacts',
    icon: Users,
    isCompleted: false,
    isActive: false,
    isAccessible: false
  },
  {
    id: 'preview',
    title: 'Preview',
    description: 'Review & finalize',
    icon: Eye,
    isCompleted: false,
    isActive: false,
    isAccessible: false
  }
]; 