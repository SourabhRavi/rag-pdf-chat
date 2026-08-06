import {
    FileText,
    Bot,
    History,
    Settings,
} from "lucide-react";

export const SIDEBAR_DATA = {
    navMain: [
        {
            title: "Documents",
            url: "/documents",
            icon: FileText,
            items: [
                {
                    title: "All Documents",
                    url: "/documents",
                },
                {
                    title: "Upload Document",
                    url: "/documents/upload",
                },
            ],
        },
        {
            title: "AI Chat",
            url: "/chat",
            icon: Bot,
            items: [
                {
                    title: "New Chat",
                    url: "/chat",
                },
                {
                    title: "Saved Chats",
                    url: "/chat/history",
                },
            ],
        },
        {
            title: "History",
            url: "/history",
            icon: History,
            items: [
                {
                    title: "Recent Activity",
                    url: "/history",
                },
            ],
        },
        {
            title: "Settings",
            url: "/settings",
            icon: Settings,
            items: [
                {
                    title: "Profile",
                    url: "/settings/profile",
                },
                {
                    title: "Appearance",
                    url: "/settings/appearance",
                },
            ],
        },
    ],
};