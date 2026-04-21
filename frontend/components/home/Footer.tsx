import { motion } from 'framer-motion';
import { Orbit, Twitter, Linkedin, Github, Mail } from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Integrations', 'Changelog', 'Roadmap'],
  Company: ['About', 'Blog', 'Careers', 'Press', 'Partners'],
  Resources: ['Documentation', 'Help Center', 'Community', 'Templates', 'Webinars'],
  Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Mail, href: '#', label: 'Email' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <motion.a
              href="#"
              className="inline-flex items-center gap-2 group mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-glow-sm">
                  <Orbit className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold text-white">
                HireOrbit<span className="text-emerald-400">AI</span>
              </span>
            </motion.a>
            <p className="text-zinc-400 text-sm max-w-xs mb-6">
              AI-powered career platform that helps you land your dream job faster with smart matching and personalized guidance.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href={link === 'Features' ? '/features' : link === 'Pricing' ? '/pricing' : '#'}
                      className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © 2024 HireOrbitAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
