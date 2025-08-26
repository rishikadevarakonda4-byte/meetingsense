export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-pwc-gray" data-testid="text-copyright">
              © 2024 PwC. All rights reserved.
            </p>
            <a href="#" className="text-sm text-pwc-blue hover:text-pwc-navy" data-testid="link-privacy">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-pwc-blue hover:text-pwc-navy" data-testid="link-terms">
              Terms of Service
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-pwc-gray" data-testid="text-version">v1.0.0</span>
            <a href="#" className="text-sm text-pwc-blue hover:text-pwc-navy" data-testid="link-support">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
