import * as React from "react";

import { SearchForm } from "@/components/common/dashboard/search-form";
import { VersionSwitcher } from "@/components/common/dashboard/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SIDEBAR_DATA } from "@/constants/sidebar";
import { useLocation } from "react-router-dom";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {SIDEBAR_DATA.navMain.map((menuItem) => (
          <SidebarGroup key={menuItem.title}>
            <SidebarGroupLabel className="flex items-center gap-1.5 font-semibold opacity-70">
              <span>{menuItem.title}</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItem.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton
                      isActive={location.pathname == subItem.url}
                      render={<a href={subItem.url} />}
                    >
                      <span>{subItem.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
