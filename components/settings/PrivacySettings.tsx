'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Shield, Lock, UserX, Eye } from 'lucide-react'

export function PrivacySettings() {
  const [settings, setSettings] = useState({
    privacyMode: false,
    twoFactorAuth: false,
    dataCollection: true,
    activityTracking: true
  })

  const handleSave = () => {
    console.log('Saving privacy settings:', settings)
  }

  const handleDeleteAccount = () => {
    console.log('Initiating account deletion process')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <Label>Enhanced Privacy Mode</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Additional privacy protections for sensitive data
              </p>
            </div>
            <Switch
              checked={settings.privacyMode}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, privacyMode: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <Label>Two-Factor Authentication</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Secure your account with 2FA
              </p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, twoFactorAuth: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <Label>Data Collection</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Allow anonymous usage data collection
              </p>
            </div>
            <Switch
              checked={settings.dataCollection}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, dataCollection: checked }))
              }
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <UserX className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground"
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
} 