import { HelpCircle, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-2xl font-bold text-pwc-navy" data-testid="logo">
                <span className="text-pwc-orange">PwC</span> BRD Generator
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="text-pwc-gray hover:text-pwc-navy transition-colors"
              data-testid="button-help"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
            <button 
              className="text-pwc-gray hover:text-pwc-navy transition-colors"
              data-testid="button-user"
            >
              <UserCircle className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
