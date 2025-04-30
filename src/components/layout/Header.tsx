import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import SearchBar from '../search/SearchBar';


export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/" className="text-xl font-bold text-blue-600">
              ATP Medical Education
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-6">
            <Link href="/" className={`${router.pathname === '/' ? 'text-blue-600' : 'text-gray-700'}`}>
              Home
            </Link>
            <Link href="/videos" className={`${router.pathname.startsWith('/videos') ? 'text-blue-600' : 'text-gray-700'}`}>
              Videos
            </Link>
            <Link href="/membership" className={`${router.pathname === '/membership' ? 'text-blue-600' : 'text-gray-700'}`}>
              Membership
            </Link>
          </div>
          <div className="hidden md:block">
                <SearchBar />
          </div>
          <div className="flex items-center space-x-4">
            {!session ? (
              <>
                <Link href="/auth/signin" className="text-gray-700 hover:text-blue-600">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link href="/account" className="text-gray-700 hover:text-blue-600">
                  My Account
                </Link>
                <button 
                  onClick={() => signOut()} 
                  className="text-gray-700 hover:text-blue-600"
                >
                  Sign Out
                </button>
              </>
            )}
            
            <button 
              className="md:hidden" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t">
            <Link href="/" className="block py-2">
              Home
            </Link>
            <Link href="/videos" className="block py-2">
              Videos
            </Link>
            <Link href="/membership" className="block py-2">
              Membership
            </Link>
            <div className="py-2">
                <SearchBar />
            </div>
          </div>
          
        )}
      </div>
    </header>
  );
}