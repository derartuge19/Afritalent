import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail } from
'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white">AfriTalent</span>
            </Link>
            <p className="text-sm leading-6 text-slate-400 max-w-xs">
              Connecting Africa's top talent with global opportunities through
              AI-powered matching and labor market intelligence.
            </p>
            <div className="flex space-x-6">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) =>
              <a
                key={i}
                href="#"
                className="text-slate-400 hover:text-teal-400">

                  <Icon className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Solutions
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {[
                  'Job Search',
                  'Talent Matching',
                  'Market Analytics',
                  'Skill Assessment'].
                  map((item) =>
                  <li key={item}>
                      <a
                      href="#"
                      className="text-sm leading-6 hover:text-white">

                        {item}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Support
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {['Help Center', 'Documentation', 'Guides', 'API Status'].map(
                    (item) =>
                    <li key={item}>
                        <a
                        href="#"
                        className="text-sm leading-6 hover:text-white">

                          {item}
                        </a>
                      </li>

                  )}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Company
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {['About', 'Blog', 'Careers', 'Press', 'Partners'].map(
                    (item) =>
                    <li key={item}>
                        <a
                        href="#"
                        className="text-sm leading-6 hover:text-white">

                          {item}
                        </a>
                      </li>

                  )}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Subscribe
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  The latest job market trends, sent to your inbox weekly.
                </p>
                <form className="mt-6 sm:flex sm:max-w-md">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full min-w-0 rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6" />

                  <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                    <Button variant="primary" className="w-full">
                      Subscribe
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-slate-400">
            &copy; {new Date().getFullYear()} AfriTalent Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>);

}