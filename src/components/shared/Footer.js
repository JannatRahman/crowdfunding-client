import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-xl text-white">CrowdFund</span>
            </div>
            <p className="text-sm text-gray-400">
              Empowering ideas through community funding. Turn your vision into reality.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={ROUTES.CAMPAIGNS} className="hover:text-white transition-colors">Explore Campaigns</Link></li>
              <li><Link href={ROUTES.REGISTER} className="hover:text-white transition-colors">Start a Campaign</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">Help Center</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Contact Us</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Cookie Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} CrowdFund. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
