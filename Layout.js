import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import {
  Home,
  Calendar,
  Users,
  Trophy,
  MessageSquare,
  Image,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { title: "Home", url: "Home", icon: Home },
  { title: "Events", url: "Events", icon: Calendar },
  { title: "Fighters", url: "Fighters", icon: Users },
  { title: "Leaderboard", url: "Leaderboard", icon: Trophy },
  { title: "Messages", url: "Messages", icon: MessageSquare },
  { title: "Media", url: "MediaGallery", icon: Image }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      console.log("Not logged in");
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <style>{`
        :root {
          --background: 9 9 11;
          --foreground: 250 250 250;
          --card: 24 24 27;
          --card-foreground: 250 250 250;
          --primary: 239 68 68;
          --primary-foreground: 255 255 255;
          --muted: 39 39 42;
          --border: 39 39 42;
        }
      `}</style>

      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:flex md:flex-col bg-zinc-900 border-r border-zinc-800">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">MFL</h1>
              <p className="text-xs text-zinc-400">Friends League</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.url || 
                           location.pathname === createPageUrl(item.url);
            return (
              <Link
                key={item.url}
                to={createPageUrl(item.url)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-red-600 text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="p-4 border-t border-zinc-800">
            <Link
              to={createPageUrl("Profile")}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors mb-2"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-red-600">
                  {user.full_name?.[0] || user.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user.full_name || user.email}</p>
                <p className="text-xs text-zinc-400 capitalize">{user.role || "Fighter"}</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-black">MFL</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-zinc-900 border-b border-zinc-800 p-4">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.url || 
                               location.pathname === createPageUrl(item.url);
                return (
                  <Link
                    key={item.url}
                    to={createPageUrl(item.url)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-red-600 text-white"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                );
              })}
            </nav>
            {user && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <Link
                  to={createPageUrl("Profile")}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors mb-2"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-red-600">
                      {user.full_name?.[0] || user.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{user.full_name || user.email}</p>
                    <p className="text-xs text-zinc-400 capitalize">{user.role}</p>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-zinc-400 hover:text-white"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="md:ml-64 pt-16 md:pt-0 min-h-screen">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800">
        <div className="flex justify-around p-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.url || 
                           location.pathname === createPageUrl(item.url);
            return (
              <Link
                key={item.url}
                to={createPageUrl(item.url)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                  isActive ? "text-red-500" : "text-zinc-400"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
