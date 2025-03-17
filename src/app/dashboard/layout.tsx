"use client"

import {Session} from "next-auth";
import {ReactNode} from "react";

export default function DashboardLayout({children}: { children: ReactNode, session: Session }) {
    return <div>{children}</div>
}