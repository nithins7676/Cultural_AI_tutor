import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, RefreshCw, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface LogoutButtonProps {
  onLogout: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  onLogout,
  variant = 'outline',
  size = 'default',
  className = '',
  showIcon = true
}) => {
  const handleLogout = () => {
    // Clear any stored user data
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userProgress');
    localStorage.removeItem('chatHistory');
    
    // Clear session storage
    sessionStorage.clear();
    
    // Call the logout callback
    onLogout();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`${className} ${variant === 'destructive' ? 'bg-red-500 hover:bg-red-600' : ''}`}
        >
          {showIcon && <LogOut className="w-4 h-4 mr-2" />}
          Reset / Logout
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Reset Learning Session
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Are you sure you want to reset your learning session? This will:
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Clear your current profile and progress</li>
              <li>Reset all learning data</li>
              <li>Return you to the initial setup</li>
              <li>Clear any saved chat conversations</li>
            </ul>
            <p className="mt-3 text-sm font-medium text-orange-600">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-300 hover:bg-gray-50">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Yes, Reset Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutButton; 