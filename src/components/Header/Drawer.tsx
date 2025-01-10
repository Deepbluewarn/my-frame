'use client'

import { Burger, Drawer, ScrollArea } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function HeaderDrawer({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

    useEffect(() => {
        closeDrawer();
    }, [pathname])

    return (
        <>
            <Burger opened={drawerOpened} hiddenFrom="sm" color="white" onClick={toggleDrawer} />
            <Drawer opened={drawerOpened} onClose={closeDrawer} zIndex={100}>
                <ScrollArea mx="-md">
                    { children }
                </ScrollArea>
            </Drawer>
        </>

    )
}
