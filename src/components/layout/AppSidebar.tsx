import { useState } from "react";
import { BarChart3, Trophy, User, LogOut, Home } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  const getNavClasses = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/20 text-primary font-medium border border-primary/30" 
      : "hover:bg-white/10 hover:text-primary transition-all duration-200";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Sidebar className="glass-card border-r border-white/20">
      <SidebarContent className="p-4">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gradient">Intern Hub</h2>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => `
                        flex items-center gap-3 p-3 rounded-lg transition-all duration-200 
                        ${getNavClasses({ isActive })}
                      `}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section */}
        <div className="mt-auto pt-8 border-t border-white/20">
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start glass-card border-white/20 hover:bg-destructive/20 hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {!collapsed && "Logout"}
            </Button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}