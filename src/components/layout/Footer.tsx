import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">ATP Medical Education</h3>
            <p className="text-gray-300">
              High-quality medical education resources for students and professionals.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase mb-4">Content</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-gray-300 hover:text-white">
                  Videos
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase mb-4">Membership</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/membership" className="text-gray-300 hover:text-white">
                  Join Premium
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ATP Medical Education. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}