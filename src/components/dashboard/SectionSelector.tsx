import { Section, SECTIONS } from '@/types/sections';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  GraduationCap, 
  Headphones, 
  FileText, 
  BookOpen, 
  Award, 
  Target, 
  MessageSquare,
  Users 
} from 'lucide-react';

const iconMap = {
  GraduationCap,
  Headphones,
  FileText,
  BookOpen,
  Award,
  Target,
  MessageSquare,
  Users
};

interface SectionSelectorProps {
  selectedSection: string;
  onSectionChange: (sectionId: string) => void;
}

export function SectionSelector({ selectedSection, onSectionChange }: SectionSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
      {SECTIONS.map((section) => {
        const Icon = iconMap[section.icon as keyof typeof iconMap] || Users; // Fallback to Users icon
        const isSelected = selectedSection === section.id;
        
        return (
          <Card 
            key={section.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              isSelected 
                ? "ring-2 ring-primary shadow-lg bg-primary/5" 
                : "hover:bg-muted/50"
            )}
            onClick={() => onSectionChange(section.id)}
          >
            <CardContent className="p-4 text-center">
              {Icon && (
                <Icon className={cn(
                  "h-8 w-8 mx-auto mb-2",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )} />
              )}
              <h3 className={cn(
                "font-medium text-sm",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {section.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {section.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}