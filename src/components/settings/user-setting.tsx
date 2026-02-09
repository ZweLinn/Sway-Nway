"use client";
import { ModeToggle } from "@/components/settings/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { signOut ,useSession  } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "../layout/sidebar-user-nav";

export default function UserSettings() {
  const { data: session } = useSession();
  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and set your appearance preferences.
        </p>
      </div>

      <Separator />

      <div className="grid gap-8">
        {/* Profile Section */}
        {/* <section className="space-y-4">
          <h2 className="text-xl font-semibold">Profile</h2>
          <Card>
            <CardHeader>
              <CardTitle>Display Name</CardTitle>
              <CardDescription>How your name will appear in the app.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input placeholder="Your Name" defaultValue="John Doe" />
              </div>
              <Button variant="secondary" size="sm">Update Profile</Button>
            </CardContent>
          </Card>
        </section> */}

        {/* Appearance Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Appearance</h2>
          <Card>
            <CardHeader>
              <CardTitle>Interface Theme</CardTitle>
              <CardDescription>
                Customize how the application looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme Mode</Label>
                <p className="text-[0.8rem] text-muted-foreground">
                  Switch between light and dark mode.
                </p>
              </div>
              <ModeToggle />
            </CardContent>
          </Card>
        </section>

        {/* Notifications Section */}
        {/* <section className="space-y-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <Card>
            <CardContent className="divide-y pt-6">
              <div className="flex items-center justify-between pb-4">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Receive emails about your account activity.
                  </p>
                </div>
                <Switch disabled />
              </div>
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Receive emails about new features and updates.
                  </p>
                </div>
                <Switch disabled />
              </div>
            </CardContent>
          </Card>
        </section> */}

        {/* Danger Zone */}
        {/* <section className="space-y-4">
          <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
          <Card className="border-destructive/50">
            <CardContent className="flex items-center justify-between pt-6">
              <div className="space-y-0.5">
                <Label>Delete Account</Label>
                <p className="text-[0.8rem] text-muted-foreground">
                  Permanently delete your account and all data.
                </p>
              </div>
              <Button variant="destructive">Delete</Button>
            </CardContent>
          </Card>
        </section> */}
        {/* Account / Logout Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Account</h2>
          <Card>
            <CardContent className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-muted rounded-full">
                  <Avatar className="h-7 w-7">
            <AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || "User"} />
            <AvatarFallback className="text-xs">
              {getInitials(session?.user?.name)}
            </AvatarFallback>
          </Avatar>
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {session?.user?.email || "Not signed in"}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}